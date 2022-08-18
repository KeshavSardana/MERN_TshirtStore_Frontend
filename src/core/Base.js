import React from "react";
import Navbar from "./Navbar";

const Base = ({
  title = "My Title",
  description = "My discription",
  className = "bg-dark text-white p-4",
  children,
}) => {
  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="jumbotron text-white text-center">
          <h3 className="display-4">{title}</h3>
          <p className="lead py-3">{description}</p>
        </div>
        <div className={className}>{children}</div>
      </div>
      <footer className="footer mt-auto">
        <div className="container-fluid bg-success text-white text-center py-3">
          <h5>If you got any questions , feel free to reach out !</h5>
          <button className="button rounded-pill btn-warning btn-md ">
            Contact Us
          </button>
        </div>
        <div className="container text-center">
          <span className="text-muted">
            An amazing <span className="text-white">MERN</span> Bootcamp
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Base;
