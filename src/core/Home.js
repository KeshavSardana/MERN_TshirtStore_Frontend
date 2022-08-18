import React, { useState, useEffect } from "react";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { getAllProducts } from "./helper/coreapicalls";

const Home = () => {
  // console.log("API is : ", API);

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const loadAllProducts = () => {
    getAllProducts()
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to the Tshirt Store">
      <div className="row text-center">
        <h1 className="text-center text-white">All Products</h1>
        {products &&
          products.map((product, index) => {
            return (
              <div className="col-md-4 col-sm-6 my-4" key={index}>
                <Card product={product} />
              </div>
            );
          })}
      </div>
    </Base>
  );
};

export default Home;
