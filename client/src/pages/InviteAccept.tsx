import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';

interface GroupInvitation {
  id: string;
  group_id: string;
  code: string;
  expires_at: string;
  is_active: boolean;
  group?: {
    name: string;
    description?: string;
  };
}

const InviteAccept = () => {
  const { code } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<GroupInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Invalid invitation code');
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [code]);

  const fetchInvitation = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getGroupInvitation(code!);
      setInvitation(data);
      
      // Check if invitation is expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired');
      } else if (!data.is_active) {
        setError('This invitation is no longer active');
      }
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setError('Invalid or expired invitation');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!user || !invitation) return;

    try {
      setAccepting(true);
      
      // Add user to group
      await apiClient.addGroupMember({
        groupId: invitation.group_id,
        userId: user.id,
        role: 'member',
        joinedAt: new Date().toISOString()
      });

      toast({
        title: 'Success!',
        description: 'You have joined the group successfully',
      });

      // Redirect to team chat
      setLocation('/team-chat');
      
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to join the group. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/')} 
              className="w-full"
              variant="outline"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <CardTitle>Group Invitation</CardTitle>
            <CardDescription>
              You need to sign in to accept this group invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/login')} 
              className="w-full"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Group Invitation</CardTitle>
          <CardDescription>
            You have been invited to join a team chat group
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Group Name</label>
              <p className="text-lg font-semibold">{invitation.group?.name || 'Team Chat Group'}</p>
            </div>
            
            {invitation.group?.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{invitation.group.description}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Expires</label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(invitation.expires_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={acceptInvitation} 
              disabled={accepting}
              className="w-full"
            >
              {accepting ? 'Joining...' : 'Accept Invitation'}
            </Button>
            
            <Button 
              onClick={() => setLocation('/')} 
              variant="outline"
              className="w-full"
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteAccept;