import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              This system addresses the problem of account holders in online
              writing getting scammed by fraudsters. The objective of this
              project is to develop an effective, reliable, system where both
              the account holder and writer can work in a trustworthy
              environment.
            </p>
            <Link to={"/login"} className="btn btn-sm btn-primary">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
