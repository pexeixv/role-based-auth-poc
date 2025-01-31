import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <section className="mx-auto container px-5 py-10">
      <h1 className="text-2xl font-bold text-center">Welcome User!</h1>
      <div className="w-fit mx-auto mt-4">
        <h2 className="font-bold">You have following roles:</h2>
        <ul className="list-disc pl-4">
          {roles?.map((r) => (
            <li>{r.role_name}</li>
          ))}
        </ul>
      </div>
      <div className="grid sm:grid-cols-4 gap-4 mt-8">
        <Link
          className="w-full bg-slate-700 text-white p-2 rounded text-center"
          to="/creator"
        >
          Creator Page
        </Link>
        <Link
          className="w-full bg-slate-700 text-white p-2 rounded text-center"
          to="/publisher"
        >
          Publisher Page
        </Link>
        <Link
          className="w-full bg-slate-700 text-white p-2 rounded text-center"
          to="/reviewer"
        >
          Reviewer Page
        </Link>
        <Link
          className="w-full bg-slate-700 text-white p-2 rounded text-center"
          to="/admin"
        >
          Admin Page
        </Link>
      </div>
    </section>
  );
};

export default Dashboard;
