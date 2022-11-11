import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";
import FileUpload from "../../components/FileUpload";
import ListFiles from "../../components/ListFiles";

const Tasks = () => {
  let user = JSON.parse(localStorage.getItem("upd"));
  return (
    <>
      <Navbar />
      <div className="w-full bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="drawer drawer-mobile">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start mt-16 py-6 sm:px-6 lg:px-8">
              <header className="w-full">
                <h2 className="my-6 text-left text-3xl font-extrabold text-neutral">
                  Tasks
                </h2>
              </header>
              <main className="w-full">
                {user.user_type === "admin" && (
                  <>
                    <FileUpload />
                  </>
                )}
                <ListFiles />
              </main>
            </div>
            <SideMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
