import { useAuthValue } from "../../assets/firebase/AuthContext";
import { useState } from "react";
import { auth, db } from "../../assets/firebase/firebase";
import {
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";

const OtherDetails = () => {
  const { currentUser } = useAuthValue();
  const [error, setError] = useState("");
  const [fName, setFName] = useState("");
  const [sName, setSName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const completeRegister = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const userRef = collection(db, "users");
    const writerRef = doc(userRef, auth.currentUser.uid);
    if (auth.currentUser.uid === currentUser.uid) {
      setDoc(
        writerRef,
        { first_name: fName, second_name: sName, phone_number: phone },
        { merge: true }
      )
        .then(() => {
          setLoading(false);
          navigate(`/${currentUser.uid}/profile`);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    } else {
      setLoading(false);
      setError("Unable to update");
    }
  };
  return (
    <div className="w-full mx-auto items-center justify-center bg-secondary">
      <div className="min-h-full max-w-7xl flex items-center justify-center py-12 lg:px-8">
        <div className="mx-3 sm:w-full  md:max-w-md w-full space-y-8  mt-16">
          {loading ? (
            <div className="shadow-xl p-10 h-96 max-h-screen">
              <h3 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 text-center">
                Completing registration process...
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
              <div className="shadow-xl w-full max-w-xl overflow-hidden sm:rounded-lg pb-4 mb-8 bg-base-100">
                <div className="px-4 py-5 bg-base-100 space-y-6 sm:p-6">
                  <div className="flex flex-wrap">
                    <h3 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 mr-5">
                      Complete registration
                    </h3>
                    <p className="mt-1 text-sm text-accent italic">
                      (Use a correct details such as phone numbers and email
                      where you can receive official communication during
                      checkout)
                    </p>
                  </div>
                  <div className="py-3">
                    <div className="border-t border-secondary" />
                  </div>
                  <form
                    onSubmit={completeRegister}
                    className="grid grid-cols-6 gap-8"
                  >
                    <div className="col-span-6 md:col-span-3 relative">
                      <label htmlFor="first_name" className="sr-only">
                        First name
                      </label>
                      <input
                        id="email-address"
                        type="text"
                        value={fName}
                        autoComplete="email"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Fill in your name")
                        }
                        onInput={(e) => e.target.setCustomValidity("")}
                        placeholder="First name"
                        className="input input-bordered input-neutral w-full rounded-full focus:input-primary capitalize"
                        onChange={(e) => setFName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3 relative">
                      <label htmlFor="second_name" className="sr-only">
                        Second name
                      </label>
                      <input
                        id="email-address"
                        type="text"
                        value={sName}
                        autoComplete="email"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity("Fill in your name")
                        }
                        onInput={(e) => e.target.setCustomValidity("")}
                        placeholder="Second name"
                        className="input input-bordered input-neutral w-full rounded-full focus:input-primary capitalize"
                        onChange={(e) => setSName(e.target.value)}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3 relative">
                      <label htmlFor="email-address" className="sr-only">
                        Email address
                      </label>
                      <input
                        type="text"
                        id="email-address"
                        name="email"
                        autoComplete="given-name"
                        placeholder="Email address"
                        defaultValue={currentUser?.email}
                        disabled
                        className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3 relative">
                      <label htmlFor="phone" className="sr-only">
                        Phone number
                      </label>
                      <input
                        id="email-address"
                        type="tel"
                        value={phone}
                        autoComplete="email"
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity(
                            "Fill in your phone number"
                          )
                        }
                        onInput={(e) => e.target.setCustomValidity("")}
                        placeholder="Phone number"
                        className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="col-span-6">
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
                        Sign up
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtherDetails;
