
import { supabase } from '@/lib/supabase';

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  created_at: string;
  member_count: number;
  is_admin: boolean;
}

export interface ChatMessage {
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

export const chatService = {
  /**
   * Fetches all chat groups for the current business that the user is a member of
   */
  async getChatGroups(businessId: string, userId: string): Promise<ChatGroup[]> {
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
        .eq('business_id', businessId)
        .eq('group_members.user_id', userId);

      if (error) throw error;

      return data?.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        created_at: group.created_at,
        member_count: group.group_members[0]?.count || 0,
        is_admin: group.group_members[0]?.is_admin || false
      })) || [];
    } catch (error) {
      console.error('Error fetching chat groups:', error);
      throw error;
    }
  },

  /**
   * Fetches all messages for a specific group
   */
  async getMessages(groupId: string): Promise<ChatMessage[]> {
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
        .limit(100);

      if (error) throw error;
      
      // Transform the data to match the ChatMessage interface
      return (data || []).map(message => ({
        id: message.id,
        content: message.content,
        message_type: message.message_type,
        file_url: message.file_url,
        file_name: message.file_name,
        created_at: message.created_at,
        user_id: message.user_id,
        profiles: {
          full_name: message.profiles[0]?.full_name || '',
          avatar_url: message.profiles[0]?.avatar_url
        }
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Sends a new message to a chat group
   */
  async sendMessage(groupId: string, content: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          group_id: groupId,
          user_id: userId,
          content: content.trim(),
          message_type: 'text'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Creates a new chat group
   */
  async createChatGroup(name: string, description: string, businessId: string, userId: string): Promise<string> {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('chat_groups')
        .insert({
          name,
          description,
          business_id: businessId,
          created_by: userId
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: userId,
          is_admin: true
        });

      if (memberError) throw memberError;

      return groupData.id;
    } catch (error) {
      console.error('Error creating chat group:', error);
      throw error;
    }
  },

  /**
   * Subscribes to real-time messages for a specific group
   */
  subscribeToMessages(groupId: string, callback: (message: ChatMessage) => void) {
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
            // Transform the data to match the ChatMessage interface
            const transformedMessage: ChatMessage = {
              id: data.id,
              content: data.content,
              message_type: data.message_type,
              file_url: data.file_url,
              file_name: data.file_name,
              created_at: data.created_at,
              user_id: data.user_id,
              profiles: {
                full_name: data.profiles[0]?.full_name || '',
                avatar_url: data.profiles[0]?.avatar_url
              }
            };
            callback(transformedMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Updates typing indicator for a user in a group
   */
  async updateTypingIndicator(groupId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('typing_indicators')
        .upsert({
          group_id: groupId,
          user_id: userId,
          last_typing: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating typing indicator:', error);
      throw error;
    }
  },

  /**
   * Clears typing indicator for a user in a group
   */
  async clearTypingIndicator(groupId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('typing_indicators')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error clearing typing indicator:', error);
      throw error;
    }
  }
};
