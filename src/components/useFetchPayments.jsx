import { db } from "../assets/firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuthValue } from "../assets/firebase/AuthContext";

const useFetchPayments = () => {
  const { currentUser } = useAuthValue();
  const [paymentsTotal, setPaymentsTotal] = useState(null);
  const [paymentsList, setPaymentsList] = useState(null);
  const [pendingPaymentsTotal, setPendingPaymentsTotal] = useState(null);
  const [pendingPaymentsList, setPendingPaymentsList] = useState(null);
  const [completedPaymentsTotal, setCompletedPaymentsTotal] = useState(null);
  const [completedPaymentsList, setCompletedPaymentsList] = useState(null);
  const [userCash, setUserCash] = useState(null);
  let cash = null;
  const payments = [];
  const pending_payments = [];
  const completed_payments = [];
  useEffect(() => {
    fetchBlogs();
  }, []);
  const fetchBlogs = async () => {
    const paymentsRef = collection(db, "payment");
    const adminRef = collection(db, "admin");
    const userRef = collection(db, "users");
    // Categorize payments for individual writers
    if (currentUser) {
      let user = JSON.parse(localStorage.getItem("upd"));
      if (user.user_type === "writer") {
        const q = query(
          paymentsRef,
          where("assigned_to", "==", currentUser.email)
        );
        const w = query(userRef, where("email", "==", currentUser.email));
        const queryCash = await getDocs(w);
        queryCash.forEach((ok) => {
          if (ok) {
            cash = ok.data().my_cash;
            
          }
        });
        const queryUser = await getDocs(q);
        queryUser.forEach((ok) => {
          if (!payments.includes(ok.data())) {
            payments.push(ok.data());
            // Categorize payments
            if (ok.data().status === "pending") {
              pending_payments.push(ok.data());
            } else if (ok.data().status === "completed") {
              completed_payments.push(ok.data());
            }
          }
        });
      } else {
        const querySnapshot = await getDocs(paymentsRef);
        const w = query(adminRef, where("email", "==", currentUser.email));
        const queryCash = await getDocs(w);
        queryCash.forEach((ok) => {
          if (ok) {
            cash = ok.data().my_cash;
          }
        });
        querySnapshot.forEach((ok) => {
          if (!payments.includes(ok.data())) {
            payments.push(ok.data());
            // Categorize payments
            if (ok.data().status === "pending") {
              pending_payments.push(ok.data());
            } else if (ok.data().status === "completed") {
              completed_payments.push(ok.data());
            }
          }
        });
      }
      // Total payments
      setPaymentsList(payments);
      setPaymentsTotal(payments.length);
      setUserCash(parseInt(cash))

      // Pending payments
      setPendingPaymentsList(pending_payments);
      setPendingPaymentsTotal(pending_payments.length);

      // Completed payments
      setCompletedPaymentsList(completed_payments);
      setCompletedPaymentsTotal(completed_payments.length);
    }
  };

  return {
    userCash,
    paymentsTotal,
    paymentsList,
    pendingPaymentsTotal,
    pendingPaymentsList,
    completedPaymentsTotal,
    completedPaymentsList,
  };
};

export default useFetchPayments;
