import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-5xl mx-auto p-6">
              <Routes>
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/register" element={<AuthPage mode="register" />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreatePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workout/:id"
                  element={
                    <ProtectedRoute>
                      <WorkoutDetailPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;