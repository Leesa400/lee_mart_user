import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


const Address = () => {
  const { shippingAddress, userAddress, getAddress } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uname: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    landmark: "",
    phone: "",
  });

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    if (userAddress && userAddress.length > 0) {
      setFormData({
        uname: userAddress[0].uname || "",
        address: userAddress[0].address || "",
        city: userAddress[0].city || "",
        pincode: userAddress[0].pincode || "",
        state: userAddress[0].state || "",
        country: userAddress[0].country || "",
        landmark: userAddress[0].landmark || "",
        phone: userAddress[0].phone || "",
      });
    }
  }, [userAddress]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { uname, phone, pincode, state, city, address, country, landmark } =
    formData;

  const submitHandler = async (e) => {
    e.preventDefault();

    const result = await shippingAddress( uname, address, city, pincode, state, country, landmark, phone );
    console.log("Address created", result);

    if (result.success) {
      navigate("/checkout");
    }
  };

  return (
    <div className="container my-3 p-3">
      <h2 className="text-center mb-4">Shipping Address</h2>
      <form onSubmit={submitHandler}>
        <div className="row g-3">
          <div className="col-md-4">
            <input type="text" name="uname" value={uname} onChange={onChangeHandler} placeholder="Full Name" required className="form-control custom-input" />
          </div>

          <div className="col-md-4">
            <input type="text" name="phone" value={phone} onChange={onChangeHandler} placeholder="Phone Number" required className="form-control custom-input" />
          </div>

          <div className="col-md-4">
            <input type="text" name="pincode" value={pincode} onChange={onChangeHandler} placeholder="Pincode" required className="form-control custom-input" />
          </div>

          <div className="col-md-4">
            <input type="text" name="state" value={state} onChange={onChangeHandler} placeholder="State" required className="form-control custom-input" />
          </div>

          <div className="col-md-4">
            <input type="text" name="city" value={city} onChange={onChangeHandler} placeholder="City" required className="form-control custom-input" />
          </div>

          <div className="col-md-4">
            <input type="text" name="country" value={country} onChange={onChangeHandler} placeholder="Country" required className="form-control custom-input" />
          </div>

          <div className="col-md-6">
            <input type="text" name="landmark" value={landmark} onChange={onChangeHandler} placeholder="Landmark" className="form-control custom-input" />
          </div>

          <div className="col-md-6">
            <textarea name="address" value={address} onChange={onChangeHandler} placeholder="Full Address" required rows="3" className="form-control custom-input" ></textarea>
          </div>

        </div>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <button type="submit" className="btn btn-success">
            Add as new Address
          </button>
          {userAddress && userAddress.length > 0 && (
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/checkout")} >
              Use old address
            </button>
          )}
        </div>
      </form>

      <style>{`
        .custom-input {
          margin: 5px 0;
          transition: 0.3s;
        }
        .custom-input:hover {
          background-color: #e6f0ff;
        }
        .custom-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
        }
      `}</style>
    </div>
  );
};

export default Address;
