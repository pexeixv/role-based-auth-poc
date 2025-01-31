import { HouseIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <section className="mx-auto container px-5 py-10 flex flex-col items-center">
    <h1 className="text-red-500 text-2xl font-bold text-center">
      Unauthorized Access
    </h1>
    <Link
      className="bg-slate-700 text-white p-2 rounded text-center mt-8 px-6"
      to="/dashboard"
    >
      <HouseIcon />
    </Link>
  </section>
);
export default Unauthorized;
