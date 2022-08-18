import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { getAllCategories, deleteCategory } from "./helper/adminapicall";

const ManageCategories = () => {
  const { user, token } = isAuthenticated();

  var [categories, setCategories] = useState([]);

  const preload = () => {
    getAllCategories(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
        console.log(data);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const deleteTheCategory = (categoryId) => {
    deleteCategory(categoryId, user._id, token).then((data) => {
      if (data.error) {
        console.log(
          "Not able to delete the Category and the actual error is : "
        );
        console.log("ERROR", data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base title="Welcome admin" description="Manage Categories here">
      <Link className="btn btn-info my-3" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <h2 className="mb-4">All Categories:</h2>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white mb-4">
            Total {categories.length} Categories
          </h2>

          {categories.map((category, index) => {
            return (
              <div key={index} className="row text-center mb-2 ">
                <div className="col-4">
                  <h3 className="text-white text-left">{category.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/category/update/${category._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      deleteTheCategory(category._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageCategories;
