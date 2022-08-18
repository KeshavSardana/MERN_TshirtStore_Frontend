import React, { useState, useEffect } from "react";
import "../styles.css";
import Base from "./Base";
import BraintreePayment from "./BraintreePayment";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import StripeCheckout from "./StripeCheckout";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    setCartItems(loadCart());
  }, [reload]);

  const loadCartSection = (cartItems) => {
    return (
      <div>
        <h2>This section is to load your cart items</h2>
        {cartItems &&
          cartItems.map((item, index) => (
            <Card
              key={index}
              product={item}
              addToCart={false}
              removeFromCart={true}
              reload={reload}
              setReload={setReload}
            />
          ))}
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="Ready to checkout">
      <div className="row text-center">
        <div className="col-md-6">
          {cartItems.length > 0 ? (
            loadCartSection(cartItems)
          ) : (
            <h3>No products in your cart</h3>
          )}
        </div>
        <div className="col-md-6">
          <StripeCheckout
            products={cartItems}
            reload={reload}
            setReload={setReload}
          />
          <div className="my-4">
            <BraintreePayment
              products={cartItems}
              reload={reload}
              setReload={setReload}
            />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Cart;
