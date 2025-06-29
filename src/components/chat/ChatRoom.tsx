
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Users, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { GroupMembersList } from './GroupMembersList';

interface ChatRoomProps {
  groupId: string;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

interface GroupInfo {
  id: string;
  name: string;
  description: string;
}

export const ChatRoom = ({ groupId, onBack }: ChatRoomProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [inVoiceChat, setInVoiceChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchGroupInfo();
    fetchMessages();
    setupRealtimeSubscription();
    
    return () => {
      // Clean up typing indicator on unmount
      if (user) {
        supabase
          .from('typing_indicators')
          .delete()
          .eq('group_id', groupId)
          .eq('user_id', user.id);
      }
    };
  }, [groupId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchGroupInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_groups')
        .select('id, name, description')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      setGroupInfo(data);
    } catch (error) {
      console.error('Error fetching group info:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          content,
          message_type,
          file_url,
          file_name,
          created_at,
          user_id,
          profiles!chat_messages_user_id_fkey(full_name, avatar_url)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`chat-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `group_id=eq.${groupId}`
        },
        async (payload) => {
          // Fetch the complete message with profile data
          const { data } = await supabase
            .from('chat_messages')
            .select(`
              id,
              content,
              message_type,
              file_url,
              file_name,
              created_at,
              user_id,
              profiles!chat_messages_user_id_fkey(full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `group_id=eq.${groupId}`
        },
        () => {
          // Typing indicators will be handled by the TypingIndicator component
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          group_id: groupId,
          user_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      
      // Clear typing indicator
      await supabase
        .from('typing_indicators')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleTyping = async () => {
    if (!user) return;

    setIsTyping(true);

    // Update typing indicator
    await supabase
      .from('typing_indicators')
      .upsert({
        group_id: groupId,
        user_id: user.id,
        last_typing: new Date().toISOString()
      });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false);
      await supabase
        .from('typing_indicators')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);
    }, 2000);
  };

  const toggleVoiceChat = () => {
    setInVoiceChat(!inVoiceChat);
    toast({
      title: inVoiceChat ? "Left Voice Chat" : "Joined Voice Chat",
      description: inVoiceChat ? "You left the voice channel" : "You joined the voice channel"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading chat room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-lg">{groupInfo?.name}</CardTitle>
                {groupInfo?.description && (
                  <p className="text-sm text-muted-foreground">
                    {groupInfo.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={inVoiceChat ? "default" : "outline"}
                size="sm"
                onClick={toggleVoiceChat}
              >
                {inVoiceChat ? (
                  <>
                    <PhoneOff className="h-4 w-4 mr-1" />
                    Leave Voice
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-1" />
                    Join Voice
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMembers(!showMembers)}
              >
                <Users className="h-4 w-4 mr-1" />
                Members
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Messages Area */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <MessageList messages={messages} currentUserId={user?.id} />
              <TypingIndicator groupId={groupId} currentUserId={user?.id} />
              <div ref={messagesEndRef} />
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

        {/* Members Sidebar */}
        {showMembers && (
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="text-lg">Group Members</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupMembersList groupId={groupId} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
