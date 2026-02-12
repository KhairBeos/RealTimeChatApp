import { useAxios } from "@/lib/axios";
import { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAuthCallback = () => {
  const { apiWithAuth } = useAxios();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiWithAuth<User>({ url: "/auth/callback", method: "POST" });
      return data;
    },
  });
  return mutation;
};

export const useCurrentUser = () => {
  const { apiWithAuth } = useAxios();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await apiWithAuth<User>({ url: "/auth/me", method: "GET" });
      return data;
    },
  });
};
