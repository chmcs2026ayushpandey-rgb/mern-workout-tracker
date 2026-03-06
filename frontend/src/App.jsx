import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />

          <div className="max-w-5xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/workout/:id" element={<WorkoutDetailPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;