import { useState } from "react";
import { Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../assets/firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../assets/firebase/AuthContext";
import {
  AiFillLock,
  AiFillEyeInvisible,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [userType, setUserType] = useState(["admin", "writer"]);
  const [error, setError] = useState("");
  const { setTimeActive } = useAuthValue();
  const navigate = useNavigate();

  // Password visible
  const checkPassword = () => {
    setVisibility(true);
  };

  // Password hidden
  const hidePassword = () => {
    setVisibility(false);
  };

  // Login user
  const login = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        // Check if the user is admin
        const adminRef = doc(db, "admin", auth.currentUser.uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          const user = adminSnap.data();
          if (user.user_type === userType[0]) {
            localStorage.setItem("upd", JSON.stringify(user));
            navigate(`/${auth.currentUser.uid}/dashboard`);
          }
        } else {
          const writerRef = doc(db, "users", auth.currentUser.uid);
          const writerSnap = await getDoc(writerRef);
          if (writerSnap.exists()) {
            const user = writerSnap.data();
            if (user.user_type === userType[1]) {
              localStorage.setItem("upd", JSON.stringify(user));
              navigate(`/${auth.currentUser.uid}/dashboard`);
            }
          }
        }
      })
      .then(() => {
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true);
              navigate("/verify-email");
            })
            .catch((err) => {
              setLoading(false);
              setEmail("");
              setPassword("");
              setError(err.message);
            });
        } else {
        }
      })
      .catch((err) => {
        setLoading(false);
        setEmail("");
        setPassword("");
        console.log(err);
        if (err.message === "Firebase: Error (auth/network-request-failed).") {
          setError("Network error. Check your internet connection");
        } else {
          setError(err.message);
        }
      });
  };

  return (
    <div className="container mx-auto">
      <div className="min-h-full max-w-7xl flex items-center justify-center py-12 lg:px-8">
        <div className="mx-3 sm:w-full  md:max-w-md w-full space-y-8  mt-16">
          <img
            className="mx-auto h-12 w-auto"
            src="https://avatars.dicebear.com/api/identicon/your-custd.svg"
            alt="Logo"
          />
          {loading ? (
            <div className="shadow-xl p-10 h-96 max-h-screen">
              <h3 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 text-center">
                Authenticating user...
              </h3>

              <div className="flex justify-center items-center h-3/4">
                <FaSpinner className="h-1/4 w-1/4 text-primary animate-spin" />
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral">
                  Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-accent">
                  Or{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    you don't have an account
                  </Link>
                </p>
              </div>
              <div className="auth">
                <form
                  onSubmit={login}
                  className="mt-8 space-y-6"
                  name="login_form"
                >
                  <div className="rounded-md shadow-sm">
                    <div className="mb-9">
                      <div className="relative">
                        <label htmlFor="email-address" className="sr-only">
                          Email address
                        </label>
                        <label className="cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 flex justify-center items-center">
                          <AiOutlineMail className="w-5 h-5 text-neutral" />
                        </label>
                        <input
                          id="email-address"
                          type="email"
                          value={email}
                          autoComplete="email"
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Enter valid email")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          placeholder="Email address"
                          className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md shadow-sm ">
                    <div className="mb-9">
                      <div className="relative">
                        <label htmlFor="password" className="sr-only">
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type={!visibility ? "password" : "text"}
                          value={password}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity("Enter your password")
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                          placeholder="Enter your password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="swap swap-rotate cursor-pointer w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 z-50">
                          <input type="checkbox" aria-label="check password" />
                          <div className="swap-on">
                            <AiFillEyeInvisible
                              className="w-5 h-5 text-neutral hover:text-primary"
                              onClick={checkPassword}
                            />
                          </div>
                          <div className="swap-off">
                            <AiOutlineEye
                              className="w-5 h-5 text-neutral hover:text-primary"
                              onClick={hidePassword}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  {error && (
                    <div className=" text-sm uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                      <p className="mt-2">{error}</p>
                    </div>
                  )}
                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center p-3 border border-transparent text-sm font-medium rounded-full text-base-100 bg-primary hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <AiFillLock
                          className="h-5 w-5 text-base group-hover:opacity-70"
                          aria-hidden="true"
                        />
                      </span>
                      Sign in
                    </button>
                  </div>
                </form>
                <div>
                  <Link
                    to="/"
                    className="group relative w-full flex justify-center p-3 text-sm font-medium rounded-full text-primary bg-base hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <AiOutlineArrowLeft
                        className="h-5 w-5 text-base group-hover:opacity-70"
                        aria-hidden="true"
                      />
                    </span>
                    Back to home page
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
