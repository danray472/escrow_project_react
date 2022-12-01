import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";
import useFetchPayments from "../../components/useFetchPayments";
import { useAuthValue } from "../../assets/firebase/AuthContext";
import { db } from "../../assets/firebase/firebase";
import { useNavigate } from "react-router-dom";


const Payment = () => {
  const { currentUser } = useAuthValue();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [cash, setCash] = useState(null);
  const userType = "admin";
  let user = JSON.parse(localStorage.getItem("upd"));
  const {
    userCash,
    paymentsTotal,
    paymentsList,
    pendingPaymentsTotal,
    pendingPaymentsList,
    completedPaymentsTotal,
    completedPaymentsList,
  } = useFetchPayments();

  // For writers to withdraw funds
  const fileHandler = (e) => {
    e && e.preventDefault();
    if (cash) {
      withdrawCash(cash);
      navigate(`/${currentUser.uid}/dashboard`);
    }
  };
  const withdrawCash = async (funds) => {
    if (!funds) {
      return setError("Kindly put amount to be withdrawn");
    }
    if (userCash < funds) {
      return setError("Insufficient balance");
    }
    const userColRef = collection(db, "users");
    const userRef = doc(userColRef, currentUser.uid);
    setDoc(
      userRef,
      {
        my_cash: userCash - funds,
      },
      { merge: true }
    );
  };
  return (
    <>
      <Navbar />
      <div className="w-full bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="drawer drawer-mobile">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start mt-16 py-6 sm:px-6 lg:px-8">
              <header className="w-full">
                <h2 className="my-6 text-left text-3xl font-extrabold text-neutral">
                  Payments
                </h2>
              </header>
              <main className="w-full">
                {error && (
                  <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                    <label htmlFor="profile-pic-modal" className="mt-2">
                      {error}
                    </label>
                  </div>
                )}
                <div className="mx-auto mb-6">
                  <div className="stats shadow-md w-full max-w-md bg-base-100 text-neutral">
                    <div className="stat">
                      {user.user_type === userType ? (
                        <div className="stat-title font-bold">
                          Escrow Balance
                        </div>
                      ) : (
                        <div className="stat-title font-bold">
                          Account Balance
                        </div>
                      )}

                      <div className="stat-value text-primary">{userCash}</div>
                      <div className="stat-desc mt-4">
                        Total transactions {paymentsTotal}
                      </div>
                      {user.user_type != userType && (
                        <>
                          <label
                            htmlFor="my-modal-9"
                            className="btn btn-primary my-2 btn-sm"
                          >
                            Withdraw cash
                          </label>
                          <input
                            type="checkbox"
                            id="my-modal-9"
                            className="modal-toggle"
                          />
                          <div className="modal">
                            <form className="modal-box" onSubmit={fileHandler}>
                              <div>
                                <label className="block text-md font-semibold text-neutral">
                                  Withdraw cash
                                </label>
                              </div>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                  <input
                                    id="cash"
                                    type="number"
                                    value={cash}
                                    required
                                    onInvalid={(e) =>
                                      e.target.setCustomValidity(
                                        "Fill in your cash amount"
                                      )
                                    }
                                    onInput={(e) =>
                                      e.target.setCustomValidity("")
                                    }
                                    placeholder="Enter amount"
                                    className="input input-bordered input-primary w-full rounded-full"
                                    onChange={(e) => setCash(e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="modal-action flex justify-between uppercase">
                                <label
                                  htmlFor="my-modal-9"
                                  className="btn btn-sm btn-outline btn-error rounded-2xl"
                                >
                                  cancel
                                </label>
                                <button
                                  type="submit"
                                  className="btn btn-sm btn-primary rounded-2xl"
                                >
                                  Withdraw
                                </button>
                              </div>
                              {error && (
                                <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                                  <label
                                    htmlFor="profile-pic-modal"
                                    className="mt-2"
                                  >
                                    {error}
                                  </label>
                                </div>
                              )}
                            </form>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center py-12 lg:px-8">
                    <div className="w-full flex sm:flex-wrap md:flex-nowrap sm:justify-center lg:justify-start mb-6 sm:gap-4 lg:gap-8">
                      <div className="stats shadow-md w-full sm:max-w-xs lg:max-w-sm bg-warning text-base-100">
                        <div className="stat">
                          <div className="stat-title">Pending Payments</div>
                          <div className="stat-value">
                            {pendingPaymentsTotal}
                          </div>
                        </div>
                      </div>
                      <div className="stats shadow-md w-full sm:max-w-xs bg-success text-base-100">
                        <div className="stat">
                          <div className="stat-title">Completed Payments</div>
                          <div className="stat-value">
                            {completedPaymentsTotal}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-3">
                  <div
                    tabIndex={0}
                    className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                  >
                    <div className="collapse-title text-lg font-semibold text-primary">
                      All Payments ({paymentsTotal})
                    </div>
                    <hr />
                    <div className="collapse-content">
                      <ul className="menu bg-base-100 w-full">
                        {paymentsTotal ? (
                          <>
                            {paymentsList.map((pay, _index) => (
                              <li key={_index}>
                                <div className="flex flex-row justify-between h-fit p-2">
                                  <span className="text-sm">
                                    {pay.transaction_name}
                                  </span>
                                  <span className="font-bold">
                                    {pay.amount}
                                  </span>
                                  {pay.status === "pending" ? (
                                    <div className="badge badge-warning gap-2">
                                      pending
                                    </div>
                                  ) : (
                                    <div className="badge badge-success gap-2">
                                      completed
                                    </div>
                                  )}
                                </div>

                                <hr />
                              </li>
                            ))}
                          </>
                        ) : (
                          <>
                            <h1 className="mt-8 font-bold">
                              Seems like you have no transactions
                            </h1>
                            <p className="text-accent">
                              No transactions found!
                            </p>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="my-3">
                  <div
                    tabIndex={0}
                    className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                  >
                    <div className="collapse-title text-lg font-semibold text-primary">
                      Pending Payments ({pendingPaymentsTotal})
                    </div>
                    <hr />
                    <div className="collapse-content">
                      <ul className="menu bg-base-100 w-full">
                        {pendingPaymentsTotal ? (
                          <>
                            {pendingPaymentsList.map((pay, _index) => (
                              <li key={_index}>
                                <div className="flex flex-row justify-between h-fit p-2">
                                  <span className="text-sm">
                                    {pay.transaction_name}
                                  </span>
                                  <span className="font-bold">
                                    {pay.amount}
                                  </span>
                                  <div className="badge badge-warning gap-2">
                                    pending
                                  </div>
                                </div>
                                <hr />
                              </li>
                            ))}
                          </>
                        ) : (
                          <>
                            <h1 className="mt-8 font-bold">
                              Seems like you have no pending transactions
                            </h1>
                            <p className="text-accent">
                              No transactions found!
                            </p>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="my-3">
                  <div
                    tabIndex={0}
                    className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                  >
                    <div className="collapse-title text-lg font-semibold text-primary">
                      Completed Payments ({completedPaymentsTotal})
                    </div>
                    <hr />
                    <div className="collapse-content">
                      <ul className="menu bg-base-100 w-full">
                        {completedPaymentsTotal ? (
                          <>
                            {completedPaymentsList.map((pay, _index) => (
                              <li key={_index}>
                                <div className="flex flex-row justify-between h-fit p-2">
                                  <span className="text-sm">
                                    {pay.transaction_name}
                                  </span>
                                  <span className="font-bold">
                                    {pay.amount}
                                  </span>
                                  <div className="badge badge-success gap-2">
                                    completed
                                  </div>
                                </div>

                                <hr />
                              </li>
                            ))}
                          </>
                        ) : (
                          <>
                            <h1 className="mt-8 font-bold">
                              Seems like you have no completed transactions
                            </h1>
                            <p className="text-accent">
                              No transactions found!
                            </p>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </main>
            </div>
            <SideMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
