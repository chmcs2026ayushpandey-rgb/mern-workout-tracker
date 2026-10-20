import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import GoalsPage from "./pages/GoalsPage";
import BodyPage from "./pages/BodyPage";
import AuthPage from "./pages/AuthPage";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div style={{ minHeight: "100vh", background: "#0a0a14" }}>
            <Navbar />

            <Routes>
              <Route
                path="/login"
                element={<AuthPage mode="login" />}
              />

              <Route
                path="/register"
                element={<AuthPage mode="register" />}
              />

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

              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <GoalsPage />
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

              {/* Exercise Library */}
              <Route
                path="/exercises"
                element={
                  <ProtectedRoute>
                    <ExerciseLibraryPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;