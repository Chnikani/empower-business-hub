import { apiClient } from '@/lib/apiClient';

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
  async getChatGroups(businessId: string, userId: string): Promise<ChatGroup[]> {
    try {
      const data = await apiClient.getChatGroupsByBusiness(businessId);
      return (data || []).map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        created_at: group.createdAt,
        member_count: 1,
        is_admin: true
      }));
    } catch (error) {
      console.error('Error fetching chat groups:', error);
      return [];
    }
  },

  async getMessages(groupId: string): Promise<ChatMessage[]> {
    try {
      const data = await apiClient.getChatMessages(groupId, 50);
      return (data || []).map((message: any) => ({
        id: message.id,
        content: message.content,
        message_type: message.messageType || 'text',
        file_url: message.fileUrl,
        file_name: message.fileName,
        created_at: message.createdAt,
        user_id: message.userId,
        profiles: {
          full_name: 'User',
          avatar_url: undefined
        }
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async sendMessage(groupId: string, content: string, userId: string): Promise<void> {
    try {
      await apiClient.createChatMessage({
        groupId,
        content,
        userId,
        messageType: 'text'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async createChatGroup(name: string, description: string, businessId: string, userId: string): Promise<string> {
    try {
      const group = await apiClient.createChatGroup({
        name,
        description,
        businessId,
        createdBy: userId
      });
      return group.id;
    } catch (error) {
      console.error('Error creating chat group:', error);
      throw error;
    }
  },

  subscribeToMessages(groupId: string, callback: (message: ChatMessage) => void) {
    console.log('Message subscription started for group:', groupId);
    return () => {
      console.log('Message subscription ended for group:', groupId);
    };
  },

  async updateTypingIndicator(groupId: string, userId: string): Promise<void> {
    try {
      await apiClient.updateTypingIndicator({ groupId, userId });
    } catch (error) {
      console.error('Error updating typing indicator:', error);
    }
  },

  async clearTypingIndicator(groupId: string, userId: string): Promise<void> {
    try {
      await apiClient.clearTypingIndicator(groupId, userId);
    } catch (error) {
      console.error('Error clearing typing indicator:', error);
    }
  }
};