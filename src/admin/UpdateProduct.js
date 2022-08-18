import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import {
  getAllCategories,
  getProduct,
  updateProduct,
} from "./helper/adminapicall";

const UpdateProduct = ({ history, match }) => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getaRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    photo,
    category,
    categories,
    loading,
    error,
    createdProduct,
    getaRedirect,
    formData,
  } = values;

  const preloadCategories = () => {
    getAllCategories(user._id, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
      }
    });
  };

  const preload = (productId) => {
    // Load all the existing categories to give options to the admin to choose from
    // idk why this is not working properly . there may be a little bug So lets not do this for now
    // preloadCategories();

    // load all about that product via the productId
    getProduct(productId).then((data) => {
      console.log("DATA", data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category?._id,
          stock: data.stock,
          formData: new FormData(),
        });
      }
    });

    // // Load all the existing categories to give options to the admin to choose from
    // getAllCategories(user._id, token).then((data) => {
    //   //   console.log(data);
    //   if (data.error) {
    //     setValues({ ...values, error: data.error });
    //   } else {
    //     setValues({ ...values, categories: data });
    //   }
    // });
  };

  useEffect(() => {
    console.log(match);
    preload(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      error: false,
      createdProduct: "",
      loading: false,
      getaRedirect: false,
    });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        // console.log(data);
        if (data.error) {
          setValues({
            ...values,
            error: data.error,
            loading: false,
            getaRedirect: false,
          });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            loading: false,
            createdProduct: data.name,
            getaRedirect: true,
            formData: "",
          });
        }
      }
    );
  };

  const getRedirect = () =>
    getaRedirect
      ? setTimeout(() => {
          history.push("/admin/products");
        }, 2000)
      : "";

  const loadingMessage = () => {
    return (
      <div
        className="alert alert-info my-2"
        style={{ display: loading ? "" : "none" }}
      >
        <h4>Loading...</h4>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success my-2"
        style={{ display: createdProduct ? "" : "none" }}
      >
        <h4>{createdProduct} updated successfully</h4>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="alert alert-danger my-2"
        style={{ display: error ? "" : "none" }}
      >
        <h4>{error}</h4>
      </div>
    );
  };

  const createProductForm = () => (
    <form>
      <div className="form-group my-3">
        <span className="p-4">Post photo</span>
        <label className="btn btn-block btn-info mt-3">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group my-4">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group my-4">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group my-4">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group my-4">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
          value={category}
        >
          <option>Select Category</option>
          {categories &&
            categories.map((cate, index) => {
              return (
                <option value={cate._id} key={index}>
                  {cate.name}
                </option>
              );
            })}
        </select>
      </div>
      <div className="form-group my-4">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-info my-3 mx-auto"
      >
        Update Product
      </button>
    </form>
  );

  const goBack = () => {
    return (
      <div className="mt-4">
        <Link to="/admin/dashboard" className="btn btn-info mb-4 btn-sm">
          Admin Home
        </Link>
      </div>
    );
  };

  return (
    <Base
      title="Update this product here !"
      description="Welcome to product updation section "
      className="container bg-info p-4 mb-5"
    >
      <div className="row bg-white m-2 rounded">
        <div className="col-md-1 mt-2 offset-md-1"> {goBack()}</div>
        {/* <p>{JSON.stringify(values)}</p> */}

        <div className="col-md-8 offset-md-1 my-3">
          {loadingMessage()}
          {successMessage()}
          {getRedirect()}
          {errorMessage()}
          {createProductForm()}
        </div>
        {/* <div className="row text-center">
          {successMessage()} {errorMessage()}
        </div> */}
      </div>
    </Base>
  );
};

export default UpdateProduct;
