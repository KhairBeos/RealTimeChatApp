import { ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatsTab = () => {
  return (
    <SafeAreaView className='bg-surface flex-1' edges={['top']}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <Text className='text-white'>Chats Tab</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
export default ChatsTab