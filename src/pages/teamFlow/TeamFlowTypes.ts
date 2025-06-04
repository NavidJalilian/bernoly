import TeamMemberNode from './TeamMemberNode';

export interface TeamMemberNodeData {
    name: string;
    role: string;
    onEdit: () => void;
}

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

const nodeTypes = { teamMember: TeamMemberNode };

export default nodeTypes;
