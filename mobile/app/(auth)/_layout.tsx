import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // or a loading indicator
  }
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
