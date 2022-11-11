import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";

const Payment = () => {
  return (
    <>
      <Navbar />
      <div className="w-full bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="drawer drawer-mobile">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start mt-16">
              <div className="p-4">Payments</div>
            </div>
            <SideMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
