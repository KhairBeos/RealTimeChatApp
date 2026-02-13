import { useSocketStore } from "@/lib/socket";
import { Chat } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

const ChatItem = ({ chat, onPress }: { chat: Chat; onPress: () => void }) => {
  const participant = chat.participant;

  // Dùng selector để chỉ subscribe vào các fields cần thiết
  // Tránh re-render khi những field khác thay đổi (socket, isConnected, queryClient...)
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const typingUsers = useSocketStore((state) => state.typingUsers);
  const unreadChats = useSocketStore((state) => state.unreadChats);

  const isOnline = participant ? onlineUsers.has(participant._id) : false;
  const isTyping = participant ? typingUsers.get(chat._id) === participant._id : false;
  const hasUnreadMessages = unreadChats.has(chat._id);

  return (
    <Pressable
      className="flex-row items-center py-3 active:opacity-70"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${participant?.name ?? "Unknown"}`}
    >
      {/* Avatar with online status indicator */}
      <View className="relative">
        {participant?.avatar ? (
          <Image source={participant.avatar} style={{ width: 56, height: 56, borderRadius: 999 }} />
        ) : (
          <View className="bg-muted h-14 w-14 rounded-full" />
        )}
        {isOnline && (
          <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-surface bg-green-500" />
        )}
      </View>

      {/* Chat details */}
      <View className="ml-4 flex-1">
        {/* Name and last message time */}
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-base font-medium ${hasUnreadMessages ? "text-primary" : "text-foreground"}`}
          >
            {participant?.name ?? "Unknown"}
          </Text>
          <View className="flex-row items-center gap-2">
            {hasUnreadMessages && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
            <Text className="text-xs text-subtle-foreground">
              {chat.lastMessageAt
                ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false })
                : ""}
            </Text>
          </View>
        </View>
        {/* Last message preview */}
        <View className="mt-1 flex-row items-center justify-between">
          {isTyping ? (
            <Text className="text-sm italic text-primary">Typing...</Text>
          ) : (
            <Text
              className={`mr-3 flex-1 text-sm ${hasUnreadMessages ? "font-medium text-foreground" : "text-subtle-foreground"}`}
              numberOfLines={1}
            >
              {chat.lastMessage?.text || "No messages yet"}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
