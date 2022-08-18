import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    email: "test@keshav.com",
    password: "12345",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, loading, didRedirect } = values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="row">
          <div className="col-sm-6 offset-sm-3 text-center">
            <div className="alert alert-info">Loading...</div>
          </div>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-sm-6 offset-sm-3 text-center">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else if (user && user.role === 0) {
        return <Redirect to="/user/dashboard" />;
      }

      if (isAuthenticated()) {
        return <Redirect to="/" />;
      }
    }
  };

  const onsubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        // console.log(data);
        if (data.error) {
          setValues({
            ...values,
            error: data.error,
            loading: false,
          });
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              email: "",
              password: "",
              error: false,
              loading: false,
              didRedirect: true,
            });
          });
        }
      })
      .catch((error) => console.log("Signin request failed"));
  };

  const signinForm = () => {
    return (
      <div className="row">
        <div className="col-sm-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light py-1" htmlFor="email">
                Email
              </label>
              <input
                value={email}
                onChange={handleChange("email")}
                className="form-control"
                type="email"
                id="email"
              />
            </div>
            <div className="form-group">
              <label className="text-light py-1 pt-3" htmlFor="password">
                Password
              </label>
              <input
                value={password}
                onChange={handleChange("password")}
                className="form-control"
                type="password"
                id="password"
              />
            </div>
            <div class="d-grid gap-2 my-4 ">
              <button onClick={onsubmit} class="btn btn-success" type="button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base
      title="Signin Page"
      description="A page for user to sign in !"
      className="text-white p-4"
    >
      {performRedirect()}
      {loadingMessage()}
      {errorMessage()}
      {signinForm()}
      <p className="text-center text-white">{JSON.stringify(values)}</p>
    </Base>
  );
};

export default Signin;
