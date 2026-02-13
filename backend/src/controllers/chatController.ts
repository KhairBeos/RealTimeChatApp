import type { NextFunction, Response } from "express";
import { Types } from "mongoose";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipants = chat.participants.find(
        (participant) => participant._id.toString() !== userId,
      );

      return {
        _id: chat._id,
        participant: otherParticipants ?? null,
        latestMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });

    res.json({ chats: formattedChats });
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { participantId: participantIdParam } = req.params;
    const participantId = Array.isArray(participantIdParam)
      ? participantIdParam[0]
      : participantIdParam;

    if (!participantId) {
      res.status(400).json({ message: "Participant ID is required" });
      return;
    }

    if (!Types.ObjectId.isValid(participantId)) {
      res.status(400).json({ message: "Invalid Participant ID" });
      return;
    }

    if (participantId === userId) {
      res.status(400).json({ message: "Cannot create chat with yourself" });
      return;
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");

    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
    }

    const otherParticipant = chat.participants.find(
      (participant: any) => participant._id.toString() !== userId,
    );

    res.json({
      chat: {
        _id: chat._id,
        participant: otherParticipant ?? null,
        latestMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
}
