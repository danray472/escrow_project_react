import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../assets/firebase/AuthContext";
import AdminDashboard from "../../components/AdminDashboard";
import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";
import WriterDashboard from "../../components/WriterDashboard";

const Dashboard = () => {
  const { currentUser } = useAuthValue();
  const userRole = ["admin", "writer"];
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("upd"));
  if (user != null) {
    return (
      <>
        <Navbar />
        <div className="w-full bg-secondary">
          <div className="max-w-7xl mx-auto ">
            <div className="drawer drawer-mobile">
              <input
                id="my-drawer-2"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content flex flex-col items-start justify-start mt-16  py-6 sm:px-6 lg:px-8">
                <header className="w-full">
                  <h2 className="my-6 text-left text-3xl font-extrabold text-neutral">
                    Welcome {user.first_name}
                  </h2>
                </header>
                <main className="w-full">
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-accent border-dashed rounded-md">
                    {user.user_type === userRole[0] ? (
                      <AdminDashboard currentUser={currentUser} />
                    ) : (
                      <WriterDashboard currentUser={currentUser} />
                    )}
                  </div>
                </main>
              </div>
              <SideMenu />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    navigate("/");
  }
};

export default Dashboard;
