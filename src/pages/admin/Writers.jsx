import { useState } from "react";
import { db } from "../../assets/firebase/firebase";
import Navbar from "../../components/Navbar";
import SideMenu from "../../components/SideMenu";
import { VscWorkspaceUnknown } from "react-icons/vsc";
import useFetchWriters from "../../components/useFetchWriters";

const Writers = () => {
  const [error, setError] = useState(null);
  const { writersTotal, writersList } = useFetchWriters({ db });

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
                  Writers ({writersTotal})
                </h2>
              </header>
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
                      {writersTotal > 0 ? (
                        <>
                          <div
                            tabIndex={0}
                            className="collapse collapse-open border border-base-300 bg-base-100 rounded-box"
                          >
                            <div className="collapse-content">
                              <ul className="menu bg-base-100 w-full">
                                {writersList.map((writer, _index) => (
                                  <li key={_index} title="Click to download">
                                    <div className="flex flex-row justify-between h-fit">
                                      <span className="font-bold text-sm">
                                        {writer.first_name} {writer.second_name}
                                      </span>
                                      <span className="font-bold text-sm">
                                        {writer.email}
                                      </span>
                                      <span className="font-bold text-sm">
                                        {writer.phone_number}
                                      </span>
                                      <button className="btn btn-link btn-primary rounded-full p-2">
                                        {/* <AiOutlineDownload className="mx-auto justify-center h-6 w-6" /> */}
                                      </button>
                                    </div>
                                    <hr />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="container mx-auto w-screen mb-10">
                          <div className="container mx-auto text-center ">
                            <h1 className="mt-8 text-xl font-bold">
                              Seems like you have no writers
                            </h1>
                            <p className="zoom-area mb-5">
                              Do you want to{" "}
                              <b className="text-primary underline">
                                <label htmlFor="profile-pic-modal">
                                  find some?
                                </label>
                              </b>
                            </p>
                            <div className="link-container text-center mb-3">
                              <VscWorkspaceUnknown className="mx-auto h-48 w-48 font-thin text-accent" />
                            </div>
                          </div>
                        </div>
                      )}
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

export default Writers;
