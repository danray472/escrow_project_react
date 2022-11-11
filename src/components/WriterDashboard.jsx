const WriterDashboard = ({currentUser}) => {
  return (
    <div className="mb-8">
      <div className="flex sm:flex-wrap md:flex-nowrap sm:justify-center lg:justify-start mb-6 sm:gap-4 lg:gap-8">
        <div className="stats shadow-md w-full sm:max-w-xs bg-success text-base-100">
          <div className="stat">
            <div className="stat-title">Tasks</div>
            <div className="stat-value">89,400</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
        <div className="stats shadow-md w-full sm:max-w-xs bg-info text-base-100">
          <div className="stat">
            <div className="stat-title">Payment</div>
            <div className="stat-value">89,400</div>
            <div className="stat-desc">21% more than last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
