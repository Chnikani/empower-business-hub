
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
// Supabase removed - using API client instead
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { chatService, ChatGroup, ChatMessage } from '@/services/simpleChatService';
import { apiClient } from '@/lib/apiClient';
import { MessageList } from '@/components/chat/MessageList';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { InvitationManager } from '@/components/chat/InvitationManager';

interface UserProfile {
  id: string;
  role: 'business_owner' | 'business_manager';
}

const TeamChat = () => {
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();
  const { toast } = useToast();
  
  // State for groups
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for chat
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  // State for creating groups
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  useEffect(() => {
    if (user && currentBusiness) {
      fetchUserProfile();
      fetchChatGroups();
    }
  }, [user, currentBusiness]);

  useEffect(() => {
    if (selectedGroup) {
      loadMessages();
      
      // Subscribe to real-time messages
      const unsubscribe = chatService.subscribeToMessages(selectedGroup, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      return unsubscribe;
    }
  }, [selectedGroup]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const data = await apiClient.getProfile(user.id);
      setUserProfile({
        id: (data as any).id,
        role: (data as any).role || 'business_owner'
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchChatGroups = async () => {
    if (!user || !currentBusiness) return;

    try {
      const groups = await chatService.getChatGroups(currentBusiness.id, user.id);
      setGroups(groups);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chat groups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedGroup) return;

    setMessagesLoading(true);
    try {
      const messages = await chatService.getMessages(selectedGroup);
      setMessages(messages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setMessagesLoading(false);
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
      await chatService.createChatGroup(
        newGroupName,
        newGroupDescription,
        currentBusiness.id,
        user.id
      );

      toast({
        title: "Success",
        description: "Chat group created successfully"
      });

      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateGroup(false);
      fetchChatGroups();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chat group",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedGroup) return;

    try {
      await chatService.sendMessage(selectedGroup, newMessage, user.id);
      setNewMessage('');
      
      // Clear typing indicator
      await chatService.clearTypingIndicator(selectedGroup, user.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleTyping = async () => {
    if (!user || !selectedGroup) return;
    await chatService.updateTypingIndicator(selectedGroup, user.id);
  };

  const selectedGroupInfo = groups.find(g => g.id === selectedGroup);

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

  // Chat view when a group is selected
  if (selectedGroup && selectedGroupInfo) {
    return (
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {/* Chat Header */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSelectedGroup(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <CardTitle className="text-lg">{selectedGroupInfo.name}</CardTitle>
                {selectedGroupInfo.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedGroupInfo.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {selectedGroupInfo.member_count}
                </Badge>
                {selectedGroupInfo.is_admin && (
                  <InvitationManager groupId={selectedGroup} />
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
                </div>
              ) : (
                <>
                  <MessageList messages={messages} currentUserId={user?.id} />
                  <TypingIndicator groupId={selectedGroup} currentUserId={user?.id} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Groups list view
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
