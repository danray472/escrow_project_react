import { useState } from "react";
import { db } from "../../assets/firebase/firebase";
import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";
import useFetchWriters from "../../components/useFetchWriters";
import useFetchTasks from "../../components/useFetchTasks";
import { AiOutlineDownload } from "react-icons/ai";
import { ExportToCsv } from "export-to-csv";
import useFetchPayments from "../../components/useFetchPayments";

const Reports = () => {
  const [error, setError] = useState(null);
  const { writersTotal, writersList } = useFetchWriters({ db });
  const [titles, setTitles] = useState(null);
  const {
    tasksTotal,
    tasksList,
    newTasksTotal,
    newTasksList,
    completedTasksTotal,
    completedTasksList,
    verifiedTasksTotal,
    verifiedTasksList,
  } = useFetchTasks();
  const {
    paymentsTotal,
    paymentsList,
    pendingPaymentsTotal,
    pendingPaymentsList,
    completedPaymentsTotal,
    completedPaymentsList,
  } = useFetchPayments();

  const downloadData = (data) => {
    const arr = data;
    const newArr = arr.map(({ download_url, new_download_url, ...rest }) => {
      return rest;
    });
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: "Report",
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    if (newArr.length > 0) {
      csvExporter.generateCsv(newArr);
      setError("");
    } else {
      setError("Data not present");
    }
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
                <h2 className="mt-6 text-left text-3xl font-extrabold text-neutral">
                  Reports
                </h2>
                <p className="mb-6 text-sm text-accent italic">
                  (You can download the various reports below)
                </p>
              </header>
              <article className="w-full"></article>
              <main className="w-full">
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
                      <div className="mb-8">
                        <div className="flex sm:flex-wrap md:flex-nowrap sm:justify-center lg:justify-start mb-6 sm:gap-4 lg:gap-8">
                          <div className="stats shadow-md w-full sm:max-w-xs bg-base-100 text-neutral">
                            <div className="stat">
                              <div className="stat-title font-bold">
                                Total Tasks
                              </div>
                              <div className="stat-value text-primary">
                                {tasksTotal}
                              </div>
                              <div className="stat-desc mt-4">
                                <button
                                  className="btn btn-primary w-full"
                                  onClick={(e) => {
                                    downloadData(tasksList);
                                  }}
                                >
                                  Download{" "}
                                  <AiOutlineDownload className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="stats shadow-md w-full sm:max-w-xs bg-base-100 text-neutral">
                            <div className="stat">
                              <div className="stat-title font-bold">
                                Writers
                              </div>
                              <div className="stat-value text-primary">
                                {writersTotal}
                              </div>
                              <div className="stat-desc mt-4">
                                <button
                                  className="btn btn-primary w-full"
                                  onClick={(e) => {
                                    downloadData(writersList);
                                  }}
                                >
                                  Download{" "}
                                  <AiOutlineDownload className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="stats shadow-md w-full sm:max-w-xs bg-base-100 text-neutral">
                            <div className="stat">
                              <div className="stat-title font-bold">
                                Transactions
                              </div>
                              <div className="stat-value text-primary">
                                {paymentsTotal}
                              </div>
                              <div className="stat-desc mt-4">
                                <button
                                  className="btn btn-primary w-full"
                                  onClick={(e) => {
                                    downloadData(paymentsList);
                                  }}
                                >
                                  Download{" "}
                                  <AiOutlineDownload className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-5">
                          <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
                            Tasks
                          </h3>
                          <div className="flex sm:flex-wrap md:flex-nowrap sm:justify-center lg:justify-start mb-6 sm:gap-4 lg:gap-8">
                            <div className="stats shadow-md w-full sm:max-w-xs lg:max-w-sm bg-info text-base-100">
                              <div className="stat">
                                <div className="stat-title">New Tasks</div>
                                <div className="stat-value">
                                  {newTasksTotal}
                                </div>
                                <div className="stat-desc mt-4">
                                  <button
                                    className="btn btn-outline w-full"
                                    onClick={(e) => {
                                      downloadData(newTasksList);
                                    }}
                                  >
                                    Download{" "}
                                    <AiOutlineDownload className="w-6 h-6" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="stats shadow-md w-full sm:max-w-xs bg-warning text-base-100">
                              <div className="stat">
                                <div className="stat-title">
                                  Completed Tasks
                                </div>
                                <div className="stat-value">
                                  {completedTasksTotal}
                                </div>
                                <button
                                  className="btn btn-outline w-full"
                                  onClick={(e) => {
                                    downloadData(completedTasksList);
                                  }}
                                >
                                  Download{" "}
                                  <AiOutlineDownload className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                            <div className="stats shadow-md w-full sm:max-w-xs bg-success text-base-100">
                              <div className="stat">
                                <div className="stat-title">Verified Tasks</div>
                                <div className="stat-value">
                                  {verifiedTasksTotal}
                                </div>
                                <button
                                  className="btn btn-outline w-full"
                                  onClick={(e) => {
                                    downloadData(verifiedTasksList);
                                  }}
                                >
                                  Download{" "}
                                  <AiOutlineDownload className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-5">
                          <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
                            Payments
                          </h3>
                          <div className="w-full flex items-center justify-center ">
                            <div className="w-full flex sm:flex-wrap md:flex-nowrap sm:justify-center lg:justify-start mb-6 sm:gap-4 lg:gap-8">
                              <div className="stats shadow-md w-full sm:max-w-xs lg:max-w-sm bg-warning text-base-100">
                                <div className="stat">
                                  <div className="stat-title">
                                    Pending Payments
                                  </div>
                                  <div className="stat-value">
                                    {pendingPaymentsTotal}
                                  </div>
                                  <div className="stat-desc mt-4">
                                <button
                                  className="btn btn-outline w-full"
                                  onClick={(e) => {
                                    downloadData(pendingPaymentsList);
                                  }}
                                >
                                  Download{" "}
                                  <AiOutlineDownload className="w-6 h-6" />
                                </button>
                              </div>
                                </div>
                              </div>
                              <div className="stats shadow-md w-full sm:max-w-xs bg-success text-base-100">
                                <div className="stat">
                                  <div className="stat-title">
                                    Completed Payments
                                  </div>
                                  <div className="stat-value">
                                    {completedPaymentsTotal}
                                  </div>
                                  <div className="stat-desc mt-4">
                                <button
                                  className="btn btn-outline w-full"
                                  onClick={(e) => {
                                    downloadData(completedPaymentsList);
                                  }}
                                >
                                  Download{" "}
                                  <AiOutlineDownload className="w-6 h-6" />
                                </button>
                              </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default Reports;
