import React from 'react'
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // or a loading indicator
  }
  if(isSignedIn){
    return <Redirect href="/(tabs)" />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}

export default AuthLayout