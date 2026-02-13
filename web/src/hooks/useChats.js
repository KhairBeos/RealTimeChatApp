import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export const useChats = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        return [];
      }
      const res = await api.get("/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.chats ?? [];
    },
  });
};

export const useGetOrCreateChat = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId) => {
      const token = await getToken();
      if (!token) {
        return null;
      }
      const res = await api.post(
        `/chats/with/${participantId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data?.chat ?? null;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });
};
