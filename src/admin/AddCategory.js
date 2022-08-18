import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const goBack = () => {
    return (
      <div className="mt-4">
        <Link to="/admin/dashboard" className="btn btn-info mb-4 btn-sm">
          Admin Home
        </Link>
      </div>
    );
  };

  const handleChange = (event) => {
    setError("");
    setSuccess(false);
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError(false);
    setSuccess(false);

    // backend request fired
    createCategory(user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setSuccess(false);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => {
    if (success) {
      return (
        <h4 className="text-success my-3"> Category Created successfully</h4>
      );
    }
  };

  const errorMessage = () => {
    if (error) {
      return <h4 className="text-warning my-3">Failed to create Category</h4>;
    }
  };

  const addCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="add" className="lead my-3">
            Enter the new category you want to add
          </label>
          <input
            className="form-control my-3"
            type="text"
            required
            id="add"
            placeholder="For Ex. Summer"
            autoFocus
            value={name}
            onChange={handleChange}
          />
          <button onClick={onSubmit} className="btn btn-outline-info my-3 ">
            Create Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      title="Create a new category from here"
      description="add categories for your products"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-1 mt-2 offset-md-1"> {goBack()}</div>

        <div className="col-md-8 offset-md-1">{addCategoryForm()}</div>
        <div className="row text-center">
          {successMessage()} {errorMessage()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
