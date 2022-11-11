import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="container mx-auto w-screen mb-10">
      <div className="container mx-auto text-center ">
        <h1 className="mt-8">404 Error Page</h1>
        <p className="zoom-area mb-5">
          <b>Oopsie!</b> seems you are a little lost.
        </p>
        <div className="link-container text-center mb-3">
          <Link
            to="/"
            className="more-link btn btn-active border-none bg-primary hover:bg-base-100 hover:border-2 hover:border-primary hover:text-primary p-4 rounded-full text-base-100 animate-pulse"
          >
            Get back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
