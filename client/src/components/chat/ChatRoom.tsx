import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiClient';

interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ChatRoomProps {
  groupId: string;
  currentUserId: string;
  onBack: () => void;
  groupName: string;
  groupDescription: string;
  memberCount: number;
  isAdmin: boolean;
}

export function ChatRoom({
  groupId,
  currentUserId,
  onBack,
  groupName,
  groupDescription,
  memberCount,
  isAdmin,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getChatMessages(groupId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const message = await apiClient.createChatMessage({
        groupId,
        userId: currentUserId,
        content: newMessage.trim(),
        createdAt: new Date().toISOString()
      });

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <CardTitle className="text-lg">{groupName}</CardTitle>
            {groupDescription && (
              <p className="text-sm text-muted-foreground">
                {groupDescription}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {memberCount}
            </Badge>
            {isAdmin && (
              <InvitationManager groupId={groupId} />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.keys(messageGroups).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, dayMessages]) => (
              <div key={date}>
                <div className="flex justify-center mb-4">
                  <div className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                    {date}
                  </div>
                </div>
                
                {dayMessages.map((message) => {
                  const isOwnMessage = message.user_id === currentUserId;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwnMessage && (
                          <Avatar className="w-8 h-8 mt-1">
                            <AvatarImage src={message.profile?.avatar_url} alt={message.profile?.full_name} />
                            <AvatarFallback className="text-xs">
                              {message.profile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`rounded-lg px-3 py-2 ${
                          isOwnMessage 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {!isOwnMessage && (
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {message.profile?.full_name || 'Unknown User'}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 opacity-70 ${
                            isOwnMessage ? 'text-right' : 'text-left'
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 border-t p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}