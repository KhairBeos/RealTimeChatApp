import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#F4A261" />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? "/(tabs)" : "/(auth)"} />;
};

export default Index;
