import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Context/AppContext.jsx";

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "15px" }}>
        <h3 className="text-center mb-4">Welcome Back</h3>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label fw-semibold">
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              name="email"
              placeholder="Enter your email"
              onChange={onChangeHandler}
              value={email}
              id="loginEmail"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              name="password"
              placeholder="Enter your password"
              onChange={onChangeHandler}
              value={password}
              id="loginPassword"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            style={{ borderRadius: "10px" }}
          >
            Login
          </button>
        </form>
        <p className="text-center mt-3 mb-0 text-muted">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#0d6efd", cursor: "pointer" }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
