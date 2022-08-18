import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";

const AdminDashboard = () => {
  const {
    user: { name, email, role },
  } = isAuthenticated();

  const adminLeftSide = () => {
    return (
      <div className="card bg-success p-4 text-center">
        <h5 className="card-header bg-dark text-center text-white">
          Admin Navigation
        </h5>
        <ul className="list-group">
          <li className="list-group-item">
            <Link to="/admin/create/category" className="nav-link text-success">
              Create Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/categories" className="nav-link text-success">
              Manage Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/create/product" className="nav-link text-success">
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/products" className="nav-link text-success">
              Manage Products
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/orders" className="nav-link text-success">
              Manage Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const adminRightSide = () => {
    return (
      <div className="card m-3 ">
        <div className="card-header bg-dark text-center">
          <h5>Hey Mr. Admin , Have a look at your information</h5>
        </div>
        <ul className="list-group mx-4">
          <li className="list-group-item">
            <h6 className="">
              Name : <span>{name}</span>
            </h6>
          </li>
          <li className="list-group-item">
            <h6 className="">
              Email : <span>{email}</span>
            </h6>
          </li>
        </ul>
        <h6 className="text-black m-4">
          Usually its better to show dynamic things on admin panel like some
          growth in sales graph or growth in users and stuff rather than static
          information ( in this right side of area ).
        </h6>
      </div>
    );
  };

  return (
    <Base
      title=" Welcome to admin area"
      description="Manage all your products and orders here"
      className=" text-white"
    >
      <div className="container">
        <div className="row bg-success">
          <div className="col-lg-3">{adminLeftSide()}</div>
          <div className="col-lg-9">{adminRightSide()}</div>
        </div>
      </div>
    </Base>
  );
};

export default AdminDashboard;
