import React, { useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useTeamStore } from '../../stores/team.store';
import { PlusIcon, Trash } from 'lucide-react';
import nodeTypes from './nodeTypes';

function TeamFlow() {
    const { members, edges, addMember, updateMember, addEdge, updateMemberPosition, deleteMember } = useTeamStore();
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');

    // React Flow state
    const nodes: Node[] = members.map((m) => ({
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
    const flowEdges: Edge[] = edges.map((e) => ({ id: e.id, source: e.source, target: e.target }));


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

    // Handle node drag (position change)
    const handleNodesChange = (changes: any[]) => {
        changes.forEach(change => {
            if (change.type === 'position' && change.position && change.id) {
                updateMemberPosition(change.id, change.position);
            }
        });
    };

    const handleConnect = (connection: Connection) => {
        if (connection.source && connection.target) {
            addEdge(connection.source, connection.target);
        }
    };

    return (
        <div className="min-h-screen h-screen w-screen bg-gray-50 flex flex-col">
            <header className="p-6 pb-2 flex-shrink-0">
                <h1 className="text-3xl font-bold">Team Flow</h1>
            </header>
            <div className="w-full flex justify-center">
                <div className="mt-2 mb-4 px-6 py-3 bg-white rounded-xl shadow flex items-center gap-4">
                    <Button onClick={() => addMember({ name: 'New Member', role: 'Role', position: { x: 250, y: 250 } })}>
                        Add Team Member <PlusIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <main className="flex-1 flex flex-col">
                <div className="flex-1 relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={flowEdges}
                        fitView
                        onNodesChange={handleNodesChange}
                        onConnect={handleConnect}
                        className="absolute inset-0"
                        nodeTypes={nodeTypes}
                    >
                        <Background />
                        <MiniMap />
                        <Controls />
                    </ReactFlow>
                </div>
            </main>
            <Dialog open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={editName} onChange={e => setEditName(e.target.value)} />
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={editRole} onChange={e => setEditRole(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save</Button>
                        <Button variant="destructive" onClick={handleDelete} className="ml-2" type="button">
                            <Trash className="w-4 h-4 mr-1" /> Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default TeamFlow;
