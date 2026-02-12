import UserItem from "@/components/UserItem";
import { useGetOrCreateChat } from "@/hooks/useChats";
import { useUser } from "@/hooks/useUser";
import { useSocketStore } from "@/lib/socket";
import { User } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allUsers, isLoading } = useUser();
  const { mutate: getOrCreateChat, isPending: isGettingOrCreateChat } = useGetOrCreateChat();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  const users = (allUsers ?? []).filter((u) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
  });

  const handleUserSelect = (user: User) => {
    getOrCreateChat(user._id, {
      onSuccess: (chat) => {
        router.dismiss();

        setTimeout(() => {
          router.push({
            pathname: "/chat/[id]",
            params: {
              id: chat._id,
              participantId: chat.participant?._id ?? "",
              name: chat.participant?.name ?? "Unknown",
              avatar: chat.participant?.avatar ?? "",
            },
          });
        }, 100);
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="h-[95%] overflow-hidden rounded-t-3xl bg-surface">
          <View className="flex-row items-center border-b border-surface-light bg-surface px-5 pb-3 pt-3">
            <Pressable
              className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-surface-card"
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color="#F4A261" />
            </Pressable>

            <View className="flex-1">
              <Text className="text-xl font-semibold text-foreground">New Chat</Text>
              <Text className="mt-0.5 text-xs text-muted-foreground">
                Search for a user to start a new conversation
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="bg-surface px-5 pb-2 pt-3">
            <View className="flex-row items-center gap-2 rounded-full border border-surface-light bg-surface-card px-3 py-1.5">
              <Ionicons name="search" size={18} color="#6B6B70" />
              <TextInput
                placeholder="Search users"
                placeholderTextColor="#6B6B70"
                className="flex-1 text-sm text-foreground"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Users List */}
          <View className="flex-1 bg-surface">
            {isGettingOrCreateChat || isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#F4A261" />
              </View>
            ) : !users || users.length === 0 ? (
              <View className="flex-1 items-center justify-center px-5">
                <Ionicons name="person-outline" size={64} color="#6B6B70" />
                <Text className="mt-4 text-lg text-muted-foreground">No users found</Text>
                <Text className="mt-1 text-center text-sm text-subtle-foreground">
                  Try a different search term
                </Text>
              </View>
            ) : (
              <ScrollView
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <Text className="mb-3 text-xs text-muted-foreground">USERS</Text>
                {users.map((user) => (
                  <UserItem
                    key={user._id}
                    user={user}
                    isOnline={onlineUsers.has(user._id)}
                    onPress={() => handleUserSelect(user)}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewChatScreen;
