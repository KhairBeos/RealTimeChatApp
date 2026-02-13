import { useSocketStore } from "../lib/socket";

export function ChatHeader({ participant, chatId }) {
  const { onlineUsers, typingUsers } = useSocketStore();
  const isOnline = onlineUsers.has(participant?._id);
  // const isTyping = !!typingUsers.get(chatId);
  const typingUserId = typingUsers.get(chatId);
  const isTyping = typingUserId && typingUserId === participant?._id;

  return (
    <div className="border-base-300 bg-base-200/80 flex h-16 items-center gap-4 border-b px-6">
      <div className="relative">
        <img src={participant?.avatar} className="bg-base-300/40 h-10 w-10 rounded-full" alt="" />
        {isOnline && (
          <span className="bg-success border-base-200 absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2" />
        )}
      </div>
      <div>
        <h2 className="font-semibold">{participant?.name}</h2>
        <p className="text-base-content/70 text-xs">
          {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}
