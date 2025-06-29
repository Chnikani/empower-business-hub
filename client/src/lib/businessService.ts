// Simple business service to replace Supabase functionality
import { apiClient } from './apiClient';

export interface BusinessAccount {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

class BusinessService {
  async getBusinessAccountsByOwner(ownerId: string): Promise<BusinessAccount[]> {
    try {
      const data = await apiClient.getBusinessAccountsByOwner(ownerId);
      return (data || []) as BusinessAccount[];
    } catch (error) {
      console.error('Error fetching business accounts:', error);
      return [];
    }
  }

  async createBusinessAccount(name: string, ownerId: string): Promise<BusinessAccount> {
    const data = await apiClient.createBusinessAccount({ name, ownerId });
    return data as BusinessAccount;
  }
}

export const businessService = new BusinessService();