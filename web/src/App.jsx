import { useAuth } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import PageLoader from "./components/PageLoader";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import useUserSync from "./hooks/useUserSync";

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  useUserSync();

  if (!isLoaded) {
    return <PageLoader />;
  }
  return (
    <Routes>
      <Route path="/" element={isSignedIn ? <Navigate to="/chat" /> : <HomePage />} />
      <Route path="/chat" element={isSignedIn ? <ChatPage /> : <Navigate to={"/"} />} />
    </Routes>
  );
}

export default App;
