import { formatTime } from "../lib/utils";

export function MessageBubble({ message, currentUser }) {
  const isMe = message.sender?._id === currentUser?._id;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-2.5 ${
          isMe
            ? "bg-linear-to-r text-primary-content from-amber-500 to-orange-500"
            : "bg-base-300/40 text-base-content"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className={`mt-1 text-xs ${isMe ? "text-primary-content/80" : "text-base-content/70"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
