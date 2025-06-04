import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTeamStore } from '../../stores/team.store';
import { PlusIcon, Trash } from 'lucide-react';
import { Code, Briefcase, Users } from 'lucide-react';
import nodeTypes from './TeamFlowTypes';
import { applyNodeChanges } from 'reactflow';
import EditModal from '@/components/editModal';

function TeamFlow() {
    const { members, edges, addMember, updateMember, addEdge, updateMemberPosition, deleteMember, deleteEdge } = useTeamStore();
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');

    const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useReactFlow();

    // React Flow state
    const initialNodes: Node[] = useMemo(() => {
        return members.map((m) => ({
            id: m.id,
            type: 'teamMember',
            position: m.position,
            data: {
                name: m.name,
                role: m.role,
                onEdit: () => {
                    setEditId(m.id);
                    setEditName(m.name);
                    setEditRole(m.role);
                },
            },
        }));
    }, [members]);

    // Local state for React Flow nodes
    const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>(initialNodes);

    // Sync local state with Zustand members when members change (add/delete)
    useEffect(() => {
        setReactFlowNodes(initialNodes);
    }, [initialNodes]); // Depend on initialNodes memo result

    const flowEdges: Edge[] = useMemo(() => {
        return edges.map((e) => ({ id: e.id, source: e.source, target: e.target }));
    }, [edges]);

    const handleSave = () => {
        if (editId) {
            updateMember(editId, { name: editName, role: editRole });
            setEditId(null);
        }
    };


    const handleDelete = () => {
        if (editId) {
            deleteMember(editId);
            setEditId(null);
        }
    };

    // Handle node changes internally for smooth dragging
    const handleNodesChange = (changes: any[]) => {
        setReactFlowNodes((nds) => applyNodeChanges(changes, nds));
    };

    const handleConnect = (connection: Connection) => {
        if (connection.source && connection.target) {
            addEdge(connection.source, connection.target);
        }
    };

    const handleNodeDragStop = (_: React.MouseEvent, node: Node) => {
        updateMemberPosition(node.id, node.position);
    };

    const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapperRef.current?.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');

        if (!type || !reactFlowBounds) {
            return;
        }

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        addMember({ name: `New ${type}`, role: type, position });
    };

    return (
        <div className="min-h-screen h-screen w-screen bg-gray-50 flex flex-col">
            <header className="p-6 pb-2 flex-shrink-0">
                <h1 className="text-3xl font-bold">Team Flow</h1>
            </header>
            <div className="w-full flex justify-center">
                <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-2">Drag these buttons to add new team members:</p>
                    <div className="mt-2 mb-4 px-6 py-3 bg-white rounded-xl shadow flex items-center gap-4">
                        <Button
                            draggable
                            onDragStart={(event) => handleDragStart(event, 'Developer')}
                            className="flex items-center gap-1"
                        >
                            <Code className="w-4 h-4" /> Add Developer
                        </Button>
                        <Button
                            draggable
                            onDragStart={(event) => handleDragStart(event, 'Manager')}
                            className="flex items-center gap-1"
                        >
                            <Briefcase className="w-4 h-4" /> Add Manager
                        </Button>
                        <Button
                            draggable
                            onDragStart={(event) => handleDragStart(event, 'Team Member')}
                            className="flex items-center gap-1"
                        >
                            <Users className="w-4 h-4" /> Add Team Member
                        </Button>
                    </div>
                </div>
            </div>
            <main className="flex-1 flex flex-col">
                <div
                    className="flex-1 relative"
                    ref={reactFlowWrapperRef}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <ReactFlow
                        nodes={reactFlowNodes}
                        edges={flowEdges}
                        fitView
                        onNodesChange={handleNodesChange}
                        onConnect={handleConnect}
                        onNodeDragStop={handleNodeDragStop}
                        onEdgeClick={(_event, edge) => deleteEdge(edge.id)}
                        className="absolute inset-0"
                        nodeTypes={nodeTypes}
                    >
                        <Background />
                        <MiniMap />
                        <Controls />
                    </ReactFlow>
                </div>
            </main>
            <EditModal
                editId={editId}
                editName={editName}
                editRole={editRole}
                setEditId={setEditId}
                setEditName={setEditName}
                setEditRole={setEditRole}
                handleSave={handleSave}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default TeamFlow;
