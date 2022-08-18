import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    errorMessage: "",
    success: false,
  });

  const { name, email, password, error, success, errorMessage } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password })
      .then((data) => {
        if (data.error) {
          console.log(data);
          setValues({
            ...values,
            error: true,
            success: false,
            errorMessage: data.error,
          });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: false,
            success: true,
          });
        }
      })
      .catch((err) => console.log("error in signup"));
  };

  const signupForm = () => {
    return (
      <div className="row">
        <div className="col-sm-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label htmlFor="name" className="text-light py-1 ">
                Name
              </label>
              <input
                onChange={handleChange("name")}
                value={name}
                // onChange={(e) =>
                //   setValues({ ...values, error: false, name: e.target.value })
                // }
                className="form-control"
                type="text"
                id="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="text-light py-1 pt-3">
                Email
              </label>
              <input
                onChange={handleChange("email")}
                value={email}
                className="form-control"
                type="email"
                id="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="text-light py-1 pt-3">
                Password
              </label>
              <input
                onChange={handleChange("password")}
                value={password}
                className="form-control"
                type="password"
                id="password"
              />
            </div>
            <div className="d-grid gap-2 my-4 ">
              <button
                onClick={onSubmit}
                className="btn btn-success"
                type="button"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-sm-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            Account created successfully. Please{" "}
            <Link to="/signin"> Login here </Link>
          </div>
        </div>
      </div>
    );
  };

  const errMessage = () => {
    return (
      <div className="row">
        <div className="col-sm-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {errorMessage}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Base
      title="SignUp Page"
      description="A page for user to sign up!"
      className="text-white p-4"
    >
      {successMessage()}
      {errMessage()}
      {signupForm()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signup;
