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
        price += cart.items[i].price * cart.items[i].quantity;
      }
    }
    setPrice(price);
    setQty(qty);
  }, [cart]);

  const handlePayment = async () => {
    try {
      // ✅ step 1: only send amount to backend
      const orderResponse = await axios.post(`${url}/ecom/payment/checkout`, {
        amount: price,
      });

      const { orderId, amountInPaise } = orderResponse.data;

      const options = {
        key: "rzp_test_RIBdY6juKIyFIQ", // test key
        amount: amountInPaise,
        currency: "INR",
        name: "Lee Mart",
        description: "Lee Mart Order",
        order_id: orderId,

        handler: async function (response) {
          // ✅ step 2: verify payment and save order
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: amountInPaise,
            orderItems: cart?.items,
            userShipping: userAddress[0], // taking first address
          };

          const api = await axios.post(`${url}/ecom/payment/verify-payment`, paymentData);

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
    <section>
      <div className="m-5 p-3">
        <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

          {/* Cart Table */}
          <div className="bg-white shadow rounded-lg p-4 mb-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-3">Your Cart</h3>
            {cart?.items?.length > 0 ? (
              <table className="w-full border border-gray-200 text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 border">#</th>
                    <th className="py-2 px-3 border">Product</th>
                    <th className="py-2 px-3 border">Price</th>
                    <th className="py-2 px-3 border">Quantity</th>
                    <th className="py-2 px-3 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border">{idx + 1}</td>
                      <td className="py-2 px-3 border">{product.title}</td>
                      <td className="py-2 px-3 border">₹{product.price}</td>
                      <td className="py-2 px-3 border">
                        <button
                          className="btn btn-sm btn-warning mx-2"
                          onClick={() => decreaseQty(product.productId, 1)}
                        >
                          -
                        </button>
                        {product.quantity}
                        <button
                          className="btn btn-sm btn-warning mx-2"
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
                      <td className="py-2 px-3 border font-semibold">
                        ₹{product.quantity * product.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">Your cart is empty</p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>

            {userAddress && userAddress.length > 0 ? (
              userAddress.map((addr, idx) => (
                <div
                  key={idx}
                  className="border p-3 rounded bg-gray-50 mb-3"
                >
                  <p>
                    <strong>Name:</strong> {addr.uname}
                  </p>
                  <p>
                    <strong>Address:</strong> {addr.address}, {addr.city},{" "}
                    {addr.state} - {addr.pincode}, {addr.country}
                  </p>
                  <p>
                    <strong>Phone:</strong> {addr.phone}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                No address found.{" "}
                <span
                  onClick={() => navigate("/address")}
                  className="text-blue-600 underline cursor-pointer"
                >
                  Add Address
                </span>
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span>{qty}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span>₹{price}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={!cart?.items?.length || !userAddress?.length}
              className="mt-4 w-full bg-danger text-white py-2 rounded-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
