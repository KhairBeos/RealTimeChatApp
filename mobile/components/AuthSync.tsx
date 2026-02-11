import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Sentry from "@sentry/react-native";
import { useEffect, useRef } from "react";

const AuthSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (isSignedIn && user && !hasSyncedRef.current) {
      hasSyncedRef.current = true;

      syncUser(undefined, {
        onSuccess: (data) => {
          console.log("User synced successfully:", data.name);
          Sentry.logger.info(Sentry.logger.fmt`User synced successfully: ${data.name}`, {
            userId: user.id,
            userName: data.name,
          });
        },
        onError: (error) => {
          console.error("Failed to sync user:", error);
          Sentry.logger.error(Sentry.logger.fmt`Failed to sync user: ${error}`, {
            userId: user.id,
            error: error instanceof Error ? error.message : String(error),
          });
        },
      });
    } else if (!isSignedIn) {
      hasSyncedRef.current = false;
    }
  }, [isSignedIn, user, syncUser]);

  return null;
};

export default AuthSync;
