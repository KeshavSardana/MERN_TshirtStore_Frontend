import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getmeToken, processPayment } from "./helper/braintreeHelper";
import { emptyCart, loadCart } from "./helper/cartHelper";
import { createOrder } from "./helper/orderHelper";
import DropIn from "braintree-web-drop-in-react";

const BraintreePayment = ({
  products,
  reload = undefined,
  setReload = (f) => f,
}) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    error: "",
    clientToken: null,
    instance: {},
  });

  const [fakeState, setFakeState] = useState(true);

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token)
      .then((response) => {
        console.log("TOKEN RESPONSE :", response);
        if (response.error) {
          setInfo({ ...info, error: response.error });
        } else {
          const clientToken = response.clientToken;
          setInfo({ clientToken });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getToken(userId, token);
  }, [fakeState]);

  const getFinalAmount = (products) => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const onPurchase = (products) => {
    setInfo({ loading: true, error: false });
    let nonce;
    let getNonce = info.instance
      .requestPaymentMethod()
      .then((data) => {
        if (data.error) {
          setInfo({ error: data.error, loading: false, success: false });
        } else {
          nonce = data.nonce;
          const paymentData = {
            paymentMethodNonce: nonce,
            amount: getFinalAmount(products),
          };
          processPayment(userId, token, paymentData)
            .then((response) => {
              if (response.errors || response.error) {
                console.log("RESPONSE OF PAYMENT : ", response);
                setInfo({
                  loading: false,
                  error: response.error,
                  success: false,
                  instance: {},
                });
                setFakeState(!fakeState);
              } else {
                console.log("PAYMENT SUCCESS", response);
                setInfo({
                  loading: false,
                  success: response.success,
                  error: false,
                  instance: {},
                });
                // TODO create the order
                const orderData = {
                  products: products,
                  transaction_id: response.transaction.id,
                  amount: response.transaction.amount,
                };
                createOrder(userId, token, orderData)
                  .then((res) => {
                    if (res.error) {
                      console.log(res.error);
                    } else {
                      console.log("ORDER CREATED");
                    }
                  })
                  .catch((err) => console.log(err));

                // empty out the cart
                emptyCart(() => {
                  console.log("Did we got a crash ?");
                  setReload(!reload);
                  setFakeState(!fakeState);
                });
              }
            })
            .catch((err) => {
              console.log("PAYMENT FAILED ");
              setFakeState(!fakeState);
              setInfo({
                loading: false,
                error: err,
                success: false,
                instance: {},
              });
            });
        }
      })
      .catch();
  };

  const showBraintreeButton = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            {}
            <button
              className="btn btn-success  px-5 my-2"
              onClick={() => {
                onPurchase(products);
              }}
            >
              Pay with Paypal
            </button>
          </div>
        ) : isAuthenticated() && isAuthenticated().user ? (
          <Link to="/" className="btn btn-outline-warning">
            Please add some products to your cart first
          </Link>
        ) : (
          <Link to="/signin" className="btn btn-warning">
            Login first to place your order with braintree payment gateway
          </Link>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3 className="">Your bill is {getFinalAmount(products)} $</h3>
      {showBraintreeButton()}
    </div>
  );
};

export default BraintreePayment;
