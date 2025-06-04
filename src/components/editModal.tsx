import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Trash } from 'lucide-react';

interface EditModalProps {
    editId: string | null;
    editName: string;
    editRole: string;
    setEditId: (id: string | null) => void;
    setEditName: (name: string) => void;
    setEditRole: (role: string) => void;
    handleSave: () => void;
    handleDelete: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
    editId,
    editName,
    editRole,
    setEditId,
    setEditName,
    setEditRole,
    handleSave,
    handleDelete,
}) => {
    return (
        <Dialog open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }} className="space-y-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={editName} onChange={e => setEditName(e.target.value)} />
                    <Label htmlFor="role">Role</Label>
                    <Select value={editRole} onValueChange={setEditRole}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Developer">Developer</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Team Member">Team Member</SelectItem>
                        </SelectContent>
                    </Select>
                </form>
                <DialogFooter>
                    <Button type="submit" form="editTeamMemberForm">Save</Button>
                    <Button variant="destructive" onClick={handleDelete} className="ml-2" type="button">
                        <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditModal; 