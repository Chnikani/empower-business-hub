
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Crown, UserMinus } from 'lucide-react';

interface GroupMember {
  id: string;
  user_id: string;
  is_admin: boolean;
  joined_at: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
    role: 'business_owner' | 'business_manager';
  };
}

interface GroupMembersListProps {
  groupId: string;
}

export const GroupMembersList = ({ groupId }: GroupMembersListProps) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
    setupRealtimeSubscription();
  }, [groupId]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          is_admin,
          joined_at,
          profiles!group_members_user_id_fkey(full_name, avatar_url, role)
        `)
        .eq('group_id', groupId)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`members-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const initials = member.profiles.full_name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();

        return (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.profiles.avatar_url} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {member.profiles.full_name}
                  </span>
                  {member.is_admin && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {member.profiles.role === 'business_owner' ? 'Owner' : 'Manager'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {members.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-4">
          No members found
        </p>
      )}
    </div>
  );
};
