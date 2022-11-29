import { useAuthValue } from "../../assets/firebase/AuthContext";
import { useState, useEffect } from "react";
import { auth, db } from "../../assets/firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";

function VerifyEmail() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuthValue();
  const [time, setTime] = useState(60);
  const { timeActive, setTimeActive } = useAuthValue();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      currentUser
        ?.reload()
        .then(() => {
          if (currentUser?.emailVerified) {
            clearInterval(interval);
            setLoading(true);
            navigate(`/login`);
            // if (userType === "admin") {
            // } else if (userType === "writer") {
            // } else {
            // }
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    }, 1000);
  }, [navigate, currentUser]);

  useEffect(() => {
    let interval = null;
    if (timeActive && time !== 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setTimeActive(false);
      setTime(60);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeActive, time, setTimeActive]);

  const resendEmailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setTimeActive(true);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="container mx-auto items-center justify-center">
      <div className="min-h-full max-w-7xl flex items-center justify-center py-12 lg:px-8">
        <div className="mx-3 sm:w-full  md:max-w-md w-full space-y-8  mt-16">
        <div className="flex justify-center">
                <ul className="steps">
                  <li className="step step-primary">Register</li>
                  <li className="step step-primary">Verify account</li>
                </ul>
              </div>
          {loading ? (
            <div className="shadow-xl p-10 h-96 max-h-screen">
              <h3 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 text-center">
                Verify your email...
              </h3>
              <div className="flex justify-center items-center h-3/4">
                <FaSpinner className="h-1/4 w-1/4 text-primary animate-spin" />
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className=" text-sm uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                  <p className="mt-2">{error}</p>
                </div>
              )}
              
              <div className="shadow-xl p-10  max-h-screen">

                <h1 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 text-center">
                  Verify your Email Address
                </h1>
                <p>
                  <strong>A Verification email has been sent to:</strong>
                  <br />
                  <span className="text-primary my-12 px-5">
                    {currentUser?.email}
                  </span>
                </p>
                <p className="text-neutral mb-4">
                  Check you inbox or spam for the verification email.
                </p>
                <p className="text-neutral mb-8">
                  Follow the instruction in the email to verify your account
                </p>
                <div>
                  <button
                    onClick={resendEmailVerification}
                    disabled={timeActive}
                    className="group relative w-full flex justify-center p-3 border border-transparent text-sm font-medium rounded-full text-base-100 bg-primary hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <AiOutlineMail
                        className="h-5 w-5 text-base group-hover:opacity-70"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="pr-6">Resend Email</span>
                    <span className="countdown font-mono text-lg">
                      <span style={{ "--value": timeActive && time }}></span>
                    </span>
                    {}
                  </button>
                </div>
                <button></button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
