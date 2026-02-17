import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Alert } from "react-native";

function useAuthSocial() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const getProviderName = (strategy: "oauth_google" | "oauth_github" | "oauth_facebook") => {
    switch (strategy) {
      case "oauth_google":
        return "Google";
      case "oauth_github":
        return "GitHub";
      case "oauth_facebook":
        return "Facebook";
      default:
        return "Provider";
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_github" | "oauth_facebook") => {
    if (loadingStrategy) return;
    setLoadingStrategy(strategy);

    try {
      const redirectUrl = Linking.createURL("/sso-callback");
      const { createdSessionId, setActive } = await startSSOFlow({ strategy, redirectUrl });

      if (!createdSessionId || !setActive) {
        const provider = getProviderName(strategy);
        Alert.alert("Sign-in incomplete", `Failed to sign in with ${provider}. Please try again.`);
        return;
      }
      await setActive({ session: createdSessionId });
    } catch (error) {
      console.log("Error in social auth:", error);
      const provider = getProviderName(strategy);
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
}

export default useAuthSocial;
