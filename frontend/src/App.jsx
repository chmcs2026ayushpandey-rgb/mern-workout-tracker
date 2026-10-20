
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import BodyPage from "./pages/BodyPage";
import GoalsPage from "./pages/GoalsPage";
import CreatePage from "./pages/CreatePage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import RemindersPage from "./pages/RemindersPage";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
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
        path="/exercises"
        element={
          <ProtectedRoute>
            <ExerciseLibraryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/body"
        element={
          <ProtectedRoute>
            <BodyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalsPage />
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
        path="/workouts/:id"
        element={
          <ProtectedRoute>
            <WorkoutDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <RemindersPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
