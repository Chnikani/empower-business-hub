import { z } from "zod";
import { nanoid } from "nanoid";
import { storage } from "./storage";
import {
  insertProfileSchema,
  insertBusinessAccountSchema,
  insertChatGroupSchema,
  insertGroupMemberSchema,
  insertGroupInvitationSchema,
  insertChatMessageSchema,
  insertTypingIndicatorSchema,
} from "../shared/schema";
import { Express, Request, Response } from "express";

export async function registerRoutes(app: Express) {
  app.get("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const updates = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.params.id, updates);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/business-accounts/owner/:ownerId", async (req, res) => {
    try {
      const accounts = await storage.getBusinessAccountsByOwner(req.params.ownerId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching business accounts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/business-accounts", async (req, res) => {
    try {
      const accountData = insertBusinessAccountSchema.parse(req.body);
      const account = await storage.createBusinessAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid business account data", details: error.errors });
      }
      console.error("Error creating business account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/chat-groups/business/:businessId", async (req, res) => {
    try {
      const groups = await storage.getChatGroupsByBusiness(req.params.businessId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching chat groups:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/chat-groups", async (req, res) => {
    try {
      const groupData = insertChatGroupSchema.parse(req.body);
      const group = await storage.createChatGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid chat group data", details: error.errors });
      }
      console.error("Error creating chat group:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/group-members/:groupId", async (req, res) => {
    try {
      const members = await storage.getGroupMembers(req.params.groupId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching group members:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/group-members", async (req, res) => {
    try {
      const memberData = insertGroupMemberSchema.parse(req.body);
      const member = await storage.addGroupMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid group member data", details: error.errors });
      }
      console.error("Error adding group member:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/group-invitations/code/:code", async (req, res) => {
    try {
      const invitation = await storage.getGroupInvitation(req.params.code);
      if (!invitation) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      res.json(invitation);
    } catch (error) {
      console.error("Error fetching invitation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/group-invitations", async (req, res) => {
    try {
      const invitationData = {
        ...insertGroupInvitationSchema.parse(req.body),
        invitationCode: nanoid(16),
      };
      const invitation = await storage.createGroupInvitation(invitationData);
      res.status(201).json(invitation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid invitation data", details: error.errors });
      }
      console.error("Error creating invitation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/chat-messages/:groupId", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(req.params.groupId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid message data", details: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/typing-indicators", async (req, res) => {
    try {
      const indicatorData = insertTypingIndicatorSchema.parse(req.body);
      const indicator = await storage.upsertTypingIndicator(indicatorData);
      res.json(indicator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid typing indicator data", details: error.errors });
      }
      console.error("Error updating typing indicator:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/typing-indicators/:groupId/:userId", async (req, res) => {
    try {
      await storage.clearTypingIndicator(req.params.groupId, req.params.userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing typing indicator:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/generated-images/:businessId", async (req, res) => {
    try {
      const images = await storage.getGeneratedImages(req.params.businessId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching generated images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, style, business_id } = req.body;
      if (!prompt || !style || !business_id) {
        return res.status(400).json({ error: "Missing required fields: prompt, style, and business_id are required" });
      }

      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const stylePrompts: { [key: string]: string } = {
        realistic: "photorealistic, high quality, detailed",
        illustration: "digital illustration, artistic, stylized",
        abstract: "abstract art, creative, modern",
        minimalist: "minimalist design, clean, simple",
        vintage: "vintage style, retro, classic",
        modern: "modern design, contemporary, sleek",
      };

      const enhancedPrompt = `${prompt}, ${stylePrompts[style] || "high quality"}`;

      const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.text();
        console.error("OpenAI API error:", errorData);
        return res.status(500).json({ error: `OpenAI API error: ${imageResponse.status} ${imageResponse.statusText}` });
      }

      const imageData = await imageResponse.json();
      if (!imageData.data || !imageData.data[0] || !imageData.data[0].url) {
        return res.status(500).json({ error: "Invalid response from OpenAI API" });
      }

      const imageUrl = imageData.data[0].url;

      const generatedImage = await storage.createGeneratedImage({
        businessId: business_id,
        prompt,
        style,
        imageUrl,
        storagePath: `temp/${Date.now()}.png`,
      });

      res.json(generatedImage);
    } catch (error) {
      console.error("Error in generate-image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

}