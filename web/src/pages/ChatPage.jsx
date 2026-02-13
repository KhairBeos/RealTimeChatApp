import { UserButton } from "@clerk/clerk-react";
import { MessageSquareIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { useSocketStore } from "../lib/socket";

import { ChatHeader } from "../components/ChatHeader";
import { ChatInput } from "../components/ChatInput";
import { ChatListItem } from "../components/ChatListItem";
import { MessageBubble } from "../components/MessageBubble";
import { NewChatModal } from "../components/NewChatModal";
import { useChats, useGetOrCreateChat } from "../hooks/useChats";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useMessages } from "../hooks/useMessages";

function ChatPage() {
  const { data: currentUser } = useCurrentUser();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get("chat");

  const [messageInput, setMessageInput] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket, setTyping, sendMessage } = useSocketStore();

  useSocketConnection();

  const { data: chats = [], isLoading: chatsLoading } = useChats();
  const { data: messages = [], isLoading: messagesLoading } = useMessages(activeChatId);
  const startChatMutation = useGetOrCreateChat();

  // scroll to bottom when chat or messages changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, messages]);

  const handleStartChat = (participantId) => {
    startChatMutation.mutate(participantId, {
      onSuccess: (chat) => setSearchParams({ chat: chat._id }),
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId || !socket || !currentUser) return;

    const text = messageInput.trim();
    sendMessage(activeChatId, text, currentUser);
    setMessageInput("");
    setTyping(activeChatId, false);
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    if (!activeChatId) return;

    setTyping(activeChatId, true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(activeChatId, false);
    }, 2000);
  };

  const activeChat = chats.find((c) => c._id === activeChatId);

  return (
    <div className="bg-base-100 text-base-content flex h-screen">
      {/* Sidebar */}
      <div className="border-base-300 bg-base-200 flex w-80 flex-col border-r">
        {/* HEADER */}
        <div className="border-base-300 border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <Link to="/chat" className="flex items-center gap-2">
              <div
                className="bg-linear-to-br flex h-8 w-8 items-center
               justify-center rounded-lg from-amber-400 to-orange-500"
              >
                <SparklesIcon className="text-primary-content h-4 w-4" />
              </div>
              <span className="font-bold">ChatLorVCL</span>
            </Link>
            <UserButton />
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="btn btn-primary btn-block bg-linear-to-r gap-2 rounded-xl
             border-none from-amber-500 to-orange-500"
          >
            <PlusIcon className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* chat list */}
        <div className="flex-1 overflow-y-auto">
          {chatsLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-sm text-amber-400" />
            </div>
          )}

          {chats.length === 0 && !chatsLoading && <NoConversationsUI />}

          <div className="flex flex-col gap-1">
            {chats.map((chat) => (
              <ChatListItem
                key={chat._id}
                chat={chat}
                isActive={activeChatId === chat._id}
                onClick={() => setSearchParams({ chat: chat._id })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* main chat area */}
      <div className="flex flex-1 flex-col">
        {activeChatId && activeChat ? (
          <>
            <ChatHeader participant={activeChat.participant} chatId={activeChatId} />

            {/* messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messagesLoading && (
                <div className="flex h-full items-center justify-center">
                  <span className="loading loading-spinner loading-md text-amber-400" />
                </div>
              )}

              {messages.length === 0 && !messagesLoading && <NoMessagesUI />}

              {messages.length > 0 &&
                messages.map((msg) => (
                  <MessageBubble key={msg._id} message={msg} currentUser={currentUser} />
                ))}

              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              value={messageInput}
              onChange={handleTyping}
              onSubmit={handleSend}
              disabled={!messageInput.trim()}
            />
          </>
        ) : (
          <NoChatSelectedUI />
        )}
      </div>

      <NewChatModal
        onStartChat={handleStartChat}
        isPending={startChatMutation.isPending}
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
      />
    </div>
  );
}
export default ChatPage;

function NoConversationsUI() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <MessageSquareIcon className="mb-3 h-10 w-10 text-amber-400" />
      <p className="text-base-content/70 text-sm">No conversations yet</p>
      <p className="text-base-content/60 mt-1 text-xs">Start a new chat to begin</p>
    </div>
  );
}

function NoMessagesUI() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="bg-base-300/40 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
        <MessageSquareIcon className="text-base-content/20 h-8 w-8" />
      </div>
      <p className="text-base-content/70">No messages yet</p>
      <p className="text-base-content/60 mt-1 text-sm">Send a message to start the conversation</p>
    </div>
  );
}

function NoChatSelectedUI() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="bg-linear-to-br mb-6 flex h-20 w-20 items-center justify-center rounded-3xl from-amber-500/20 to-orange-500/20">
        <MessageSquareIcon className="h-10 w-10 text-amber-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Welcome to Whisper</h2>
      <p className="text-base-content/70 max-w-sm">
        Select a conversation from the sidebar or start a new chat to begin messaging
      </p>
    </div>
  );
}
