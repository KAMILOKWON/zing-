import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const MOCK_IDEAS = [];

const useStore = create(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      session: null,
      isAdmin: false,

      // Auth Actions
      setUser: (user) => set({ user, isAdmin: user?.email?.toLowerCase() === 'admin@zing.io' }),
      setSession: (session) => set({ session }),
      
      signUp: async (email, password, userData) => {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: userData.name,
              handle: userData.handle,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.handle}`
            }
          }
        });
        if (error) throw error;
        return data;
      },
      
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      },
      
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, isAdmin: false });
      },

      // Data Actions
      fetchIdeas: async () => {
        // 1. 아이디어 가져오기
        const { data: ideasData, error: ideasError } = await supabase
          .from('ideas')
          .select(`
            *,
            comments (*)
          `)
          .order('created_at', { ascending: false });

        if (ideasError) {
          console.error('Error fetching ideas:', ideasError);
          return;
        }

        if (ideasData) {
          const formattedIdeas = ideasData.map(idea => ({
            id: idea.id,
            title: idea.title,
            content: idea.content,
            theme: idea.theme,
            folder: idea.folder,
            time: new Date(idea.created_at).toLocaleDateString(),
            image: idea.image_url,
            likes: idea.likes || 0,
            remixes: 0,
            hasRemix: idea.parent_id !== null,
            parentId: idea.parent_id,
            isLiked: false,
            isBookmarked: false,
            tag: { label: idea.tag_label, color: idea.tag_color },
            author: { 
              handle: idea.author_handle, 
              avatar: idea.author_avatar,
              name: idea.author_handle
            },
            comments: (idea.comments || []).map(c => ({
              id: c.id,
              user: c.user_handle,
              text: c.content,
              time: new Date(c.created_at).toLocaleDateString()
            }))
          }));
          set({ ideas: formattedIdeas });
        }
      },

      ideas: [],
      filter: '전체',
      communityFilter: '전체',
      viewMode: 'grid',
      activeTab: 'home', // 'home'이 기본
      isCommandPaletteOpen: false,
      interests: { likedTags: [], dislikedTags: [] },
      handshakes: [],
      recentViewedIds: [],
      bookmarkedIds: [],
      folders: [
        { id: 'random', label: '아무말', emoji: '💬' },
        { id: 'product', label: '제품 아이디어', emoji: '💡' },
        { id: 'creative', label: '창작', emoji: '🎨' },
        { id: 'problem', label: '문제 발견', emoji: '🔍' },
        { id: 'ai', label: 'AI', emoji: '🤖' },
        { id: 'daily', label: '일상', emoji: '🌱' }
      ],
      
      setActiveTab: (tab) => set({ activeTab: tab, filter: '전체', communityFilter: '전체' }),
      setFilter: (filter) => set({ filter, communityFilter: '전체' }),
      setCommunityFilter: (community) => set({ communityFilter: community, filter: '전체' }),
      setIdeas: (ideas) => set({ ideas }),

      toggleBookmark: (ideaId) => set((state) => ({
        bookmarkedIds: state.bookmarkedIds.includes(ideaId)
          ? state.bookmarkedIds.filter(id => id !== ideaId)
          : [...state.bookmarkedIds, ideaId]
      })),

      addFolder: (label, emoji) => set((state) => ({
        folders: [...state.folders, { id: Date.now(), label, emoji }]
      })),

      deleteFolder: (label) => set((state) => ({
        folders: state.folders.filter(f => f.label !== label)
      })),
      
      addToRecent: (ideaId) => set((state) => ({
        recentViewedIds: [ideaId, ...state.recentViewedIds.filter(id => id !== ideaId)].slice(0, 10)
      })),

      toggleLike: (ideaId) => set((state) => ({
        ideas: state.ideas.map((idea) => 
          idea.id === ideaId 
            ? { ...idea, isLiked: !idea.isLiked, likes: idea.isLiked ? idea.likes - 1 : idea.likes + 1 }
            : idea
        )
      })),

      toggleBookmark: (ideaId) => set((state) => ({
        ideas: state.ideas.map((idea) => 
          idea.id === ideaId ? { ...idea, isBookmarked: !idea.isBookmarked } : idea
        )
      })),

      addComment: async (ideaId, commentText) => {
        const user = get().user;
        const handle = user?.user_metadata?.handle || 'anonymous';
        
        const { error } = await supabase
          .from('comments')
          .insert([{
            idea_id: ideaId,
            user_handle: handle,
            content: commentText,
            user_avatar: user?.user_metadata?.avatar_url || '👤'
          }]);

        if (error) {
          console.error('Error adding comment:', error);
          return;
        }
        get().fetchIdeas();
      },

      setViewMode: (viewMode) => set({ viewMode }),
      sortMode: 'latest',
      setSortMode: (mode) => set({ sortMode: mode }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),

      createIdea: async (newIdea) => {
        const user = get().user;
        const handle = user?.user_metadata?.handle || 'anonymous';
        
        const { error } = await supabase
          .from('ideas')
          .insert([{
            title: newIdea.title,
            content: newIdea.content,
            theme: newIdea.theme,
            folder: newIdea.folder,
            author_handle: handle,
            author_avatar: user?.user_metadata?.avatar_url || '👤',
            image_url: newIdea.image || null,
            tag_label: newIdea.tag?.label,
            tag_color: newIdea.tag?.color,
            parent_id: newIdea.parentId || null
          }]);

        if (error) {
          console.error('Error creating idea:', error);
          throw error;
        }
        get().fetchIdeas();
      },

      deleteIdea: (ideaId) => set((state) => ({
        ideas: state.ideas.filter((idea) => idea.id !== ideaId)
      })),

      reportIdea: (ideaId) => set((state) => ({
        ideas: state.ideas.filter((idea) => idea.id !== ideaId)
      })),

      addInterest: (tagLabel, isPositive) => set((state) => {
        const key = isPositive ? 'likedTags' : 'dislikedTags';
        if (state.interests[key].includes(tagLabel)) return state;
        return {
          interests: {
            ...state.interests,
            [key]: [...state.interests[key], tagLabel]
          }
        };
      }),

      toggleHandshake: (ideaId) => set((state) => ({
        handshakes: state.handshakes.includes(ideaId) 
          ? state.handshakes.filter(id => id !== ideaId)
          : [...state.handshakes, ideaId]
      })),
    }),
    {
      name: 'zing-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2, // 버전을 올려 기존 더미 데이터가 포함된 로컬 스토리지를 초기화합니다.
    }
  )
);

export default useStore;
