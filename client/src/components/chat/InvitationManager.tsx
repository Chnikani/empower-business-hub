import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiClient';

interface GroupInvitation {
  id: string;
  group_id: string;
  code: string;
  expires_at: string;
  created_at: string;
  is_active: boolean;
}

interface InvitationManagerProps {
  groupId: string;
  isAdmin: boolean;
}

export function InvitationManager({ groupId, isAdmin }: InvitationManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    if (!user || !isAdmin) return;

    try {
      setLoading(true);
      // Simplified invitation fetching
      setInvitations([]);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch invitations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [groupId, isAdmin]);

  const generateInvitation = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const invitation = await apiClient.createGroupInvitation({
        groupId,
        code: `invite_${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        createdBy: user.id,
        isActive: true
      });

      setInvitations(prev => [...prev, invitation]);
      toast({
        title: 'Success',
        description: 'Invitation created successfully',
      });
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invitation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (code: string) => {
    const inviteUrl = `${window.location.origin}/invite/${code}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: 'Copied!',
      description: 'Invitation link copied to clipboard',
    });
  };

  const revokeInvitation = async (invitationId: string) => {
    try {
      await apiClient.updateGroupInvitation(invitationId, { isActive: false });
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId ? { ...inv, is_active: false } : inv
        )
      );
      toast({
        title: 'Success',
        description: 'Invitation revoked',
      });
    } catch (error) {
      console.error('Error revoking invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke invitation',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Manage Invites
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Group Invitations</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Button onClick={generateInvitation} disabled={loading} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Generate New Invitation
          </Button>

          <div className="space-y-2">
            {invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No invitations found
              </p>
            ) : (
              invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {invitation.code}
                      </code>
                      <Badge variant={invitation.is_active ? "default" : "secondary"}>
                        {invitation.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyInviteLink(invitation.code)}
                      disabled={!invitation.is_active}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeInvitation(invitation.id)}
                      disabled={!invitation.is_active}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}