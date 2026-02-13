import { SearchIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useSocketStore } from "../lib/socket";

export function NewChatModal({ onStartChat, isPending, isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { onlineUsers } = useSocketStore();
  const { data: allUsers = [] } = useUsers();
  const isOnline = (id) => onlineUsers.has(id);

  const handleStartChat = (participantId) => {
    onStartChat(participantId);
    setSearchQuery("");
    onClose();
  };

  const searchResults = allUsers.filter((u) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
  });

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <UsersIcon className="text-primary size-5" />
          New Chat
        </h3>
        <div className="relative mb-4">
          <SearchIcon className="text-base-content/60 pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="input input-bordered w-full pl-10"
            autoFocus
          />
        </div>
        <div className="max-h-72 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="text-base-content/60 py-8 text-center text-sm">
              {searchQuery ? "No users found" : "Start typing to search"}
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleStartChat(u._id)}
                  disabled={isPending}
                  className="btn btn-ghost w-full justify-start gap-3 normal-case"
                >
                  <div className="relative">
                    <img src={u.avatar} className="h-10 w-10 rounded-full" />
                    {isOnline(u._id) && (
                      <span className="bg-success border-base-200 absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-base-content/70 text-xs">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn"
              onClick={() => {
                setSearchQuery("");
                onClose();
              }}
            >
              Close
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
