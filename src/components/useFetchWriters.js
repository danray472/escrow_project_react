import { db } from "../assets/firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";

const useFetchWriters = ({ database }) => {
  const [writersTotal, setWritersTotal] = useState(null);
  const [writersList, setWritersList] = useState(null);
  const writers = [];
  useEffect(() => {
    fetchBlogs();
  }, []);
  const fetchBlogs = async () => {
    const writerRef = collection(db, "users");
    const querySnapshot = await getDocs(writerRef);
    querySnapshot.forEach((ok) => {
      if (!writers.includes(ok.data())) {
        writers.push(ok.data());
      }
    });
    setWritersList(writers);
    setWritersTotal(writers.length);
  };

  return { writersTotal, writersList };
};

export default useFetchWriters;
