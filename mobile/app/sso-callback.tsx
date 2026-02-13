import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const SsoCallback = () => {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(isSignedIn ? "/(tabs)" : "/(auth)");
  }, [isLoaded, isSignedIn]);

  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <ActivityIndicator size="large" color="#F4A261" />
    </View>
  );
};

export default SsoCallback;
