import React, { useContext, useState } from "react";
import AppContext from "../../Context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = formData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);

    if (result.success) {
      navigate("/login");
    }
    console.log(formData);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4">Create an Account ✨</h3>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="registerName" className="form-label fw-semibold">
              Full Name
            </label>
            <input
              id="registerName"
              type="text"
              name="name"
              className="form-control form-control-lg"
              placeholder="Enter your full name"
              value={name}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="registerEmail" className="form-label fw-semibold">
              Email Address
            </label>
            <input
              id="registerEmail"
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={email}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="registerPassword"
              className="form-label fw-semibold"
            >
              Password
            </label>
            <input
              id="registerPassword"
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Create a password"
              value={password}
              onChange={onChangeHandler}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 py-2"
            style={{ borderRadius: "10px" }}
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3 mb-0 text-muted">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#0d6efd", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
