import { Link } from "react-router-dom";
import { auth } from "../assets/firebase/firebase";
import { signOut } from "firebase/auth";
import { useAuthValue } from "../assets/firebase/AuthContext";

const SideMenu = () => {
  const { currentUser } = useAuthValue();
  let user = JSON.parse(localStorage.getItem("upd"));
  return (
    <>
      <div className="drawer-side mt-16">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto sm:w-1/2 md:w-80 bg-base-100 sticky">
          <li>
            <Link to={`/${currentUser.uid}/dashboard`}>Dashboard</Link>
          </li>
          <li>
            <Link to={`/${currentUser.uid}/tasks`}>Tasks</Link>
          </li>

          {user.user_type === "admin" && (
            <>
              <li>
                <Link to={`/${currentUser.uid}/writers`}>Writers</Link>
              </li>
              <li>
                <Link to={`/${currentUser.uid}/reports`}>Reports</Link>
              </li>
            </>
          )}
          <li>
            <Link to={`/${currentUser.uid}/payments`}>Payments</Link>
          </li>
          <li>
            <Link to={`/${currentUser.uid}/profile`}>My Profile</Link>
          </li>
          <li className="bg-error rounded-md text-base-100">
            <span
              onClick={() => {
                localStorage.removeItem("upd");
                signOut(auth);
              }}
            >
              Sign Out
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SideMenu;
