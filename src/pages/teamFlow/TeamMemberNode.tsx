import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Pencil } from 'lucide-react';
import { Code, Briefcase, Users } from 'lucide-react';

const handleStyle = {
    width: 12,
    height: 12,
    background: '#6366f1', // indigo-500
    border: '2px solid white',
    borderRadius: '50%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
};

const TeamMemberNode = memo(({ data, id }: any) => (
    <div
        tabIndex={0}
        role="button"
        aria-label={`Edit ${data.name}`}
        onClick={data.onEdit}
        onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') data.onEdit();
        }}
        className="group relative w-48 min-w-40 max-w-xs p-4 rounded-xl border bg-card shadow-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring transition hover:shadow-lg hover:border-primary"
        style={{ background: 'white', border: '1px solid #e5e7eb' }}
    >
        {/* Target handle (incoming connections) */}
        <Handle type="target" position={Position.Left} id="target" style={handleStyle} />
        <span className="absolute top-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10">
            <Pencil className="w-4 h-4" />
        </span>
        <div className="flex items-center gap-2">
            {data.role === 'Developer' && <Code className="w-4 h-4 text-muted-foreground" />}
            {data.role === 'Manager' && <Briefcase className="w-4 h-4 text-muted-foreground" />}
            {data.role === 'Team Member' && <Users className="w-4 h-4 text-muted-foreground" />}
            <div className="flex flex-col gap-1">
                <span className="text-base font-semibold text-foreground truncate" title={data.name}>{data.name}</span>
                <span className="text-xs text-muted-foreground truncate" title={data.role}>{data.role}</span>
            </div>
        </div>
        {/* Source handle (outgoing connections) */}
        <Handle type="source" position={Position.Right} id="source" style={handleStyle} />
    </div>
));

export default TeamMemberNode;
