import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Component/Nav.css";
// import tlogo from "../assets/image/tlogo.png";
import AppContext from "../Context/AppContext";

const Nav = () => {
  const [searchItem, setSearchItem] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, logout, cart } = useContext(AppContext);

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchItem.trim()) {
      navigate(`/search/${searchItem.trim()}`);
      setSearchItem("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Logo */}
        {/* <Link to="/" className="navbar-brand">
          <img src={tlogo} width="60" height="60" alt="Logo" className="d-inline-block align-text-top" />
        </Link> */}

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/Aboutus">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Destination">Destinations</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Culture">Culture</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Gallery">Gallery</Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/showproduct">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productform">Add Product</Link>
            </li>
            <li className="nav-item">
              <form onSubmit={submitHandler} className="d-flex align-items-center ms-3">
                <input type="text" value={searchItem} onChange={(e) => setSearchItem(e.target.value)} placeholder="Search here..." className="form-control form-control-sm me-2" />
                <button type="submit" className="btn btn-primary btn-sm">Search</button>
              </form>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="btn btn-primary position-relative mx-2">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cart?.items?.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.items.length}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="btn btn-info mx-2">Profile</Link>
                <button className="btn btn-danger mx-2" onClick={() => { logout(); navigate("/"); }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary mx-2">Login</Link>
                <Link to="/register" className="btn btn-primary mx-2">Register</Link>
              </>
            )}
            <a href="#contact" className="btn btn-outline-danger mx-2">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
