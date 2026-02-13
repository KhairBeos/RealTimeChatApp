import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocketStore } from "../lib/socket";

export const useSocketConnection = (activeChatId) => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const { socket, connect, disconnect, joinChat, leaveChat } = useSocketStore();

  useEffect(() => {
    let isCancelled = false;
    if (isSignedIn) {
      getToken().then((token) => {
        if (!isCancelled && token) {
          connect(token, queryClient);
        }
      });
    } else {
      // User is signed out; ensure any existing socket connection is closed.
      disconnect();
    }
    return () => {
      // Prevent connecting after dependencies change or component unmounts.
      isCancelled = true;
    };
  }, [isSignedIn, connect, disconnect, getToken, queryClient]);
  useEffect(() => {
    // Disconnect socket when this hook's owner unmounts.
    return () => {
      disconnect();
    };
  }, [disconnect]);
  useEffect(() => {
    if (activeChatId && socket) {
      joinChat(activeChatId);
      return () => leaveChat(activeChatId);
    }
  }, [activeChatId, socket, joinChat, leaveChat]);
};
