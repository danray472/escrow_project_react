import { Link } from "react-router-dom";
import useFetchPayments from "./useFetchPayments";
import useFetchTasks from "./useFetchTasks";

const WriterDashboard = ({ currentUser }) => {
  const { userCash } = useFetchPayments();
  const { tasksTotal, newTasksTotal, completedTasksTotal, verifiedTasksTotal } =
    useFetchTasks();
  const { pendingPaymentsTotal, completedPaymentsTotal } = useFetchPayments();
  return (
    <div className="mb-8 w-full">
      <div className="flex sm:flex-wrap md:flex-nowrap sm:justify-center lg:justify-start mb-6 sm:gap-4 lg:gap-8">
        <div className="stats shadow-md w-full sm:max-w-xs bg-base-100 text-neutral">
          <Link to={`/${currentUser.uid}/tasks`}>
            <div className="stat">
              <div className="stat-title font-bold">Total Tasks</div>
              <div className="stat-value text-primary">{tasksTotal}</div>
            </div>
          </Link>
        </div>
        <div className="stats shadow-md w-full sm:max-w-xs bg-base-100 text-neutral">
          <Link to={`/${currentUser.uid}/payments`}>
            <div className="stat">
              <div className="stat-title font-bold">My account</div>
              <div className="stat-value text-primary">{userCash}</div>
            </div>
          </Link>
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
              <div className="stat-value">{newTasksTotal}</div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs bg-warning text-base-100">
            <div className="stat">
              <div className="stat-title">Completed Tasks</div>
              <div className="stat-value">{completedTasksTotal}</div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs bg-success text-base-100">
            <div className="stat">
              <div className="stat-title">Verified Tasks</div>
              <div className="stat-value">{verifiedTasksTotal}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <h3 className="mt-8 mb-4 text-left text-xl font-extrabold text-neutral">
          Payments
        </h3>
        <div className="flex sm:flex-wrap md:flex-nowrap sm:justify-center lg:justify-start mb-6 sm:gap-4 lg:gap-8">
          <div className="stats shadow-md w-full sm:max-w-xs lg:max-w-sm bg-warning text-base-100">
            <div className="stat">
              <div className="stat-title">Pending Payments</div>
              <div className="stat-value">{pendingPaymentsTotal}</div>
            </div>
          </div>
          <div className="stats shadow-md w-full sm:max-w-xs bg-success text-base-100">
            <div className="stat">
              <div className="stat-title">Completed Payments</div>
              <div className="stat-value">{completedPaymentsTotal}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
