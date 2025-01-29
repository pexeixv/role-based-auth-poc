import { Link } from "react-router-dom";

const CreatorPage = () => (
  <section className="mx-auto container px-5 py-10 flex flex-col items-center">
    <h1 className="text-2xl font-bold text-center">Creator Page</h1>
    <Link
      className="bg-blue-500 text-white p-2 rounded text-center mt-8 px-6"
      to="/dashboard"
    >
      Dashboard
    </Link>
  </section>
);
export default CreatorPage;
