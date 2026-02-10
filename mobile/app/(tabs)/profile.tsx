import { Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/clerk-expo';

const ProfileTab = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className='bg-surface flex-1' edges={['top']}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <Text className='text-white'>Profile Tab</Text>
        <Pressable onPress={() => signOut()} className='mt-4 p-4 bg-red-600 rounded'>
          <Text className='text-white'>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileTab