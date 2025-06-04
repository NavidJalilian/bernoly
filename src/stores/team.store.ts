import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  position: { x: number; y: number };
};

export type TeamEdge = {
  id: string;
  source: string;
  target: string;
};

type TeamState = {
  members: TeamMember[];
  edges: TeamEdge[];
  addMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMember: (id: string, data: Partial<Omit<TeamMember, 'id'>>) => void;
  addEdge: (source: string, target: string) => void;
  updateMemberPosition: (id: string, position: { x: number; y: number }) => void;
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
          const id = (Date.now() + Math.random()).toString();
          return { members: [...state.members, { ...member, id }] };
        }),
      updateMember: (id, data) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),
      addEdge: (source, target) =>
        set((state) => {
          const id = `e${source}-${target}-${Date.now()}-${Math.random()}`;
          return { edges: [...state.edges, { id, source, target }] };
        }),
      updateMemberPosition: (id, position) =>
        set((state) => ({
          members: state.members.map((m) => (m.id === id ? { ...m, position } : m)),
        })),
    }),
    {
      name: 'team-flow-store', // localStorage key
    }
  )
);
