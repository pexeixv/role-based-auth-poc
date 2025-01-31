import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const arrayIncludes = (array1: string[], array2: string[]) => {
  const set = new Set(array1);
  for (const value of array2) if (set.has(value)) return true;
  return false;
};

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { token, roles } = useSelector((state: RootState) => state.auth);
  const flatRoles = roles?.map((r) => r.role_name) as string[];

  if (token && !roles) {
    return <div className="text-center mt-10 text-xl">Fetching role...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!roles || !arrayIncludes(allowedRoles, flatRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
