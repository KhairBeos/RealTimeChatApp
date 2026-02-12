import { useAxios } from "@/lib/axios";
import { Message } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useMessages = (chatId: string) => {
  const { apiWithAuth } = useAxios();

  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async (): Promise<Message[]> => {
      const { data } = await apiWithAuth<Message[]>({
        method: "GET",
        url: `/messages/chat/${chatId}`,
      });
      return data;
    },
    enabled: !!chatId,
  });
};
