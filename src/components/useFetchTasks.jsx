import { db } from "../assets/firebase/firebase";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuthValue } from "../assets/firebase/AuthContext";

const useFetchTasks = () => {
  const { currentUser } = useAuthValue();
  const [tasksTotal, setTasksTotal] = useState(null);
  const [tasksList, setTasksList] = useState(null);
  const [newTasksTotal, setNewTasksTotal] = useState(null);
  const [newTasksList, setNewTasksList] = useState(null);
  const [completedTasksTotal, setCompletedTasksTotal] = useState(null);
  const [completedTasksList, setCompletedTasksList] = useState(null);
  const [verifiedTasksTotal, setVerifiedTasksTotal] = useState(null);
  const [verifiedTasksList, setVerifiedTasksList] = useState(null);
  const tasks = [];
  const new_tasks = [];
  const completed_tasks = [];
  const verified_tasks = [];
  useEffect(() => {
    fetchBlogs();
  }, []);
  const fetchBlogs = async () => {
    const tasksRef = collection(db, "tasks");
    // Categorize tasks for individual writers
    if (currentUser) {
      let user = JSON.parse(localStorage.getItem("upd"));
      if (user.user_type === "writer") {
        const q = query(
          tasksRef,
          where("assigned_to", "==", currentUser.email)
        );
        const queryUser = await getDocs(q);
        queryUser.forEach((ok) => {
          if (!tasks.includes(ok.data())) {
            tasks.push(ok.data());

            // Categorize tasks
            if (ok.data().verification_status === "new") {
              new_tasks.push(ok.data());
            } else if (ok.data().verification_status === "completed") {
              completed_tasks.push(ok.data());
            } else if (ok.data().verification_status === "verified") {
              verified_tasks.push(ok.data());
            }
          }
        });
      } else {
        const querySnapshot = await getDocs(tasksRef);
        querySnapshot.forEach((ok) => {
          if (!tasks.includes(ok.data())) {
            tasks.push(ok.data());

            // Categorize tasks
            if (ok.data().verification_status === "new") {
              new_tasks.push(ok.data());
            } else if (ok.data().verification_status === "completed") {
              completed_tasks.push(ok.data());
            } else if (ok.data().verification_status === "verified") {
              verified_tasks.push(ok.data());
            }
          }
        });
      }
      // Total tasks
      setTasksList(tasks);
      setTasksTotal(tasks.length);

      // New tasks
      setNewTasksList(new_tasks);
      setNewTasksTotal(new_tasks.length);

      // Completed tasks
      setCompletedTasksList(completed_tasks);
      setCompletedTasksTotal(completed_tasks.length);

      // Verified tasks
      setVerifiedTasksList(verified_tasks);
      setVerifiedTasksTotal(verified_tasks.length);
    }
  };

  return {
    tasksTotal,
    tasksList,
    newTasksTotal,
    newTasksList,
    completedTasksTotal,
    completedTasksList,
    verifiedTasksTotal,
    verifiedTasksList,
  };
};

export default useFetchTasks;
