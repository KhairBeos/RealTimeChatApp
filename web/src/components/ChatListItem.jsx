import { useSocketStore } from "../lib/socket";
import { formatTime } from "../lib/utils";

export function ChatListItem({ chat, isActive, onClick }) {
  const { onlineUsers, typingUsers } = useSocketStore();
  const isOnline = onlineUsers.has(chat.participant?._id);
  const isTyping = (typingUsers.get(chat._id)?.size || 0) > 0;

  return (
    <button
      onClick={onClick}
      className={`btn btn-ghost w-full justify-start gap-3 rounded-xl px-4 py-8 normal-case ${
        isActive ? "bg-white/10" : ""
      }`}
    >
      <div className="relative">
        <img
          src={chat.participant?.avatar}
          alt={chat.participant?.name || "Chat participant profile picture"}
          className="bg-base-300/40 h-11 w-11 rounded-full"
        />
        {isOnline && (
          <span className="bg-success border-base-200 absolute bottom-0 right-0 h-3 w-3 rounded-full border-2" />
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">
            {chat.participant?.name || "Unknown"}
          </span>
          {chat.lastMessageAt && (
            <span className="text-base-content/60 text-xs">{formatTime(chat.lastMessageAt)}</span>
          )}
        </div>
        <p className="text-base-content/70 mt-0.5 truncate text-xs">
          {isTyping ? "typing..." : chat.lastMessage?.text || "No messages yet"}
        </p>
      </div>
    </button>
  );
}
