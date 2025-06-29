
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingUser {
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  } | null;
}

interface TypingIndicatorProps {
  groupId: string;
  currentUserId?: string;
}

export const TypingIndicator = ({ groupId, currentUserId }: TypingIndicatorProps) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    const fetchTypingUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('typing_indicators')
          .select(`
            user_id,
            profiles!typing_indicators_user_id_fkey(full_name, avatar_url)
          `)
          .eq('group_id', groupId)
          .neq('user_id', currentUserId || '')
          .gte('last_typing', new Date(Date.now() - 5000).toISOString()); // Last 5 seconds

        if (error) throw error;
        setTypingUsers(data || []);
      } catch (error) {
        console.error('Error fetching typing users:', error);
      }
    };

    fetchTypingUsers();

    const channel = supabase
      .channel(`typing-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `group_id=eq.${groupId}`
        },
        () => {
          fetchTypingUsers();
        }
      )
      .subscribe();

    const interval = setInterval(fetchTypingUsers, 2000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [groupId, currentUserId]);

  if (typingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="flex -space-x-1">
        {typingUsers.slice(0, 3).map((user) => {
          const initials = user.profiles?.full_name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase() || '';
          
          return (
            <Avatar key={user.user_id} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={user.profiles?.avatar_url} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          );
        })}
      </div>
      
      <div className="flex items-center gap-1">
        {typingUsers.length === 1 && (
          <span className="text-sm">
            {typingUsers[0].profiles?.full_name} is typing
          </span>
        )}
        {typingUsers.length === 2 && (
          <span className="text-sm">
            {typingUsers[0].profiles?.full_name} and {typingUsers[1].profiles?.full_name} are typing
          </span>
        )}
        {typingUsers.length > 2 && (
          <span className="text-sm">
            {typingUsers.length} people are typing
          </span>
        )}
        
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
