import React, { useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { useTeamStore } from './stores/team.store';

function App() {
  const { members, edges, addMember, updateMember, addEdge, updateMemberPosition } = useTeamStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  // React Flow state
  const nodes: Node[] = members.map((m) => ({
    id: m.id,
    data: {
      label: (
        <div
          className="p-4 rounded bg-white shadow border cursor-pointer"
          onClick={() => {
            setEditId(m.id);
            setEditName(m.name);
            setEditRole(m.role);
          }}
        >
          <div className="font-semibold">{m.name}</div>
          <div className="text-xs text-gray-500">{m.role}</div>
        </div>
      )
    },
    position: m.position,
    type: 'default',
  }));
  const flowEdges: Edge[] = edges.map((e) => ({ id: e.id, source: e.source, target: e.target }));

  // Dialog handlers
  const handleSave = () => {
    if (editId) {
      updateMember(editId, { name: editName, role: editRole });
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
      <main className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={flowEdges}
            fitView
            onNodesChange={handleNodesChange}
            onConnect={handleConnect}
            className="absolute inset-0"
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
        <div className="p-4 flex gap-4 items-center bg-white/80 shadow-md">
          <Button onClick={() => addMember({ name: 'New Member', role: 'Role', position: { x: 250, y: 250 } })}>
            Add Team Member
          </Button>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
