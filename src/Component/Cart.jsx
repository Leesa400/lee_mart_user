import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"
import "../Component/Cart.css";

const Cart = () => {
  const url = "http://localhost:5000";
    // const url = "https://lee-mart-api.onrender.com" 


  const { cart, decreaseQty, addToCart, removeFromCart, clearCart } = useContext(AppContext);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let quantity = 0;
    let price = 0;
    if (cart?.items) {
      for (let i = 0; i < cart.items?.length; i++) {
        quantity += cart.items[i].quantity;
        price += cart.items[i].price;
      }
    }
    setPrice(price);
    setQuantity(quantity);
  }, [cart]);

  return (
    <div className="container my-5">
      {cart?.items?.length === 0 ? (
        <div className="text-center">
          <button
            className="btn btn-success mx-2 fw-semibold fs-6"
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            onClick={() => navigate("/showproduct")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Totals Section */}
          <div className="text-center mb-4">
            <button className="btn btn-info mx-2 fw-semibold fs-6">
              Total Quantity : {quantity}
            </button>
            <button className="btn btn-info mx-2 fw-semibold fs-6">
              Total Price : ₹{price}
            </button>
            <button
              className="btn btn-danger mx-2 fw-semibold fs-6"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            {/* Proceed to Checkout */}
            <button
              className="btn btn-success mx-2 fw-semibold fs-6"
              onClick={() => navigate("/shipping")}
            >
              Proceed to Checkout
            </button>
          </div>

          {/* Cart Items */}
          {cart?.items?.map((product) => (
            <div
              key={product.productId}
              className="d-flex align-items-center justify-content-between border p-3 rounded mb-3 shadow-sm bg-light"
            >
              {/* Product Image & Details */} 
              <div className="d-flex align-items-center">
                {product.imgSrc && (
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    width="80"
                    className="rounded me-3"
                  />
                )}
                <div>
                  <h5 className="mb-1">{product.title}</h5>
                  <p className="text-muted mb-1">Price: ₹{product.price}</p>
                  <p className="text-muted mb-1">
                    Quantity: {product.quantity}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <button className="btn btn-sm btn-success mx-1" onClick={() =>
                    addToCart(
                      product.productId,
                      product.title,
                      product.price,
                      1,
                      product.imgSrc
                    )
                  }
                >
                  +
                </button>
                <button className="btn btn-sm btn-warning mx-1" onClick={() => decreaseQty(product.productId, 1)}>
                  -
                </button>

                <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => removeFromCart(product.productId)} title="Remove item" >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Cart;
