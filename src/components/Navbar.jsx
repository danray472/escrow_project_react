import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../assets/firebase/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  // User state
  const [currentUser, setCurrentUser] = useState(null);

  // Check if the user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
  return (
    <div className="navbar bg-base-100 shadow-lg fixed z-50">
      <div className="navbar-start">
        <div className="dropdown">
          {!currentUser?.emailVerified ? (
            <>
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 capitalize"
              >
                <li>
                  <Link to={"/about"}>About</Link>
                </li>
                <li>
                  <Link to={"/contact"}>Contact</Link>
                </li>
              </ul>
            </>
          ) : (
            <>
              <label htmlFor="my-drawer-2" className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
            </>
          )}
        </div>
        <Link to={"/"} className="btn btn-ghost normal-case text-xl">
          <span className="pr-2">Escrow </span>{" "}
          <span className="text-primary">Writers</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/contact"}>Contact</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {!currentUser?.emailVerified ? (
          <>
            <Link to={"/login"} className="btn btn-sm btn-primary">
              Get started
            </Link>
          </>
        ) : (
          <>
            <span
              className="btn btn-sm btn-error"
              onClick={() => {
                localStorage.removeItem("upd");
                signOut(auth);
              }}
            >
              Sign Out
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
