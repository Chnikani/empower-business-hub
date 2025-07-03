import { db } from "./db";
import { 
  users, 
  profiles,
  businessAccounts,
  chatGroups,
  groupMembers,
  groupInvitations,
  chatMessages,
  typingIndicators,
  generatedImages,
  type User, 
  type InsertUser,
  type Profile,
  type InsertProfile,
  type BusinessAccount,
  type InsertBusinessAccount,
  type ChatGroup,
  type InsertChatGroup,
  type GroupMember,
  type InsertGroupMember,
  type GroupInvitation,
  type InsertGroupInvitation,
  type ChatMessage,
  type InsertChatMessage,
  type TypingIndicator,
  type InsertTypingIndicator,
  type GeneratedImage,
  type InsertGeneratedImage
} from "../shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Legacy user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Business account methods
  getBusinessAccount(id: string): Promise<BusinessAccount | undefined>;
  getBusinessAccountsByOwner(ownerId: string): Promise<BusinessAccount[]>;
  createBusinessAccount(account: InsertBusinessAccount): Promise<BusinessAccount>;
  updateBusinessAccount(id: string, account: Partial<InsertBusinessAccount>): Promise<BusinessAccount | undefined>;
  
  // Chat group methods
  getChatGroup(id: string): Promise<ChatGroup | undefined>;
  getChatGroupsByBusiness(businessId: string): Promise<ChatGroup[]>;
  createChatGroup(group: InsertChatGroup): Promise<ChatGroup>;
  updateChatGroup(id: string, group: Partial<InsertChatGroup>): Promise<ChatGroup | undefined>;
  
  // Group member methods
  getGroupMembers(groupId: string): Promise<GroupMember[]>;
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  removeGroupMember(groupId: string, userId: string): Promise<void>;
  updateGroupMember(groupId: string, userId: string, updates: Partial<InsertGroupMember>): Promise<GroupMember | undefined>;
  
  // Group invitation methods
  getGroupInvitation(code: string): Promise<GroupInvitation | undefined>;
  getGroupInvitationsByGroup(groupId: string): Promise<GroupInvitation[]>;
  createGroupInvitation(invitation: InsertGroupInvitation): Promise<GroupInvitation>;
  updateGroupInvitation(id: string, invitation: Partial<InsertGroupInvitation>): Promise<GroupInvitation | undefined>;
  
  // Chat message methods
  getChatMessages(groupId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatMessage(id: string, message: Partial<InsertChatMessage>): Promise<ChatMessage | undefined>;
  
  // Typing indicator methods
  getTypingIndicators(groupId: string): Promise<TypingIndicator[]>;
  upsertTypingIndicator(indicator: InsertTypingIndicator): Promise<TypingIndicator>;
  clearTypingIndicator(groupId: string, userId: string): Promise<void>;
  
  // Generated image methods
  getGeneratedImages(businessId: string): Promise<GeneratedImage[]>;
  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
}

export class DatabaseStorage implements IStorage {
  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set(profile).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // Business account methods
  async getBusinessAccount(id: string): Promise<BusinessAccount | undefined> {
    const result = await db.select().from(businessAccounts).where(eq(businessAccounts.id, id)).limit(1);
    return result[0];
  }

  async getBusinessAccountsByOwner(ownerId: string): Promise<BusinessAccount[]> {
    return await db.select().from(businessAccounts).where(eq(businessAccounts.ownerId, ownerId));
  }

  async createBusinessAccount(account: InsertBusinessAccount): Promise<BusinessAccount> {
    const result = await db.insert(businessAccounts).values(account).returning();
    return result[0];
  }

  async updateBusinessAccount(id: string, account: Partial<InsertBusinessAccount>): Promise<BusinessAccount | undefined> {
    const result = await db.update(businessAccounts).set(account).where(eq(businessAccounts.id, id)).returning();
    return result[0];
  }

  // Chat group methods
  async getChatGroup(id: string): Promise<ChatGroup | undefined> {
    const result = await db.select().from(chatGroups).where(eq(chatGroups.id, id)).limit(1);
    return result[0];
  }

  async getChatGroupsByBusiness(businessId: string): Promise<ChatGroup[]> {
    return await db.select().from(chatGroups).where(eq(chatGroups.businessId, businessId));
  }

  async createChatGroup(group: InsertChatGroup): Promise<ChatGroup> {
    const result = await db.insert(chatGroups).values(group).returning();
    return result[0];
  }

  async updateChatGroup(id: string, group: Partial<InsertChatGroup>): Promise<ChatGroup | undefined> {
    const result = await db.update(chatGroups).set(group).where(eq(chatGroups.id, id)).returning();
    return result[0];
  }

  // Group member methods
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return await db.select().from(groupMembers).where(eq(groupMembers.groupId, groupId));
  }

  async addGroupMember(member: InsertGroupMember): Promise<GroupMember> {
    const result = await db.insert(groupMembers).values(member).returning();
    return result[0];
  }

  async removeGroupMember(groupId: string, userId: string): Promise<void> {
    await db.delete(groupMembers).where(
      and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
    );
  }

  async updateGroupMember(groupId: string, userId: string, updates: Partial<InsertGroupMember>): Promise<GroupMember | undefined> {
    const result = await db.update(groupMembers)
      .set(updates)
      .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)))
      .returning();
    return result[0];
  }

  // Group invitation methods
  async getGroupInvitation(code: string): Promise<GroupInvitation | undefined> {
    const result = await db.select().from(groupInvitations).where(eq(groupInvitations.invitationCode, code)).limit(1);
    return result[0];
  }

  async getGroupInvitationsByGroup(groupId: string): Promise<GroupInvitation[]> {
    return await db.select().from(groupInvitations).where(eq(groupInvitations.groupId, groupId));
  }

  async createGroupInvitation(invitation: InsertGroupInvitation): Promise<GroupInvitation> {
    const result = await db.insert(groupInvitations).values(invitation).returning();
    return result[0];
  }

  async updateGroupInvitation(id: string, invitation: Partial<InsertGroupInvitation>): Promise<GroupInvitation | undefined> {
    const result = await db.update(groupInvitations).set(invitation).where(eq(groupInvitations.id, id)).returning();
    return result[0];
  }

  // Chat message methods
  async getChatMessages(groupId: string, limit: number = 50): Promise<ChatMessage[]> {
    const messages = await db
      .select({
        id: chatMessages.id,
        content: chatMessages.content,
        messageType: chatMessages.messageType,
        fileUrl: chatMessages.fileUrl,
        fileName: chatMessages.fileName,
        createdAt: chatMessages.createdAt,
        userId: chatMessages.userId,
        profile: {
          fullName: profiles.fullName,
          avatarUrl: profiles.avatarUrl,
        },
      })
      .from(chatMessages)
      .leftJoin(profiles, eq(chatMessages.userId, profiles.id))
      .where(eq(chatMessages.groupId, groupId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);

    return messages.map((m) => ({
      ...m,
      // Drizzle returns profile as a separate object, so we merge it
      profiles: m.profile,
    })) as unknown as ChatMessage[];
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }

  async updateChatMessage(id: string, message: Partial<InsertChatMessage>): Promise<ChatMessage | undefined> {
    const result = await db.update(chatMessages).set(message).where(eq(chatMessages.id, id)).returning();
    return result[0];
  }

  // Typing indicator methods
  async getTypingIndicators(groupId: string): Promise<TypingIndicator[]> {
    return await db.select()
      .from(typingIndicators)
      .where(eq(typingIndicators.groupId, groupId))
      .orderBy(desc(typingIndicators.lastTyping));
  }

  async upsertTypingIndicator(indicator: InsertTypingIndicator): Promise<TypingIndicator> {
    if (!indicator.groupId || !indicator.userId) {
      throw new Error("groupId and userId are required for typing indicators");
    }
    const existing = await db.select()
      .from(typingIndicators)
      .where(
        and(
          eq(typingIndicators.groupId, indicator.groupId),
          eq(typingIndicators.userId, indicator.userId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const result = await db.update(typingIndicators)
        .set({ lastTyping: new Date() })
        .where(eq(typingIndicators.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(typingIndicators).values(indicator).returning();
      return result[0];
    }
  }

  async clearTypingIndicator(groupId: string, userId: string): Promise<void> {
    await db.delete(typingIndicators).where(
      and(eq(typingIndicators.groupId, groupId), eq(typingIndicators.userId, userId))
    );
  }

  // Generated image methods
  async getGeneratedImages(businessId: string): Promise<GeneratedImage[]> {
    return await db.select()
      .from(generatedImages)
      .where(eq(generatedImages.businessId, businessId))
      .orderBy(desc(generatedImages.createdAt));
  }

  async createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage> {
    const result = await db.insert(generatedImages).values(image).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();