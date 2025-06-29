import { eq, and, desc } from "drizzle-orm";
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
  insertUserSchema,
  insertProfileSchema,
  insertBusinessAccountSchema,
  insertChatGroupSchema,
  insertGroupMemberSchema,
  insertGroupInvitationSchema,
  insertChatMessageSchema,
  insertTypingIndicatorSchema,
  insertGeneratedImageSchema,
} from "../shared/schema";
import { z } from "zod";

type InsertUser = z.infer<typeof insertUserSchema>;
type InsertProfile = z.infer<typeof insertProfileSchema>;
type InsertBusinessAccount = z.infer<typeof insertBusinessAccountSchema>;
type InsertChatGroup = z.infer<typeof insertChatGroupSchema>;
type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
type InsertGroupInvitation = z.infer<typeof insertGroupInvitationSchema>;
type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
type InsertTypingIndicator = z.infer<typeof insertTypingIndicatorSchema>;
type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;

export class DatabaseStorage {
  // Legacy user methods
  async getUser(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Profile methods
  async getProfile(id: string) {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string) {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile) {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>) {
    const result = await db.update(profiles).set(profile).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // Business account methods
  async getBusinessAccount(id: string) {
    const result = await db.select().from(businessAccounts).where(eq(businessAccounts.id, id)).limit(1);
    return result[0];
  }

  async getBusinessAccountsByOwner(ownerId: string) {
    return await db.select().from(businessAccounts).where(eq(businessAccounts.ownerId, ownerId));
  }

  async createBusinessAccount(account: InsertBusinessAccount) {
    const result = await db.insert(businessAccounts).values(account).returning();
    return result[0];
  }

  async updateBusinessAccount(id: string, account: Partial<InsertBusinessAccount>) {
    const result = await db.update(businessAccounts).set(account).where(eq(businessAccounts.id, id)).returning();
    return result[0];
  }

  // Chat group methods
  async getChatGroup(id: string) {
    const result = await db.select().from(chatGroups).where(eq(chatGroups.id, id)).limit(1);
    return result[0];
  }

  async getChatGroupsByBusiness(businessId: string) {
    return await db.select().from(chatGroups).where(eq(chatGroups.businessId, businessId));
  }

  async createChatGroup(group: InsertChatGroup) {
    const result = await db.insert(chatGroups).values(group).returning();
    return result[0];
  }

  async updateChatGroup(id: string, group: Partial<InsertChatGroup>) {
    const result = await db.update(chatGroups).set(group).where(eq(chatGroups.id, id)).returning();
    return result[0];
  }

  // Group member methods
  async getGroupMembers(groupId: string) {
    return await db.select().from(groupMembers).where(eq(groupMembers.groupId, groupId));
  }

  async addGroupMember(member: InsertGroupMember) {
    const result = await db.insert(groupMembers).values(member).returning();
    return result[0];
  }

  async removeGroupMember(groupId: string, userId: string) {
    await db.delete(groupMembers).where(
      and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
    );
  }

  async updateGroupMember(groupId: string, userId: string, updates: Partial<InsertGroupMember>) {
    const result = await db.update(groupMembers).set(updates).where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))).returning();
    return result[0];
  }

  // Group invitation methods
  async getGroupInvitation(code: string) {
    const result = await db.select().from(groupInvitations).where(eq(groupInvitations.invitationCode, code)).limit(1);
    return result[0];
  }

  async getGroupInvitationsByGroup(groupId: string) {
    return await db.select().from(groupInvitations).where(eq(groupInvitations.groupId, groupId));
  }

  async createGroupInvitation(invitation: InsertGroupInvitation) {
    const result = await db.insert(groupInvitations).values(invitation).returning();
    return result[0];
  }

  async updateGroupInvitation(id: string, invitation: Partial<InsertGroupInvitation>) {
    const result = await db.update(groupInvitations).set(invitation).where(eq(groupInvitations.id, id)).returning();
    return result[0];
  }

  // Chat message methods
  async getChatMessages(groupId: string, limit = 50) {
    return await db.select().from(chatMessages).where(eq(chatMessages.groupId, groupId)).orderBy(desc(chatMessages.createdAt)).limit(limit);
  }

  async createChatMessage(message: InsertChatMessage) {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }

  async updateChatMessage(id: string, message: Partial<InsertChatMessage>) {
    const result = await db.update(chatMessages).set(message).where(eq(chatMessages.id, id)).returning();
    return result[0];
  }

  // Typing indicator methods
  async getTypingIndicators(groupId: string) {
    return await db.select().from(typingIndicators).where(eq(typingIndicators.groupId, groupId)).orderBy(desc(typingIndicators.lastTyping));
  }

  async upsertTypingIndicator(indicator: InsertTypingIndicator) {
    const existing = await db.select().from(typingIndicators).where(
      and(
        eq(typingIndicators.groupId, indicator.groupId!),
        eq(typingIndicators.userId, indicator.userId!)
      )
    ).limit(1);

    if (existing.length > 0) {
      const result = await db.update(typingIndicators).set({ lastTyping: new Date() }).where(eq(typingIndicators.id, existing[0].id)).returning();
      return result[0];
    } else {
      const result = await db.insert(typingIndicators).values(indicator).returning();
      return result[0];
    }
  }

  async clearTypingIndicator(groupId: string, userId: string) {
    await db.delete(typingIndicators).where(
      and(eq(typingIndicators.groupId, groupId), eq(typingIndicators.userId, userId))
    );
  }

  // Generated image methods
  async getGeneratedImages(businessId: string) {
    return await db.select().from(generatedImages).where(eq(generatedImages.businessId, businessId)).orderBy(desc(generatedImages.createdAt));
  }

  async createGeneratedImage(image: InsertGeneratedImage) {
    const result = await db.insert(generatedImages).values(image).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();