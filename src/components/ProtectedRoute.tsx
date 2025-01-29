import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { token, role, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (token && !role) {
    return <div className="text-center mt-10 text-xl">Fetching role...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
