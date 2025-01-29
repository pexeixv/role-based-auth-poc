import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  return (
    <section className="mx-auto container px-5 py-10">
      <h1 className="text-2xl font-bold text-center">
        Welcome, {role?.toUpperCase()}! <br /> What do you want to{" "}
        {role === "creator"
          ? "create"
          : role === "publisher"
          ? "publish"
          : role === "reviewer"
          ? "review"
          : ""}{" "}
        today?
      </h1>
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <Link
          className="w-full bg-slate-700 text-white p-2 rounded text-center"
          to="/creator"
        >
          Creating
        </Link>
        <Link
          className="w-full bg-slate-700 text-white p-2 rounded text-center"
          to="/publisher"
        >
          Publishing
        </Link>
        <Link
          className="w-full bg-slate-700 text-white p-2 rounded text-center"
          to="/reviewer"
        >
          Reviewing
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
