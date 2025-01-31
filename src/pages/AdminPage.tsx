import { HouseIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";

const AdminPage = () => {
  const { roles } = useSelector((state: RootState) => state.auth);
  const thisRole = roles?.filter((r) => r.role_name === "CREATOR")[0];

  return (
    <section className="mx-auto container px-5 py-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center">Creator Page</h1>
      <div className="w-fit mx-auto mt-4">
        <h2 className="font-bold">You have access to</h2>
        <ul className="list-decimal pl-4">
          {thisRole?.permissions.map((p, i) => (
            <li key={i}>
              <h3>{p.resource}</h3>
              <ul className="list-disc pl-4">
                {p.action.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <Link
        className="bg-slate-700 text-white p-2 rounded text-center mt-8 px-6"
        to="/dashboard"
      >
        <HouseIcon />
      </Link>
    </section>
  );
};

export default AdminPage;
