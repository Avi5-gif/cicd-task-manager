import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskFormPage from "./pages/TaskFormPage";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function AppShell() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <div style={styles.app}>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AppShell />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f9fafb",
    color: "#111827",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
};
