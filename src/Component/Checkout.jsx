import React, { useContext, useEffect, useState } from "react";
import AppContext from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { cart, userAddress = [], url, clearCart, addToCart, decreaseQty } =
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
        price += Number(cart.items[i].price) * cart.items[i].quantity;
      }
    }
    setPrice(price);
    setQty(qty);
  }, [cart]);
console.log(cart?.items);

const handlePayment = async () => {
  try {
    // Create Razorpay order on backend
    const orderResponse = await axios.post(`${url}/ecom/payment/checkout`, {
      amount: price,           // total price in rupees
      cartItems: cart?.items,  // send cart items
      userShipping: userAddress[0], // first address
      userId: localStorage.getItem("userId"),
    });

    const { orderId, amountInPaise } = orderResponse.data;
    console.log("Order created:", orderResponse.data);

    // Razorpay options
    const options = {
      key: "rzp_test_RIBdY6juKIyFIQ",
      amount: amountInPaise, // paise
      currency: "INR",
      order_id: orderId,
      name: "Lee Mart",
      description: "Lee Mart Order",

      // Payment completion handler
      handler: function (response) {
        (async () => {
          try {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: price,            // send in rupees
              orderItems: cart?.items,
              userShipping: userAddress[0],
              userId: localStorage.getItem("userId"),
            };

            console.log("Verifying payment with backend:", paymentData);

            const api = await axios.post(`${url}/ecom/payment/verify-payment`, paymentData);
            console.log("payment api", api)
            if (api.data.success) {

              console.log("Payment saved in DB:", api.data.orderConfirm);
              clearCart(); // clear cart only after saving
              navigate("/orderconfirmation");
            } else {
              console.error("Payment verification failed:", api.data);
              alert("Payment verification failed! Check console.");
            }
          } catch (err) {
            console.error("Error in verifying payment:", err);
            alert("Payment verification error! Check console.");
          }
        })();
      },

      prefill: {
        name: "Lee Mart User",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: { color: "#227669ff" },
    };

    // 4️ Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment initiation failed:", error);
    alert("Payment initiation failed! Check console.");
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
