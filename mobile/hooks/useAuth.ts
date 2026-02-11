import { useAxios } from "@/lib/axios";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";

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
