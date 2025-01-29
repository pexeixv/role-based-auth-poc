import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="p-4 bg-slate-700 text-white flex justify-between items-center">
      <Link to="/dashboard">
        <h1 className="text-lg font-bold">roleBasedAuthPoc</h1>
      </Link>

      {!!token && (
        <div className="flex items-center gap-4">
          <span className="bg-slate-800 px-3 py-1 rounded text-sm">
            {role?.toUpperCase() ?? "Fetching role..."}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
