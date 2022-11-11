import { db } from "../assets/firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";

const useFetchAdmin = () => {
  const [adminTotal, setAdminTotal] = useState(null);
  const [adminList, setAdminList] = useState(null);
  const admin = [];
  useEffect(() => {
    fetchBlogs();
  }, []);
  const fetchBlogs = async () => {
    const adminRef = collection(db, "admin");
    const querySnapshot = await getDocs(adminRef);
    querySnapshot.forEach((ok) => {
      if (!admin.includes(ok.data())) {
        admin.push(ok.data());
      }
    });
    setAdminList(admin);
    setAdminTotal(admin.length);
  };

  return { adminTotal, adminList };
};

export default useFetchAdmin;
