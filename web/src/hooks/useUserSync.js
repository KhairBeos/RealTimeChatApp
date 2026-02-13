import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import api from "../lib/axios";

function useUserSync() {
  const { isSignedIn, getToken } = useAuth();
  const hasAttemptedRef = useRef(false);

  const {
    mutate: syncUser,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        const error = new Error("Missing auth token");
        error.name = "AuthTokenMissing";
        throw error;
      }
      const res = await api.post(
        "/auth/callback",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (!isSignedIn) {
      hasAttemptedRef.current = false;
      return;
    }

    if (hasAttemptedRef.current) {
      return;
    }

    if (!isPending && !isSuccess) {
      hasAttemptedRef.current = true;
      syncUser();
    }
  }, [isSignedIn, syncUser, isPending, isSuccess]);

  return { isSynced: isSuccess, isSyncing: isPending };
}
export default useUserSync;
