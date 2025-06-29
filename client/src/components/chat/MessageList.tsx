
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
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

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => {
        const isOwnMessage = message.user_id === currentUserId;
        const initials = message.profiles.full_name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={message.profiles.avatar_url} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            
            <div className={`flex-1 max-w-[80%] ${isOwnMessage ? 'text-right' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">
                  {isOwnMessage ? 'You' : message.profiles.full_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <div
                className={`rounded-lg px-3 py-2 ${
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                } max-w-fit ${isOwnMessage ? 'ml-auto' : ''}`}
              >
                {message.message_type === 'text' && (
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}
                
                {message.message_type === 'image' && message.file_url && (
                  <div>
                    <img
                      src={message.file_url}
                      alt={message.file_name || 'Shared image'}
                      className="max-w-xs rounded-md"
                    />
                    {message.content && (
                      <p className="text-sm mt-2 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                  </div>
                )}
                
                {message.message_type === 'file' && message.file_url && (
                  <div className="flex items-center gap-2">
                    <div className="bg-background/20 rounded p-1">
                      📎
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {message.file_name || 'Shared file'}
                      </p>
                      <a
                        href={message.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline opacity-80 hover:opacity-100"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
