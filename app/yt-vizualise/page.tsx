'use client'

import { EllipsisVertical, FileText } from 'lucide-react'
import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Node,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState, useMemo } from 'react';

enum TagColors {
    RED = 'bg-red-500/30',
    GREEN = 'bg-green-500/30',
    BLUE = 'bg-blue-500/30',
    YELLOW = 'bg-yellow-500/30',
    PURPLE = 'bg-purple-500/30',
    ORANGE = 'bg-orange-500/30',
    PINK = 'bg-pink-500/30',
    GRAY = 'bg-gray-500/30',
    TEAL = 'bg-teal-500/30',
    INDIGO = 'bg-indigo-500/30',
    VIOLET = 'bg-violet-500/30',
    LIME = 'bg-lime-500/30',
    CYAN = 'bg-cyan-500/30',
}

interface GenericNodeParams {
    heading: string | null;
    description: string | null;
    tags?: string[] | null | undefined;
    tagColor?: TagColors;
}

const tagTextColorMap: Record<TagColors, string> = {
    [TagColors.RED]: 'text-red-700',
    [TagColors.GREEN]: 'text-green-700',
    [TagColors.BLUE]: 'text-blue-700',
    [TagColors.YELLOW]: 'text-yellow-700',
    [TagColors.PURPLE]: 'text-purple-700',
    [TagColors.ORANGE]: 'text-orange-700',
    [TagColors.PINK]: 'text-pink-700',
    [TagColors.GRAY]: 'text-gray-700',
    [TagColors.TEAL]: 'text-teal-700',
    [TagColors.INDIGO]: 'text-indigo-700',
    [TagColors.VIOLET]: 'text-violet-700',
    [TagColors.LIME]: 'text-lime-700',
    [TagColors.CYAN]: 'text-cyan-700',
};

function getRandomTagColor(): TagColors {
    const colorValues = Object.values(TagColors);
    const randomIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[randomIndex] as TagColors;
}

function GenericNode({ data }: { data: GenericNodeParams }): React.ReactNode {

    const tagColors = useMemo(() => {
        if (!data.tags || !Array.isArray(data.tags)) return [];
        return data.tags.map(() => getRandomTagColor());
    }, [data.tags]);

    return (
        <div className='shadow-lg bg-gray-50 rounded-lg p-2 min-w-[15rem] min-h-[8rem] md:p-4 lg:p-6 xl:p-8 flex flex-col items-start gap-2 relative'>

            <Handle type="target" style={{backgroundColor: "grey"}} position={Position.Left} className="w-2 h-2 bg-blue-500 p-1" />
            <Handle type="source" style={{backgroundColor: "grey"}} position={Position.Right} className="w-2 h-2 bg-blue-500 p-1" />

            <div className='flex flex-row w-full items-center justify-between'>
                <div className='flex gap-2 items-center'>
                    {data.tagColor && <div className={`min-w-3 min-h-3 ${data.tagColor} rounded-full`} />}
                    <h2 className='font-semibold text-sm md:text-base text-gray-800'>{data.heading ?? ""}</h2>
                </div>
                <EllipsisVertical className='w-4 h-4 text-gray-400 cursor-pointer' />
            </div>
            <p className='text-xs font-medium text-gray-600/80'>{data.description ?? ""}</p>
            <div className='flex flex-row gap-1 items-center w-full mt-4'>
                {
                    data.tags && Array.isArray(data.tags) && (
                        data.tags.map((item: string, id: number) => {
                            const tagColor = tagColors[id] || TagColors.GRAY;
                            const textColor = tagTextColorMap[tagColor as TagColors] || 'text-gray-700';
                            return (
                                <div className={`p-1 ${tagColor} rounded shadow text-[10px] ${textColor}`} key={id}>
                                    #{item}
                                </div>
                            )
                        })
                    )
                }
                <FileText className='w-6 h-6 cursor-pointer text-gray-700 font-bold p-1.5 bg-gray-300 rounded-md ml-auto' />
            </div>
        </div>
    )
}

const initialNodes: Node[] = [
    {
        id: 'n1',
        type: 'generic',
        position: { x: 100, y: 100 },
        data: {
            heading: 'Node 1',
            description: 'This is the first node.',
            tags: ['tag1', 'tag2'],
            tagColor: TagColors.BLUE,
        }
    },
    {
        id: 'n2',
        type: 'generic',
        position: { x: 400, y: 100 },
        data: {
            heading: 'Node 2',
            description: 'This is the second node.',
            tags: ['tag3'],
            tagColor: TagColors.GREEN,
        }
    },
];

const initialEdges = [{
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    type: 'default',
    style: { stroke: '#333', strokeWidth: 2 }
}];

const nodeTypes = {
    generic: GenericNode,
};

export default function Page() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeTypes}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} color="#aaa" />
            </ReactFlow>
        </div>
    );
}