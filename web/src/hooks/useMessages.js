import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useMessages = (chatId) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        return [];
      }
      const res = await api.get(`/messages/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.messages ?? [];
    },
    enabled: !!chatId,
  });
};
