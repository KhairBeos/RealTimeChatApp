import ChatItem from "@/components/ChatItem";
import EmptyUI from "@/components/EmptyUI";
import { useChats } from "@/hooks/useChats";
import { Chat } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

const ChatsTab = () => {
  const router = useRouter();
  const { data: chats, isLoading, error } = useChats();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#f4A261" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <Text className="text-red-500">Error loading chats.</Text>
      </View>
    );
  }

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: chat._id,
        participantId: chat.participants._id,
        name: chat.participants.name,
        avatar: chat.participants.avatar,
      },
    });
  };

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ChatItem chat={item} onPress={() => handleChatPress(item)} />}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
          <EmptyUI
            title="No chats yet"
            subtitle="Start a new conversation to see your chats here!"
            iconName="chatbubbles-outline"
            iconSize={64}
            iconColor="#6B6B70"
            buttonLabel="New Chat"
            //onPressButton={() => router.push("/new-chat")}
          />
        }
      />
    </View>
  );
};
export default ChatsTab;

function Header() {
  const router = useRouter();
  return (
    <View className="px-5 pb-4 pt-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Chats</Text>
        <Pressable
          className="size-10 items-center justify-center rounded-full bg-primary"
          //onPress={() => router.push('/new-chat')}
        >
          <Ionicons name="create-outline" size={20} color="#0D0D0F" />
        </Pressable>
      </View>
    </View>
  );
}
