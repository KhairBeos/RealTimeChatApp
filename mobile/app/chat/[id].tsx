import EmptyUI from "@/components/EmptyUI";
import MessageBubble from "@/components/MessageBubble";
import { useCurrentUser } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { useMessages } from "@/hooks/useMessages";
import { useSocketStore } from "@/lib/socket";
import { MessageSender } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type ChatParams = {
  id: string;
  participantId: string;
  name: string;
  avatar: string;
};

const ChatDetailScreen = () => {
  const { id: chatId, avatar, name, participantId } = useLocalSearchParams<ChatParams>();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: chats } = useChats();
  const { data: messages, isLoading } = useMessages(chatId);

  const normalizeParam = (value?: string | string[]) => {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
  };

  const normalizedChatId = normalizeParam(chatId);
  const normalizedParticipantId = normalizeParam(participantId);
  const chatParticipantId =
    chats?.find((chat) => chat._id === normalizedChatId)?.participant?._id ?? "";
  const resolvedParticipantId = normalizedParticipantId || chatParticipantId;

  // Dùng selector để chỉ subscribe vào các fields cần thiết
  // Tránh re-render khi những field khác thay đổi
  const joinChat = useSocketStore((state) => state.joinChat);
  const leaveChat = useSocketStore((state) => state.leaveChat);
  const sendMessage = useSocketStore((state) => state.sendMessage);
  const sendTyping = useSocketStore((state) => state.sendTyping);
  const isConnected = useSocketStore((state) => state.isConnected);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const typingUsers = useSocketStore((state) => state.typingUsers);

  const isOnline = !!resolvedParticipantId && onlineUsers.has(String(resolvedParticipantId));
  const isTyping = typingUsers.get(normalizedChatId) === resolvedParticipantId;

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalMessageCountRef = useRef(0);

  useEffect(() => {
    if (normalizedChatId && isConnected) joinChat(normalizedChatId);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (normalizedChatId) {
        if (isConnected) {
          sendTyping(normalizedChatId, false);
        }
        leaveChat(normalizedChatId);
      }
    };
  }, [normalizedChatId, isConnected, joinChat, leaveChat, sendTyping]);

  // Reset isSending khi message được thêm vào list (tức là server confirmed)
  useEffect(() => {
    if (isSending && messages && messages.length > finalMessageCountRef.current) {
      // Message mới đã được thêm - gửi thành công
      finalMessageCountRef.current = messages.length;
      setIsSending(false);
    }
  }, [messages, isSending]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onKeyboardShow = (event: KeyboardEvent) => {
      setAndroidKeyboardHeight(event.endCoordinates.height);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    };

    const onKeyboardHide = () => {
      setAndroidKeyboardHeight(0);
    };

    const showSubscription = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
    const hideSubscription = Keyboard.addListener("keyboardDidHide", onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleTyping = useCallback(
    (text: string) => {
      setMessageText(text);

      if (!isConnected || !normalizedChatId) return;

      if (text.length > 0) {
        sendTyping(normalizedChatId, true);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(normalizedChatId, false);
        }, 2000);
      } else {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        sendTyping(normalizedChatId, false);
      }
    },
    [normalizedChatId, isConnected, sendTyping],
  );

  const handleSendMessage = () => {
    if (__DEV__) {
      console.log({ isSending, isConnected, currentUser, messageText });
    }
    if (!messageText.trim() || isSending || !isConnected || !currentUser) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping(normalizedChatId, false);

    setIsSending(true);
    sendMessage(normalizedChatId, messageText.trim(), {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
    });
    setMessageText("");
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 4 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center border-b border-surface-light bg-surface px-4 py-2">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#F4A261" />
          </Pressable>
          <View className="ml-2 flex-1 flex-row items-center">
            {avatar && (
              <Image source={avatar} style={{ width: 40, height: 40, borderRadius: 999 }} />
            )}
            <View className="ml-3">
              <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                {name}
              </Text>
              <Text className={`text-xs ${isTyping ? "text-primary" : "text-muted-foreground"}`}>
                {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Pressable className="h-9 w-9 items-center justify-center rounded-full">
              <Ionicons name="call-outline" size={20} color="#A0A0A5" />
            </Pressable>
            <Pressable className="h-9 w-9 items-center justify-center rounded-full">
              <Ionicons name="videocam-outline" size={20} color="#A0A0A5" />
            </Pressable>
          </View>
        </View>

        {/* Message + Keyboard input */}
        <View className="flex-1 bg-surface">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#F4A261" />
            </View>
          ) : !messages || messages.length === 0 ? (
            <EmptyUI
              title="No messages yet"
              subtitle="Start the conversation!"
              iconName="chatbubbles-outline"
              iconColor="#6B6B70"
              iconSize={64}
            />
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
              keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }}
            >
              {messages.map((message) => {
                const senderId = (message.sender as MessageSender)._id;
                const isFromMe = currentUser ? senderId === currentUser._id : false;

                return <MessageBubble key={message._id} message={message} isFromMe={isFromMe} />;
              })}
            </ScrollView>
          )}

          {/* Input bar */}
          <View
            className="border-t border-surface-light bg-surface px-3 pb-6 pt-2"
            style={Platform.OS === "android" ? { marginBottom: androidKeyboardHeight } : undefined}
          >
            <View className="flex-row items-center gap-2 rounded-3xl bg-surface-card px-3 py-1">
              <Pressable className="h-8 w-8 items-center justify-center rounded-full">
                <Ionicons name="add" size={22} color="#F4A261" />
              </Pressable>

              <TextInput
                placeholder="Type a message"
                placeholderTextColor="#6B6B70"
                className="flex-1 py-2 text-sm text-foreground"
                multiline
                style={{ maxHeight: 100 }}
                value={messageText}
                onChangeText={handleTyping}
                onSubmitEditing={handleSendMessage}
                editable={!isSending}
                returnKeyType="send"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 50);
                }}
              />

              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full bg-primary"
                onPress={() => {
                  handleSendMessage();
                  Keyboard.dismiss();
                }}
                disabled={!messageText.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#0D0D0F" />
                ) : (
                  <Ionicons name="send" size={18} color="#0D0D0F" />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;
