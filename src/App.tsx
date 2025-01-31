import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { useEffect } from "react";
import { getRole } from "./features/auth/authSlice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatorPage from "./pages/CreatorPage";
import ReviewerPage from "./pages/ReviewerPage";
import PublisherPage from "./pages/PublisherPage";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, roles } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !roles) {
      dispatch(getRole(token));
    }
  }, [token, roles, dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["CREATOR", "REVIEWER", "PUBLISHER"]}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["CREATOR"]} />}>
          <Route path="/creator" element={<CreatorPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["REVIEWER"]} />}>
          <Route path="/reviewer" element={<ReviewerPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["PUBLISHER"]} />}>
          <Route path="/publisher" element={<PublisherPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
