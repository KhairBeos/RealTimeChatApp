import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

function useAuthSocial() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_github") => {
    if (loadingStrategy) return; // Prevent multiple simultaneous auth attempts
    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      
      if(!createdSessionId || !setActive) {
        const provider = strategy === "oauth_google" ? "Google" : "Github";
        Alert.alert("Sign-in incomplete", `Failed to sign in with ${provider}. Please try again.`);
        return;
      }
      await setActive({ session: createdSessionId });
    } catch (error) {
      console.log("Error in social auth:", error);
      const provider = strategy === "oauth_google" ? "Google" : "Github";
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
}

export default useAuthSocial;