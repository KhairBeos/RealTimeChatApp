import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useCurrentUser = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        return null;
      }
      const { data } = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });
};
