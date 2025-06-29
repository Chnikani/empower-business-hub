import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Settings, Copy, Plus, Calendar, Users, Trash2 } from 'lucide-react';

interface Invitation {
  id: string;
  invitation_code: string;
  expires_at: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

interface InvitationManagerProps {
  groupId: string;
}

export const InvitationManager = ({ groupId }: InvitationManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [maxUses, setMaxUses] = useState<string>('');
  const [expirationDays, setExpirationDays] = useState<string>('7');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showDialog) {
      fetchInvitations();
    }
  }, [showDialog, groupId]);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('group_invitations')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const createInvitation = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const expiresAt = expirationDays 
        ? new Date(Date.now() + parseInt(expirationDays) * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase.rpc('generate_invitation_code');
      if (error) throw error;

      const invitationCode = data;

      const { error: insertError } = await supabase
        .from('group_invitations')
        .insert({
          group_id: groupId,
          created_by: user.id,
          invitation_code: invitationCode,
          expires_at: expiresAt,
          max_uses: maxUses ? parseInt(maxUses) : null,
          current_uses: 0,
          is_active: true
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Invitation link created successfully"
      });

      setMaxUses('');
      setExpirationDays('7');
      fetchInvitations();
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInvitationLink = (code: string) => {
    const link = `${window.location.origin}/invite/${code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Invitation link copied to clipboard"
    });
  };

  const deactivateInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('group_invitations')
        .update({ is_active: false })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation deactivated"
      });

      fetchInvitations();
    } catch (error) {
      console.error('Error deactivating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate invitation",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Invitations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Invitation */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Create New Invitation</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Max Uses (optional)</label>
                  <Input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expires in (days)</label>
                  <Input
                    type="number"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(e.target.value)}
                    placeholder="7"
                    min="1"
                  />
                </div>
              </div>
              <Button onClick={createInvitation} disabled={loading} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Invitation Link'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Invitations */}
          <div>
            <h3 className="font-medium mb-4">Active Invitations</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {invitations.filter(inv => inv.is_active).map((invitation) => (
                <Card key={invitation.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {invitation.current_uses}/{invitation.max_uses || '∞'} uses
                          </Badge>
                          {invitation.expires_at && (
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expires {new Date(invitation.expires_at).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                            {window.location.origin}/invite/{invitation.invitation_code}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyInvitationLink(invitation.invitation_code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deactivateInvitation(invitation.id)}
                        className="ml-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {invitations.filter(inv => inv.is_active).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No active invitations. Create one to invite team members.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
