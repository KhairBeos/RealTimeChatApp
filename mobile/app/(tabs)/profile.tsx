import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileTab = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text className="text-white">Profile Tab</Text>
        <Pressable onPress={() => signOut()} className="mt-4 rounded bg-red-600 p-4">
          <Text className="text-white">Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileTab;
