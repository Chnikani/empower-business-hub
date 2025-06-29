// API client to replace Supabase functionality
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      // Return empty array for list endpoints to prevent crashes
      if (endpoint.includes('/chat-groups') || endpoint.includes('/chat-messages') || endpoint.includes('/generated-images')) {
        return [] as unknown as T;
      }
      throw error;
    }
  }

  // Profile methods
  async getProfile(id: string) {
    return this.request(`/profiles/${id}`);
  }

  async createProfile(profile: any) {
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async updateProfile(id: string, updates: any) {
    return this.request(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Business account methods
  async getBusinessAccountsByOwner(ownerId: string) {
    return this.request(`/business-accounts/owner/${ownerId}`);
  }

  async createBusinessAccount(account: any) {
    return this.request('/business-accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  }

  // Chat group methods
  async getChatGroupsByBusiness(businessId: string): Promise<any[]> {
    return this.request(`/chat-groups/business/${businessId}`) || [];
  }

  async createChatGroup(group: any): Promise<any> {
    return this.request('/chat-groups', {
      method: 'POST',
      body: JSON.stringify(group),
    });
  }

  // Group member methods
  async getGroupMembers(groupId: string): Promise<any[]> {
    return this.request(`/group-members/${groupId}`) || [];
  }

  async addGroupMember(member: any): Promise<any> {
    return this.request('/group-members', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async removeGroupMember(groupId: string, userId: string): Promise<any> {
    return this.request(`/group-members/${groupId}/${userId}`, {
      method: 'DELETE',
    });
  }

  // Group invitation methods
  async getGroupInvitation(code: string): Promise<any> {
    return this.request(`/group-invitations/code/${code}`);
  }

  async createGroupInvitation(invitation: any): Promise<any> {
    return this.request('/group-invitations', {
      method: 'POST',
      body: JSON.stringify(invitation),
    });
  }

  async updateGroupInvitation(id: string, updates: any): Promise<any> {
    return this.request(`/group-invitations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Chat message methods
  async getChatMessages(groupId: string, limit?: number): Promise<any[]> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/chat-messages/${groupId}${query}`) || [];
  }

  async createChatMessage(message: any): Promise<any> {
    return this.request('/chat-messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Typing indicator methods
  async updateTypingIndicator(indicator: any) {
    return this.request('/typing-indicators', {
      method: 'POST',
      body: JSON.stringify(indicator),
    });
  }

  async clearTypingIndicator(groupId: string, userId: string) {
    return this.request(`/typing-indicators/${groupId}/${userId}`, {
      method: 'DELETE',
    });
  }

  // Generated image methods
  async getGeneratedImages(businessId: string): Promise<any[]> {
    return this.request(`/generated-images/${businessId}`);
  }

  async generateImage(prompt: string, style: string, businessId: string): Promise<any> {
    return this.request('/generate-image', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        style,
        business_id: businessId,
      }),
    });
  }
}

export const apiClient = new ApiClient();