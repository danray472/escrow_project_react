import { useState } from "react";
import { store, db } from "../assets/firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FaFileUpload } from "react-icons/fa";
import {
  AiOutlineFileUnknown,
  AiOutlineDownload,
  AiOutlineUpload,
} from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import useFetchTasks from "./useFetchTasks";
import { collection, doc, setDoc } from "firebase/firestore";
import useFetchAdmin from "./useFetchAdmin";

const ListFiles = () => {
  const [error, setError] = useState(null);
  let tsk = null;
  const [admin, setAdmin] = useState("");
  let user = JSON.parse(localStorage.getItem("upd"));
  // Show the files uploaded
  const {
    tasksTotal,
    newTasksTotal,
    newTasksList,
    completedTasksTotal,
    completedTasksList,
    verifiedTasksTotal,
    verifiedTasksList,
  } = useFetchTasks();

  const { adminList } = useFetchAdmin();

  // Download files
  const downloadDoc = (fileName) => {
    if (!fileName) {
      return setError("Kindly choose a file to download");
    }
    getDownloadURL(ref(store, `/files/${fileName}`))
      .then((url) => {
        // `url` is the download URL for the file
        window.open(url, "_blank");
        setError("");
        // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = "blob";
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open("GET", url);
        // xhr.send();
      })
      .catch((err) => {
        // A list of error codes
        switch (err.code) {
          case "storage/object-not-found":
            setError(err.message);
            break;
          case "storage/unauthorized":
            setError(err.message);
            break;
          case "storage/canceled":
            setError(err.message);
            break;
          case "storage/unknown":
            setError(err.message);
            break;
        }
      });
  };

  //
  const downloadPrevDoc = (fileUrl) => {
    if (!fileUrl) {
      return setError("Kindly choose a file to download");
    } else {
      // `url` is the download URL for the file
      window.open(fileUrl, "_blank");
      setError("");
    }
  };

  // For writers to upload completed files
  const fileHandler = (e) => {
    e && e.preventDefault();
    // Grab the file
    const file = e.target[0].files[0];
    if (tsk) {
      uploadFile(file, tsk);
    }
  };
  const uploadFile = (file, fileName) => {
    // If no file is selected then throw an error
    if (!file) {
      return setError("Kindly choose a file to upload");
    }
    // If file selected fits the completed pattern then throw an error
    if (file.name.includes("(completed)")) {
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
        },
        //In case of error during uploading
        (err) => {
          setError(err.message);
        },
        async () => {
          // Saving document uploaded to the database

          const taskColRef = collection(db, "tasks");
          const taskRef = doc(taskColRef, fileName);
          await getDownloadURL(uploadDoc.snapshot.ref).then((url) => {
            const docPath = url;
            setDoc(
              taskRef,
              {
                file_name: fileName,
                new_download_url: docPath,
                verification_status: "completed",
              },
              { merge: true }
            );
          });
        }
      );
    } else {
      return setError("Kindly ensure the file is saved with (completed)");
    }
  };

  // For admin to verify task
  const verifyDoc = async (fileName) => {
    // Changing verification status
    const taskColRef = collection(db, "tasks");
    const taskRef = doc(taskColRef, fileName);
    await setDoc(
      taskRef,
      {
        verification_status: "verified",
      },
      { merge: true }
    );
  };

  return (
    <div className="mx-auto">
      <div className="w-full flex items-center justify-center py-12 lg:px-8">
        <div className="overflow-x-auto w-full">
          {error && (
            <div className="mt-12 text-sm uppercase p-4 text-base-100 bg-error text-center rounded-3xl">
              <label htmlFor="profile-pic-modal" className="mt-2">
                {error}
              </label>
            </div>
          )}
          {tasksTotal > 0 ? (
            <>
              <label className="block text-xl font-semibold text-neutral">
                Uploaded tasks ({tasksTotal})
              </label>
              <div className="my-3">
                <div
                  tabIndex={0}
                  className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                >
                  <div className="collapse-title text-lg font-semibold text-primary">
                    New tasks ({newTasksTotal})
                  </div>
                  <hr />
                  <div className="collapse-content">
                    <ul className="menu bg-base-100 w-full">
                      {newTasksTotal != 0 ? (
                        <>
                          {newTasksList.map((task, _index) => (
                            <li key={_index}>
                              <div className="flex flex-row">
                                <div
                                  title="Click to download"
                                  className="flex w-5/6 max-w-full flex-row justify-between h-fit p-2"
                                  onClick={() => {
                                    downloadDoc(task.file_name);
                                  }}
                                >
                                  <span className="font-bold text-sm">
                                    {task.file_name}
                                  </span>
                                  {/* <span className="font-bold text-sm">
                                    {task.file_name}
                                  </span> */}
                                  <button
                                    className="btn btn-primary rounded-full p-2"
                                    onClick={() => {
                                      downloadDoc(task.file_name);
                                    }}
                                  >
                                    <AiOutlineDownload className="mx-auto justify-center h-6 w-6" />
                                  </button>
                                </div>
                                {user.user_type === "writer" && (
                                  <>
                                    <div
                                      className="w-1/6 flex justify-center items-center"
                                      title="Upload completed task"
                                    >
                                      <label
                                        htmlFor="profile-pic-modal"
                                        className="btn btn-outline btn-primary rounded-full p-2"
                                      >
                                        <AiOutlineUpload
                                          className="mx-auto justify-center h-6 w-6"
                                          // onClick={setTsk(task.file_name)}
                                        />
                                      </label>
                                    </div>
                                    <>
                                      <input
                                        type="checkbox"
                                        id="profile-pic-modal"
                                        className="modal-toggle"
                                      />
                                      <div className="modal">
                                        <form
                                          className="modal-box"
                                          onSubmit={fileHandler}
                                        >
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
                                                  DOC, DOCX, XLS, XLSX, PNG, JPG
                                                  and PDF up to 10MB
                                                </p>
                                                <input
                                                  type="hidden"
                                                  name=""
                                                  value={(tsk = task.file_name)}
                                                />

                                                <select
                                                  className="select select-primary w-full rounded-full"
                                                  value={admin}
                                                  onChange={(e) =>
                                                    setAdmin(e.target.value)
                                                  }
                                                  required
                                                >
                                                  <option
                                                    defaultValue
                                                    value={""}
                                                    disabled
                                                  >
                                                    Submit to the admin
                                                  </option>
                                                  {adminList && (
                                                    <>
                                                      {adminList.map(
                                                        (admin, _index) => (
                                                          <option
                                                            value={admin.email}
                                                            key={_index}
                                                          >
                                                            {admin.first_name}{" "}
                                                            {admin.second_name}
                                                          </option>
                                                        )
                                                      )}
                                                    </>
                                                  )}
                                                </select>
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
                                  </>
                                )}
                              </div>
                              <hr />
                            </li>
                          ))}
                        </>
                      ) : (
                        <>
                          <h1 className="mt-8 font-bold">
                            Seems like you have no items
                          </h1>
                          <p className="text-accent">No files found!</p>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="my-3">
                <div
                  tabIndex={0}
                  className="collapse collapse-open collapse-arrow border border-base-300 bg-base-100 rounded-box"
                >
                  <div className="collapse-title text-lg font-semibold text-primary">
                    Completed tasks ({completedTasksTotal})
                  </div>
                  <div className="collapse-content">
                    <ul className="menu bg-base-100 w-full">
                      {completedTasksTotal != 0 ? (
                        <>
                          {completedTasksList.map((task, _index) => (
                            <li
                              key={_index}
                              title="Click to download completed"
                            >
                              <div className="flex flex-row">
                                <div
                                  className="flex w-5/6 max-w-full flex-row justify-between h-fit p-2"
                                  onClick={() => {
                                    downloadDoc(task.file_name);
                                  }}
                                >
                                  <span className="font-bold text-sm">
                                    {task.file_name}
                                  </span>
                                  <button
                                    className="btn btn-link btn-primary rounded-full p-2"
                                    onClick={() => {
                                      downloadDoc(task.file_name);
                                    }}
                                  >
                                    <AiOutlineDownload className="mx-auto justify-center h-6 w-6" />
                                  </button>
                                </div>
                                <div
                                  className="w-1/6 flex justify-center items-center"
                                  title="Upload completed task"
                                >
                                  <div className="dropdown dropdown-end">
                                    <label
                                      tabIndex={0}
                                      className="btn btn-outline btn-primary rounded-full p-2"
                                    >
                                      <FiMoreVertical className="mx-auto justify-center h-6 w-6" />
                                    </label>
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                                    >
                                      <li>
                                        <button
                                          className="btn btn-sm btn-ghost"
                                          onClick={() => {
                                            downloadPrevDoc(task.download_url);
                                          }}
                                        >
                                          Download original
                                        </button>
                                      </li>
                                      {user.user_type === "admin" && (
                                        <li>
                                          <button
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => {
                                              verifyDoc(task.file_name);
                                            }}
                                          >
                                            Verify assignment
                                          </button>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </li>
                          ))}
                        </>
                      ) : (
                        <>
                          <h1 className="mt-8 font-bold">
                            Seems like you have no items
                          </h1>
                          <p className="text-accent">No files found!</p>
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
                    Verified tasks ({verifiedTasksTotal})
                  </div>
                  <hr />
                  <div className="collapse-content">
                    <ul className="menu bg-base-100 w-full">
                      {verifiedTasksTotal != 0 ? (
                        <>
                          {verifiedTasksList.map((task, _index) => (
                            <li key={_index} title="Click to download">
                              <div
                                className="flex flex-row justify-between h-fit p-2"
                                onClick={() => {
                                  downloadDoc(task.file_name);
                                }}
                              >
                                <span className="font-bold text-sm">
                                  {task.file_name}
                                </span>
                                <button
                                  className="btn btn-link btn-primary rounded-full p-2"
                                  onClick={() => {
                                    downloadDoc(doc.name);
                                  }}
                                >
                                  <AiOutlineDownload className="mx-auto justify-center h-6 w-6" />
                                </button>
                              </div>
                              <hr />
                            </li>
                          ))}
                        </>
                      ) : (
                        <>
                          <h1 className="mt-8 font-bold">
                            Seems like you have no items
                          </h1>
                          <p className="text-accent">No files found!</p>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="container mx-auto w-full mb-10">
              <div className="container mx-auto text-center ">
                <h1 className="mt-8 text-xl font-bold">
                  Seems like you have no items
                </h1>
                <p className="zoom-area mb-5">
                  Do you want to{" "}
                  <b className="text-primary underline hover:cursor-pointer">
                    <label htmlFor="profile-pic-modal">upload files</label>
                  </b>
                </p>
                <div className="link-container text-center mb-3">
                  <AiOutlineFileUnknown className="mx-auto h-48 w-48 font-thin text-accent" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListFiles;
