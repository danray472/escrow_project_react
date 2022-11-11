import { useAuthValue } from "../../assets/firebase/AuthContext";
import FileUpload from "../../components/FileUpload";
import ListFiles from "../../components/ListFiles";
import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";
import { auth, db } from "../../assets/firebase/firebase";
import { doc, collection, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { signOut, updateEmail } from "firebase/auth";
import { FaSpinner } from "react-icons/fa";

function Profile() {
  const { currentUser } = useAuthValue();
  const [fName, setFName] = useState("");
  const [sName, setSName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const userRole = ["admin", "writer"];
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (currentUser) {
      let user = JSON.parse(localStorage.getItem("upd"));
      setEmail(user.email);
      setFName(user.first_name);
      setPhone(user.phone_number);
      setSName(user.second_name);
      setUserType(user.user_type);
    } else {
      // doc.data() will be undefined in this case
      setError("No user found!");
    }
  }, [currentUser]);

  const update = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    updateEmail(auth.currentUser, email)
      .then(async () => {
        let userCollection = null;
        if (userType === userRole[0]) {
          userCollection = "admin";
        } else {
          userCollection = "users";
        }
        const colRef = collection(db, userCollection);
        const userRef = doc(colRef, auth.currentUser.uid);
        await setDoc(userRef, {
          user_type: userType,
          email: email,
          first_name: fName,
          second_name: sName,
          phone_number: phone,
        });
      })
      .then(() => {
        setLoading(true);
        signOut(auth);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <>
      {loading ? (
        <div className="flex w-full justify-center items-center">
          <div className="sm:w-full  md:max-w-md ">
            <div className="shadow-xl p-10 h-96 m max-h-screen">
              <h3 className="mt-9 lg:text-2xl sm:text-xl text-primary pb-6 text-center">
                Updating details...
              </h3>
              <p className="mt-1 text-sm text-accent italic text-center max-w-fit">
                (You will be logged out due to the sensitivity of the details
                changed)
              </p>
              <div className="flex justify-center items-center h-3/4">
                <FaSpinner className="h-1/4 w-1/4 text-primary animate-spin" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <div className="w-full bg-secondary">
            <div className="max-w-7xl mx-auto">
              <div className="drawer drawer-mobile">
                <input
                  id="my-drawer-2"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col items-start justify-start mt-16">
                  <div className="p-4">
                    <div>
                      <div className="shadow-lg overflow-hidden sm:rounded-lg pb-4 mb-8 bg-base-100">
                        <div className="px-4 py-5 bg-base-100 space-y-6 sm:p-6">
                          <div className="flex flex-wrap">
                            <h3 className="sm:text-md md:text-lg font-bold leading-6 text-primary mr-5">
                              Personal Information
                            </h3>
                            <p className="mt-1 text-sm text-accent italic">
                              (Use a correct details such as phone numbers and
                              email where you can receive official communication
                              during checkout)
                            </p>
                          </div>
                          <div className="py-3">
                            <div className="border-t border-secondary" />
                          </div>
                          <div className="grid grid-cols-6 gap-8">
                            <div className="col-span-6 md:col-span-3 relative">
                              <label htmlFor="first_name" className="sr-only">
                                First name
                              </label>
                              <input
                                type="text"
                                id="first_name"
                                name="firstName"
                                value={fName}
                                disabled
                                placeholder="First name"
                                onChange={(e) => setFName(e.target.value)}
                                className="input input-bordered input-neutral w-full rounded-full focus:input-primary capitalize"
                              />
                            </div>

                            <div className="col-span-6 md:col-span-3 relative">
                              <label htmlFor="second_name" className="sr-only">
                                Second name
                              </label>
                              <input
                                type="text"
                                id="second_name"
                                name="lastName"
                                value={sName}
                                disabled
                                placeholder="Last name"
                                onChange={(e) => setSName(e.target.value)}
                                className="input input-bordered input-neutral w-full rounded-full focus:input-primary capitalize"
                              />
                            </div>

                            <div className="col-span-6 md:col-span-3 relative">
                              <label
                                htmlFor="email-address"
                                className="sr-only"
                              >
                                Email address
                              </label>
                              <input
                                type="text"
                                id="email-address"
                                name="email"
                                placeholder="Email address"
                                value={email}
                                disabled
                                onChange={(e) => setEmail(e.target.value)}
                                className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                              />
                            </div>
                            <div className="col-span-6 md:col-span-3 relative">
                              <label htmlFor="phone" className="sr-only">
                                Phone number
                              </label>
                              <input
                                type="text"
                                id="phone"
                                name="contact"
                                value={phone}
                                disabled
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone number"
                                className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex w-full justify-center">
                          <label
                            htmlFor="profile-details-modal"
                            className="mt-5 btn btn-outline btn-sm btn-primary rounded-2xl"
                          >
                            Change
                          </label>
                        </div>

                        <>
                          <input
                            type="checkbox"
                            id="profile-details-modal"
                            className="modal-toggle"
                          />
                          <div className="modal">
                            <form onSubmit={update} className="modal-box">
                              <div className="flex flex-wrap mb-5">
                                <h3 className="sm:text-md md:text-lg font-bold leading-6 text-primary mr-5 capitalize">
                                  Change personal details
                                </h3>
                                <p className="mt-1 text-sm italic text-error animate-pulse">
                                  (You will be logged out due to the sensitivity
                                  of the details changed)
                                </p>
                              </div>

                              <div className="details">
                                <div className="grid grid-cols-6 gap-8">
                                  <div className="col-span-6 relative">
                                    <label
                                      htmlFor="email-address"
                                      className="sr-only"
                                    >
                                      Email address
                                    </label>
                                    <input
                                      type="text"
                                      id="email-address"
                                      name="email"
                                      autoComplete="given-name"
                                      placeholder="Email address"
                                      value={email}
                                      disabled
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                                    />
                                  </div>
                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label
                                      htmlFor="first_name"
                                      className="sr-only"
                                    >
                                      First name
                                    </label>
                                    <input
                                      type="text"
                                      id="first_name"
                                      name="firstName"
                                      autoComplete="given-name"
                                      value={fName}
                                      placeholder="First name"
                                      onChange={(e) => setFName(e.target.value)}
                                      className="input input-bordered input-neutral w-full rounded-full focus:input-primary capitalize"
                                    />
                                  </div>

                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label
                                      htmlFor="second_name"
                                      className="sr-only"
                                    >
                                      Second name
                                    </label>
                                    <input
                                      type="text"
                                      id="second_name"
                                      name="lastName"
                                      autoComplete="given-name"
                                      value={sName}
                                      placeholder="Second name"
                                      onChange={(e) => setSName(e.target.value)}
                                      className="input input-bordered input-neutral w-full rounded-full focus:input-primary capitalize"
                                    />
                                  </div>

                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label htmlFor="phone" className="sr-only">
                                      User type
                                    </label>
                                    <input
                                      type="text"
                                      id="user-type"
                                      name="user-type"
                                      value={userType}
                                      onChange={(e) =>
                                        setUserType(e.target.value)
                                      }
                                      disabled
                                      placeholder="User type"
                                      className="input input-bordered input-neutral w-full rounded-full focus:input-primary capitalize"
                                    />
                                  </div>
                                  <div className="col-span-6 md:col-span-3 relative">
                                    <label htmlFor="phone" className="sr-only">
                                      Phone number
                                    </label>
                                    <input
                                      type="text"
                                      id="phone"
                                      name="contact"
                                      value={phone}
                                      onChange={(e) => setPhone(e.target.value)}
                                      placeholder="Phone number"
                                      className="input input-bordered input-neutral w-full rounded-full focus:input-primary"
                                    />
                                  </div>
                                  {error && (
                                    <div className="text-sm col-span-6 uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                                      <p className="mt-2">{error}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="modal-action flex justify-between uppercase">
                                <label
                                  htmlFor="profile-details-modal"
                                  className="btn btn-sm btn-outline btn-error rounded-2xl"
                                >
                                  cancel
                                </label>
                                <label htmlFor="profile-details-modal">
                                  <button
                                    type="submit"
                                    className="btn btn-sm btn-success text-base-100 flex rounded-2xl"
                                  >
                                    update details
                                  </button>
                                </label>
                              </div>
                            </form>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                  
                </div>
                <SideMenu />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
