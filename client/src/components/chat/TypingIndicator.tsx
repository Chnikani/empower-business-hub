import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingUser {
  user_id: string;
  full_name: string;
  avatar_url?: string;
}

interface TypingIndicatorProps {
  groupId: string;
  currentUserId: string;
}

export function TypingIndicator({ groupId, currentUserId }: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    // Simplified typing indicator - in a real app this would use WebSocket
    console.log('Typing indicator setup for group:', groupId);
    
    return () => {
      console.log('Typing indicator cleanup for group:', groupId);
    };
  }, [groupId]);

  if (typingUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 text-sm text-muted-foreground">
      <div className="flex -space-x-1">
        {typingUsers.map((user) => (
          <Avatar key={user.user_id} className="w-6 h-6 border-2 border-background">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback className="text-xs">
              {user.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center space-x-1">
        <span>
          {typingUsers.length === 1
            ? `${typingUsers[0].full_name} is typing`
            : `${typingUsers.length} people are typing`}
        </span>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}