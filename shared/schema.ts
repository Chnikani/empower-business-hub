import { pgTable, text, serial, integer, boolean, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["business_owner", "business_manager"]);

export const businessAccounts = pgTable("business_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("business_manager").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const chatGroups = pgTable("chat_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  businessId: uuid("business_id"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const groupMembers = pgTable("group_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id"),
  userId: uuid("user_id"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  isAdmin: boolean("is_admin").default(false)
});

export const groupInvitations = pgTable("group_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id"),
  createdBy: uuid("created_by"),
  invitationCode: text("invitation_code").notNull().unique(),
  expiresAt: timestamp("expires_at"),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id"),
  userId: uuid("user_id"),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"),
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  replyTo: uuid("reply_to"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const typingIndicators = pgTable("typing_indicators", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id"),
  userId: uuid("user_id"),
  lastTyping: timestamp("last_typing").defaultNow().notNull()
});

export const generatedImages = pgTable("generated_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull(),
  prompt: text("prompt").notNull(),
  style: text("style").notNull(),
  imageUrl: text("image_url").notNull(),
  storagePath: text("storage_path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const businessAccountsRelations = relations(businessAccounts, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [businessAccounts.ownerId],
    references: [profiles.id]
  }),
  chatGroups: many(chatGroups),
  generatedImages: many(generatedImages)
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
  businessAccounts: many(businessAccounts),
  chatGroups: many(chatGroups),
  groupMembers: many(groupMembers),
  groupInvitations: many(groupInvitations),
  chatMessages: many(chatMessages),
  typingIndicators: many(typingIndicators)
}));

export const chatGroupsRelations = relations(chatGroups, ({ one, many }) => ({
  business: one(businessAccounts, {
    fields: [chatGroups.businessId],
    references: [businessAccounts.id]
  }),
  creator: one(profiles, {
    fields: [chatGroups.createdBy],
    references: [profiles.id]
  }),
  members: many(groupMembers),
  invitations: many(groupInvitations),
  messages: many(chatMessages),
  typingIndicators: many(typingIndicators)
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(chatGroups, {
    fields: [groupMembers.groupId],
    references: [chatGroups.id]
  }),
  user: one(profiles, {
    fields: [groupMembers.userId],
    references: [profiles.id]
  })
}));

export const groupInvitationsRelations = relations(groupInvitations, ({ one }) => ({
  group: one(chatGroups, {
    fields: [groupInvitations.groupId],
    references: [chatGroups.id]
  }),
  creator: one(profiles, {
    fields: [groupInvitations.createdBy],
    references: [profiles.id]
  })
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  group: one(chatGroups, {
    fields: [chatMessages.groupId],
    references: [chatGroups.id]
  }),
  user: one(profiles, {
    fields: [chatMessages.userId],
    references: [profiles.id]
  }),
  replyToMessage: one(chatMessages, {
    fields: [chatMessages.replyTo],
    references: [chatMessages.id]
  })
}));

export const typingIndicatorsRelations = relations(typingIndicators, ({ one }) => ({
  group: one(chatGroups, {
    fields: [typingIndicators.groupId],
    references: [chatGroups.id]
  }),
  user: one(profiles, {
    fields: [typingIndicators.userId],
    references: [profiles.id]
  })
}));

export const generatedImagesRelations = relations(generatedImages, ({ one }) => ({
  business: one(businessAccounts, {
    fields: [generatedImages.businessId],
    references: [businessAccounts.id]
  })
}));

export const insertBusinessAccountSchema = createInsertSchema(businessAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  createdAt: true,
  updatedAt: true
});

export const insertChatGroupSchema = createInsertSchema(chatGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({
  id: true,
  joinedAt: true
});

export const insertGroupInvitationSchema = createInsertSchema(groupInvitations).omit({
  id: true,
  createdAt: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTypingIndicatorSchema = createInsertSchema(typingIndicators).omit({
  id: true,
  lastTyping: true
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
  createdAt: true
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// Type Exports
export type BusinessAccount = typeof businessAccounts.$inferSelect;
export type InsertBusinessAccount = typeof businessAccounts.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type ChatGroup = typeof chatGroups.$inferSelect;
export type InsertChatGroup = typeof chatGroups.$inferInsert;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertGroupMember = typeof groupMembers.$inferInsert;
export type GroupInvitation = typeof groupInvitations.$inferSelect;
export type InsertGroupInvitation = typeof groupInvitations.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type TypingIndicator = typeof typingIndicators.$inferSelect;
export type InsertTypingIndicator = typeof typingIndicators.$inferInsert;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = typeof generatedImages.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;