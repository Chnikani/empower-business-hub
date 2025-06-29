
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, MessageSquare, Settings, Copy, ExternalLink } from 'lucide-react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { InvitationManager } from '@/components/chat/InvitationManager';

interface ChatGroup {
  id: string;
  name: string;
  description: string;
  created_at: string;
  member_count: number;
  is_admin: boolean;
}

interface UserProfile {
  id: string;
  role: 'business_owner' | 'business_manager';
}

const TeamChat = () => {
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();
  const { toast } = useToast();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchChatGroups();
    }
  }, [user, currentBusiness]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchChatGroups = async () => {
    if (!user || !currentBusiness) return;

    try {
      const { data, error } = await supabase
        .from('chat_groups')
        .select(`
          id,
          name,
          description,
          created_at,
          group_members!inner(is_admin),
          group_members(count)
        `)
        .eq('business_id', currentBusiness.id)
        .eq('group_members.user_id', user.id);

      if (error) throw error;

      const formattedGroups = data?.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        created_at: group.created_at,
        member_count: group.group_members.length,
        is_admin: group.group_members[0]?.is_admin || false
      })) || [];

      setGroups(formattedGroups);
    } catch (error) {
      console.error('Error fetching chat groups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chat groups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createChatGroup = async () => {
    if (!user || !currentBusiness || !userProfile) return;
    
    if (userProfile.role !== 'business_owner') {
      toast({
        title: "Permission Denied",
        description: "Only business owners can create chat groups",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('chat_groups')
        .insert({
          name: newGroupName,
          description: newGroupDescription,
          business_id: currentBusiness.id,
          created_by: user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          is_admin: true
        });

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: "Chat group created successfully"
      });

      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateGroup(false);
      fetchChatGroups();
    } catch (error) {
      console.error('Error creating chat group:', error);
      toast({
        title: "Error",
        description: "Failed to create chat group",
        variant: "destructive"
      });
    }
  };

  if (selectedGroup) {
    return (
      <ChatRoom 
        groupId={selectedGroup} 
        onBack={() => setSelectedGroup(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading chat groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Chat</h1>
          <p className="text-muted-foreground">
            Collaborate with your team in real-time
          </p>
        </div>
        
        {userProfile?.role === 'business_owner' && (
          <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chat Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Group Name</label>
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={createChatGroup}
                    disabled={!newGroupName.trim()}
                    className="flex-1"
                  >
                    Create Group
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateGroup(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {groups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Chat Groups Yet</h3>
            <p className="text-muted-foreground mb-6">
              {userProfile?.role === 'business_owner' 
                ? "Create your first chat group to start collaborating with your team"
                : "You haven't been invited to any chat groups yet"
              }
            </p>
            {userProfile?.role === 'business_owner' && (
              <Button onClick={() => setShowCreateGroup(true)} className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="modern-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                  {group.is_admin && (
                    <Badge variant="secondary" className="ml-2">
                      Admin
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {group.member_count} members
                  </div>
                  <div className="flex gap-2">
                    {group.is_admin && (
                      <InvitationManager groupId={group.id} />
                    )}
                    <Button 
                      size="sm"
                      onClick={() => setSelectedGroup(group.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Join Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamChat;
