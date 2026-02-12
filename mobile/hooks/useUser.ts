import { useAxios } from "@/lib/axios";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const { apiWithAuth } = useAxios();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiWithAuth<{ users: User[] }>({
        method: "GET",
        url: "/users",
      });
      return data.users;
    },
  });
};
