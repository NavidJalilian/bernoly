import type { TeamEdge, TeamMember } from '@/pages/teamFlow/TeamFlowTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';



type TeamState = {
  members: TeamMember[];
  edges: TeamEdge[];
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, data: Partial<Omit<TeamMember, 'id'>>) => void;
  addEdge: (source: string, target: string) => void;
  updateMemberPosition: (id: string, position: { x: number; y: number }) => void;
  deleteMember: (id: string) => void;
  deleteEdge: (edgeId: string) => void;
};

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      members: [
        { id: '1', name: 'Alice', role: 'Manager', position: { x: 200, y: 100 } },
        { id: '2', name: 'Bob', role: 'Developer', position: { x: 400, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
      ],
      addMember: (member) =>
        set((state) => {
          const id = crypto.randomUUID();
          return { members: [...state.members, { ...member, id }] };
        }),
      updateMember: (id, data) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),
      addEdge: (source, target) =>
        set((state) => {
          const id = crypto.randomUUID();
          return { edges: [...state.edges, { id, source, target }] };
        }),
      updateMemberPosition: (id, position) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, position } : m)),
        })),
      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        })),
      deleteEdge: (edgeId) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== edgeId),
        })),
    }),
    {
      name: 'team-flow-store', // localStorage key
    }
  )
);
