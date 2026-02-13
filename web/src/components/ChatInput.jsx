import { SendIcon } from "lucide-react";

export function ChatInput({ value, onChange, onSubmit, disabled }) {
  return (
    <form onSubmit={onSubmit} className="border-base-300 border-t p-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type a message..."
          className="input input-bordered bg-base-300/40 border-base-300 placeholder:text-base-content/60 flex-1 rounded-xl"
        />
        <button
          type="submit"
          disabled={disabled}
          className="btn disabled:btn-disabled rounded-xl border-none bg-gradient-to-r from-amber-500 to-orange-500"
        >
          <SendIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}
