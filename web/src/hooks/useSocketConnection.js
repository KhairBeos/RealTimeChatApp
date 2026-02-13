import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "../lib/socket";

export const useSocketConnection = (activeChatId) => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const { socket, connect, disconnect, joinChat, leaveChat } = useSocketStore();

  useEffect(() => {
    if (isSignedIn) {
      getToken().then((token) => {
        if (token) connect(token, queryClient);
      });
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isSignedIn, connect, disconnect, getToken, queryClient]);

  useEffect(() => {
    if (activeChatId && socket) {
      joinChat(activeChatId);
      return () => leaveChat(activeChatId);
    }
  }, [activeChatId, socket, joinChat, leaveChat]);
};