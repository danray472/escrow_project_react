import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { FaFileUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthValue } from "../assets/firebase/AuthContext";
import { db, store } from "../assets/firebase/firebase";
import { filesize } from "filesize";
import useFetchWriters from "./useFetchWriters";
import useFetchPayments from "./useFetchPayments";

const FileUpload = () => {
  const { writersList } = useFetchWriters();
  const { currentUser } = useAuthValue();  
  const { userCash } = useFetchPayments();
  const [error, setError] = useState(null);
  const [writer, setWriter] = useState("");
  const userType = "admin";
  const [cash, setCash] = useState(null);
  const [progress, setProgress] = useState(0);

  // Date formatting
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join("-") +
      " " +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(":")
    );
  }

  const fileHandler = (e) => {
    e && e.preventDefault();
    // Grab the file
    const file = e.target[0].files[0];
    uploadFile(file);
  };
  const uploadFile = (file) => {
    // If no file is selected then throw an error
    if (!file) {
      return setError("Kindly choose a file for upload");
    }
    // Continue if file is selected
    // Create a directory URL where the file shall be stored
    const storageRef = ref(store, `/files/${file.name}`);
    // Upload the file
    const uploadDoc = uploadBytesResumable(storageRef, file);
    uploadDoc.on(
      "state_changed",
      (snapshot) => {
        // Show upload progress
        const uploadProgress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      //In case of error during uploading
      (err) => {
        setError(err.message);
      },
      async () => {
        // Saving document uploaded and payment to the database
        const taskColRef = collection(db, "tasks");
        let user = JSON.parse(localStorage.getItem("upd"));
        const userColRef = collection(db, "admin");
        const paymentsColRef = collection(db, "payment");
        const userRef = doc(userColRef, currentUser.uid);
        const paymentsRef = doc(paymentsColRef, file.name);
        const taskRef = doc(taskColRef, file.name);
        await getDownloadURL(uploadDoc.snapshot.ref).then((url) => {
          const docPath = url;
          setDoc(
            taskRef,
            {
              file_name: file.name,
              uploaded_by: user.email,
              file_size: filesize(file.size, { base: 2, standard: "jedec" }),
              upload_date: formatDate(new Date()),
              assigned_to: writer,
              download_url: docPath,
              verification_status: "new",
              pay: parseInt(cash),
            },
            { merge: true }
          );
          if (user.user_type === userType) {
            setDoc(
              userRef,
              {
                my_cash: parseInt(userCash) + parseInt(cash),
              },
              { merge: true }
            );
            setDoc(
              paymentsRef,
              {
                transaction_name: file.name,
                made_by: user.email,
                assigned_to: writer,
                status: "pending",
                amount: parseInt(cash),
                transaction_date: formatDate(new Date()),
              },
              { merge: true }
            );
          }
        });
      }
    );
  };
  return (
    <div className=" mx-auto">
      <div className="w-full flex items-center justify-start py-12 lg:px-8">
        <div className="w-full flex justify-between items-center px-6 pt-5 pb-6 border-2 border-accent border-dashed rounded-md">
          <label className="block text-lg font-semibold text-neutral">
            Upload new document
          </label>
          <div className="flex flex-col items-center">
            <span className="inline-block sm:h-1/4 sm:w-1/3 md:h-1/3 md:w-1/6 rounded-full overflow-hidden bg-secondary hover:shadow-xl">
              <label htmlFor="profile-pic-modal hover:cursor-pointer"></label>
            </span>
            <label
              htmlFor="profile-pic-modal"
              className="mt-5 btn btn-outline btn-primary rounded-full animate-bounce"
            >
              <AiOutlineUpload className="mx-auto justify-center h-6 w-6" />
            </label>
          </div>
        </div>
        <>
          <input
            type="checkbox"
            id="profile-pic-modal"
            className="modal-toggle"
          />
          <div className="modal">
            {progress ? (
              <>
                <div className="modal-box flex flex-col items-center justify-around">
                  <h3 className="block text-md font-semibold text-neutral mb-9">
                    File upload{progress === 100 ? "ed" : "ing"}
                  </h3>
                  <div className="flex justify-center items-center">
                    <div
                      className="radial-progress text-primary"
                      style={{ "--value": progress }}
                    >
                      {progress} %
                    </div>
                  </div>

                  {progress === 100 && (
                    <div className="modal-action  uppercase">
                      <Link to={`/${currentUser.uid}/dashboard`}>
                        <label
                          htmlFor="profile-pic-modal"
                          className="btn btn-sm btn-outline btn-error rounded-2xl"
                        >
                          close
                        </label>
                      </Link>
                    </div>
                  )}
                  {error && (
                    <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                      <label htmlFor="profile-pic-modal" className="mt-2">
                        {error}
                      </label>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <form className="modal-box" onSubmit={fileHandler}>
                  <div>
                    <label className="block text-md font-semibold text-neutral">
                      File upload
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FaFileUpload className="mx-auto h-12 w-12 text-accent font-thin" />

                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-base-100 rounded-md font-medium text-primary hover:underline"
                          >
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="file:btn file:btn-sm file:btn-primary file:rounded-2xl"
                              onClick={() => {
                                setError(null);
                              }}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-accent">
                          DOC, DOCX, XLS, XLSX, PNG, JPG and PDF up to 10MB
                        </p>

                        <select
                          className="select select-primary w-full rounded-full mb-4"
                          value={writer}
                          onChange={(e) => setWriter(e.target.value)}
                          required
                        >
                          <option defaultValue value={""} disabled>
                            Assign a writer
                          </option>
                          {writersList && (
                            <>
                              {writersList.map((writer, _index) => (
                                <option value={writer.email} key={_index}>
                                  {writer.first_name} {writer.second_name}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
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
                          onInput={(e) => e.target.setCustomValidity("")}
                          placeholder="Enter amount"
                          className="input input-bordered input-primary w-full rounded-full"
                          onChange={(e) => setCash(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-action flex justify-between uppercase">
                    <label
                      htmlFor="profile-pic-modal"
                      className="btn btn-sm btn-outline btn-error rounded-2xl"
                    >
                      cancel
                    </label>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary rounded-2xl"
                    >
                      upload file
                    </button>
                  </div>
                  {error && (
                    <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
                      <label htmlFor="profile-pic-modal" className="mt-2">
                        {error}
                      </label>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
