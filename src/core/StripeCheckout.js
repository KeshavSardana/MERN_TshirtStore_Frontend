import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { emptyCart, loadCart } from "./helper/cartHelper";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  reload = undefined,
  setReload = (f) => f,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalPrice = () => {
    let amount = 0;
    products &&
      products.map((product) => {
        amount = amount + product.price;
      });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          console.log("RESPONSE:", response);

          // call your further methods here like whatever you want to do further to create order after receiving the payment
          // call your createOrder method
          // const orderData = {
          //   products: products,
          //   transaction_id: response.id,
          // };
          // createOrder(userId, token, orderData)
          //   .then((res) => {
          //     if (res.error) {
          //       console.log(res.error);
          //     } else {
          //       console.log("ORDER CREATED");
          //     }
          //   })
          //   .catch((err) => console.log(err));

          // console.log("ORDER CREATED");
          const { status } = response;
          console.log("STATUS :", status);
          // call your emptyCart method
          emptyCart(() => setReload(!reload));
        }
      })
      .catch((error) => console.log(error));
  };

  const showStripeButton = () => {
    return products && products.length !== 0 ? (
      isAuthenticated() ? (
        <StripeCheckoutButton
          stripeKey={process.env.REACT_APP_STRIPE_KEY}
          token={makePayment}
          name="Pay your bill"
          amount={getFinalPrice() * 100}
          shippingAddress
          billingAddress
        >
          <button className="btn btn-success my-3"> Pay with Stripe </button>
        </StripeCheckoutButton>
      ) : (
        <Link to="/signin" className="btn btn-warning my-5">
          Login first to create your order with stripe payment gateway
        </Link>
      )
    ) : (
      <Link to="/" className="btn btn-outline-warning my-3">
        Your cart is empty
      </Link>
    );
  };

  return (
    <div>
      <h3> Checkout ${getFinalPrice()}</h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
