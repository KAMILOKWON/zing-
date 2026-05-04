import React, { useCallback } from 'react';
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './IdeaGraph.css';

const initialNodes = [
  {
    id: '1',
    position: { x: 250, y: 50 },
    data: { 
      label: (
        <div className="graph-node main-node">
          <div className="node-tag" style={{ background: '#3A75F61A', color: '#3A75F6' }}>AI & 기술</div>
          <strong>AI 데일리 브리핑으로 하루 시작하기</strong>
          <span>@sunwoo_p</span>
        </div>
      ) 
    },
    style: { border: 'none', background: 'transparent', width: 220 }
  },
  {
    id: '2',
    position: { x: 100, y: 200 },
    data: { 
      label: (
        <div className="graph-node remix-node">
          <div className="node-tag" style={{ background: '#8B5CF61A', color: '#8B5CF6' }}>제품 아이디어</div>
          <strong>아이디어를 시각적으로 연결하는 그래프</strong>
          <span>@jieun_idea</span>
        </div>
      ) 
    },
    style: { border: 'none', background: 'transparent', width: 220 }
  },
  {
    id: '3',
    position: { x: 400, y: 200 },
    data: { 
      label: (
        <div className="graph-node remix-node">
          <div className="node-tag" style={{ background: '#F59E0B1A', color: '#F59E0B' }}>창작 실험</div>
          <strong>플로팅 감정으로 빠른 피드백</strong>
          <span>@ruri_lee</span>
        </div>
      ) 
    },
    style: { border: 'none', background: 'transparent', width: 220 }
  },
  {
    id: '4',
    position: { x: 250, y: 350 },
    data: { 
      label: (
        <div className="graph-node ai-node">
          <div className="node-tag" style={{ background: '#10B9811A', color: '#10B981' }}>Zingger 추천</div>
          <strong>음성 기반 데일리 브리핑</strong>
          <span>@ZinggerAI</span>
        </div>
      ) 
    },
    style: { border: 'none', background: 'transparent', width: 220 }
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8B5CF6' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#F59E0B' } },
  { id: 'e2-4', source: '2', target: '4', style: { stroke: '#CBD5E1', strokeDasharray: '5,5' } },
  { id: 'e3-4', source: '3', target: '4', style: { stroke: '#CBD5E1', strokeDasharray: '5,5' } },
];

const IdeaGraph = ({ onNodeClick }) => {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="idea-graph-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => {
          // 모의 데이터 클릭 연동
          onNodeClick({
            id: node.id,
            title: node.id === '1' ? 'AI 데일리 브리핑' : '파생 아이디어',
            content: '그래프 노드 클릭을 통한 상세 보기 연동 시뮬레이션입니다.',
            author: { name: '테스트유저', handle: '@test', avatar: '😎' },
            time: '방금 전',
            tag: { label: '시각화', color: '#8B5CF6' },
            likes: 10,
            comments: 2,
            remixes: 1
          });
        }}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#CBD5E1" gap={16} />
        <Controls />
        <MiniMap zoomable pannable nodeColor={(n) => {
          if (n.id === '1') return '#3A75F6';
          if (n.id === '4') return '#10B981';
          return '#8B5CF6';
        }} />
      </ReactFlow>
    </div>
  );
};

export default IdeaGraph;
