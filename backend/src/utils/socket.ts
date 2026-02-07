import { Socket, Server as SocketServer} from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { Chat } from "../models/Chat";

export const onlineUsers: Map<string,string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {

    const allowedOrigins = [
        "http://localhost:8081",
        "http://localhost:5173",
        process.env.FRONTEND_URL,
    ].filter(Boolean) as string[];

    const io = new SocketServer(httpServer, {
        cors: {
            origin: allowedOrigins,
        }
    });

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if(!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });

            const clerkUserId = session.sub;

            const user = await User.findOne({ clerkUserId });
            if(!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.data.userId = user._id.toString();

            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.data.userId;

        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

        onlineUsers.set(userId, socket.id);

        socket.broadcast.emit("user-online", { userId });

        socket.join(`user:${userId}`);

        socket.on("join-chat", async (chatId: string ) => {
            try {
                const allowedChat = await Chat.exists({ 
                    _id: chatId,
                    participants: userId,
                });

                if(!allowedChat) {
                    socket.emit("socket-error", { message: "Access denied to this chat." });
                    return;
                }
                socket.join(`chat:${chatId}`);
            } catch (error) {
                socket.emit("socket-error", { message: "Failed to join chat." });
            }
        });

        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat:${chatId}`);
        });

        socket.on("send-message", async (data: { chatId: string; content: string; }) => {
            try {
            const { chatId, content } = data;

                const chat = await Chat.findOne({ 
                    _id: chatId,
                    participants: userId,
                });

                if(!chat) {
                    socket.emit("error", { message: "Chat not found or access denied." });
                    return;
                }

                const message = await Message.create({
                    chat: chatId,
                    sender: userId,
                    text: content,
                });

                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save();

                await message.populate("sender", "name avatar");
                io.to(`chat:${chatId}`).emit("new-message", message );

                for(const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit("new-message", message );
                }
            } catch (error) {
                socket.emit("socket-error", { message: "Failed to send message." });
            }
        });

        // socket.on("typing", (data: { chatId: string; isTyping: boolean; }) => {
        //     const { chatId, isTyping } = data;
        //     socket.to(`chat:${chatId}`).emit("typing", { userId, isTyping });
        // });

        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            socket.broadcast.emit("user-offline", { userId });
        });
    });

    return io;
}