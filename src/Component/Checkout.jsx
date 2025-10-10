import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { cart, userAddress, url, clearCart, addToCart, decreaseQty } =
    useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let qty = 0;
    let price = 0;
    if (cart?.items) {
      for (let i = 0; i < cart.items.length; i++) {
        qty += cart.items[i].quantity;
        // price += cart.items[i].price * cart.items[i].quantity;
        // price += Number(cart.items[i].price) * cart.items[i].quantity;
        const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);


      }
    }
    setPrice(price);
    setQty(qty);
  }, [cart]);
console.log(cart.items);

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(`${url}/ecom/payment/checkout`, {
        amount: price,
      });

      const { orderId, amount: amountInPaise } = orderResponse.data;

      const options = {
        key: "rzp_test_RIBdY6juKIyFIQ",
        amount: amountInPaise,
        currency: "INR",
        name: "Lee Mart",
        description: "Lee Mart",
        order_id: orderId,

        handler: async function (response) {
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: amountInPaise,
            orderItems: cart?.items,
            userShipping: userAddress[0],
            userId: localStorage.getItem("userId"),
          };

          const api = await axios.post(
            `${url}/ecom/payment/verify-payment`,
            paymentData
          );

          if (api.data.success) {
            clearCart();
            navigate("/orderconfirmation");
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: "Lee Mart User",
          email: "user@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Order from Lee Mart",
        },
        theme: {
          color: "#227669ff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Something went wrong during payment. Please try again.");
    }
  };

  return (
    <section className="my-5">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">Checkout</h2>

        <div className="row">
          {/* Left Column: Cart + Order Summary */}
          <div className="col-md-8">
            <div className="bg-white shadow rounded p-3 mb-4 overflow-auto">
              <h4 className="mb-3">Your Cart</h4>
              {cart?.items?.length > 0 ? (
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((product, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{product.title}</td>
                        <td>₹{product.price}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning mx-1"
                            onClick={() => decreaseQty(product.productId, 1)}
                          >
                            -
                          </button>
                          {product.quantity}
                          <button
                            className="btn btn-sm btn-warning mx-1"
                            onClick={() =>
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
                        </td>
                        <td>₹{product.quantity * product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Your cart is empty</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow rounded p-3 mb-4">
              <h4 className="mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Items:</span>
                <span>{qty}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total Price:</span>
                <span>₹{price}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Shipping Address */}
          <div className="col-md-4 mt-3 mt-md-0">
            <div className="bg-light shadow rounded p-4" style={{ minHeight: "400px" }}>
              <h4 className="mb-3">Shipping Address</h4>
              {userAddress && userAddress.length > 0 ? (
                userAddress.map((addr, idx) => (
                  <div key={idx} className="border p-3 rounded mb-3 bg-white">
                    <p><strong>Name:</strong> {addr.uname}</p>
                    <p>
                      <strong>Address:</strong> {addr.address}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                    </p>
                    <p><strong>Phone:</strong> {addr.phone}</p>
                  </div>
                ))
              ) : (
                <p>
                  No address found.{" "}
                  <span
                    onClick={() => navigate("/address")}
                    className="text-primary text-decoration-underline"
                    style={{ cursor: "pointer" }}
                  >
                    Add Address
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="text-center mt-4">
          <button
            onClick={handlePayment}
            disabled={!cart?.items?.length || !userAddress?.length}
            className="btn btn-danger btn-lg"
          >
            Place Order
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
