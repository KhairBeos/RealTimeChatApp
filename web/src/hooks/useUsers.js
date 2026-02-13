import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export const useUsers = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        return [];
      }
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.users ?? [];
    },
  });
};
