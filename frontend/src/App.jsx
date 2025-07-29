import "./App.css";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import {
  HomePage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  SignUpPage,
} from "./pages/IndexPages";
import { useAuthStore } from "./store/useAuthStor";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Toaster />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={`/login`} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={`/`} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={`/`} />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
