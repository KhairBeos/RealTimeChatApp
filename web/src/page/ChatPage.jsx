import { useAuth } from "@clerk/clerk-react";

function ChatPage() {
  const {signOut} = useAuth();
  return (
    <div>
      ChatPage
      <button onClick={() => signOut()}>Sign out</button>
      </div>
  )
}

export default ChatPage