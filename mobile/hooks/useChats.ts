import { useAxios } from "@/lib/axios";
import type { Chat } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
  const { apiWithAuth } = useAxios();

  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await apiWithAuth<Chat[]>({ method: "GET", url: "/chats" });
      return data;
    },
  });
};
