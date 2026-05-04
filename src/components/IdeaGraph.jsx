import React, { useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Share2 } from 'lucide-react';
import useStore from '../store/useStore';
import './IdeaGraph.css';

const IdeaGraph = ({ onNodeClick }) => {
  const ideas = useStore(state => state.ideas);

  // ideas 데이터를 기반으로 노드/엣지를 동적으로 생성
  const { generatedNodes, generatedEdges } = useMemo(() => {
    if (ideas.length === 0) return { generatedNodes: [], generatedEdges: [] };

    const nodes = ideas.map((idea, index) => ({
      id: String(idea.id),
      position: {
        x: 150 + (index % 3) * 280,
        y: 80 + Math.floor(index / 3) * 200,
      },
      data: {
        label: (
          <div className={`graph-node ${index === 0 ? 'main-node' : 'remix-node'}`}>
            <div className="node-tag" style={{ background: `${idea.tag?.color || '#3A75F6'}1A`, color: idea.tag?.color || '#3A75F6' }}>
              {idea.tag?.label || '영감'}
            </div>
            <strong>{idea.title}</strong>
            <span>{idea.author?.handle || 'anonymous'}</span>
          </div>
        ),
        idea: idea,
      },
      style: { border: 'none', background: 'transparent', width: 220 },
    }));

    // 리믹스 관계가 있는 경우 엣지 연결
    const edges = ideas
      .filter(idea => idea.parentId)
      .map(idea => ({
        id: `e${idea.parentId}-${idea.id}`,
        source: String(idea.parentId),
        target: String(idea.id),
        animated: true,
        style: { stroke: idea.tag?.color || '#8B5CF6' },
      }));

    return { generatedNodes: nodes, generatedEdges: edges };
  }, [ideas]);

  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);

  React.useEffect(() => {
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [generatedNodes, generatedEdges]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // 게시글이 없을 때 빈 상태 표시
  if (ideas.length === 0) {
    return (
      <div className="idea-graph-container empty">
        <div className="graph-empty-state">
          <Share2 size={48} strokeWidth={1} />
          <h2>아직 연결할 영감이 없습니다</h2>
          <p>아이디어를 작성하면 여기에 관계 그래프가 그려집니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="idea-graph-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => {
          if (node.data?.idea) {
            onNodeClick(node.data.idea);
          }
        }}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#CBD5E1" gap={16} />
        <Controls />
        <MiniMap zoomable pannable nodeColor={() => '#3A75F6'} />
      </ReactFlow>
    </div>
  );
};

export default IdeaGraph;
