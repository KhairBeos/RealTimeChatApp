import { io } from "socket.io-client";
import { create } from "zustand";

const SOCKET_URL = import.meta.env.VITE_API_URL;
if (!SOCKET_URL) {
  throw new Error("VITE_API_URL environment variable is not set");
}

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: new Set(),
  typingUsers: new Map(), // chatId -> Set<userId>
  queryClient: null,

  connect: (token, queryClient) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected || !queryClient) return;

    if (existingSocket) {
      existingSocket.removeAllListeners();
      existingSocket.disconnect();
    }

    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("connect", () => {
      if (import.meta.env.DEV) {
        console.log("Socket connected:", socket.id);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("socket-error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("online-users", ({ userIds }) => {
      set({ onlineUsers: new Set(userIds) });
    });

    socket.on("user-online", ({ userId }) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user-offline", ({ userId }) => {
      set((state) => {
        const onlineUsers = new Set(state.onlineUsers);
        onlineUsers.delete(userId);
        return { onlineUsers };
      });
    });

    socket.on("typing", ({ userId, chatId, isTyping }) => {
      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        const chatTypingUsers = new Set(typingUsers.get(chatId) || []);
        if (isTyping) {
          chatTypingUsers.add(userId);
        } else {
          chatTypingUsers.delete(userId);
        }

        if (chatTypingUsers.size > 0) {
          typingUsers.set(chatId, chatTypingUsers);
        } else {
          typingUsers.delete(chatId);
        }
        return { typingUsers };
      });
    });

    socket.on("new-message", (message) => {
      const senderId = message.sender?._id;

      queryClient.setQueryData(["messages", message.chat], (old) => {
        if (!old) return [message];
        const filtered = old.filter(
          (m) =>
            !(
              m._id?.startsWith("temp-") &&
              m.chat === message.chat &&
              m.text === message.text &&
              m.sender?._id === senderId
            ),
        );
        const exists = filtered.some((m) => m._id === message._id);
        return exists ? filtered : [...filtered, message];
      });

      queryClient.setQueryData(["chats"], (oldChats) => {
        return oldChats?.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              lastMessage: {
                _id: message._id,
                text: message.text,
                sender: senderId,
                createdAt: message.createdAt,
              },
              lastMessageAt: message.createdAt,
            };
          }
          return chat;
        });
      });

      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        typingUsers.delete(message.chat);
        return { typingUsers };
      });
    });

    set({ socket, queryClient });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({
        socket: null,
        onlineUsers: new Set(),
        typingUsers: new Map(),
        queryClient: null,
      });
    }
  },

  joinChat: (chatId) => {
    get().socket?.emit("join-chat", chatId);
  },

  leaveChat: (chatId) => {
    get().socket?.emit("leave-chat", chatId);
  },

  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket?.connected || !queryClient) return;

    // Create optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      chat: chatId,
      sender: {
        _id: currentUser._id,
        name: currentUser.fullName || currentUser.firstName || "You",
        email: currentUser.primaryEmailAddress?.emailAddress || "",
        avatar: currentUser.imageUrl,
      },
      text,
      createdAt: new Date().toISOString(),
    };

    // Update cache optimistically
    queryClient.setQueryData(["messages", chatId], (old) => {
      if (!old) return [optimisticMessage];
      return [...old, optimisticMessage];
    });

    socket.once("socket-error", () => {
      console.error("Failed to send message");
      queryClient.setQueryData(["messages", chatId], (old) => {
        if (!old) return [];
        return old.filter((m) => m._id !== tempId);
      });
    });

    socket.emit("send-message", { chatId, text });
  },

  setTyping: (chatId, isTyping) => {
    get().socket?.emit("typing", { chatId, isTyping });
  },
}));
