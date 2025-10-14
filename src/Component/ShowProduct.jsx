import React, { useContext } from "react";
import AppContext from "../Context/AppContext.jsx";
import { Link } from "react-router-dom";

const ShowProduct = () => {
  const { product } = useContext(AppContext);

  // Base URL for images 
  const IMG_URL = "http://localhost:5000/uploads/";
  // const IMG_URL = "https://lee-mart-api.onrender.com/uploads/";
console.log("images",IMG_URL)
  return (
    <div className="container my-4">
      <div className="row g-4">
        {product && product.length > 0 ? (
          product.map((pro) => (
            <div className="col-md-3 d-flex" key={pro._id}>
              <div className="card h-100 shadow-sm p-3 w-100" style={{ margin: "20px" }}>
                <img
                  src={pro.prod_img ? `${IMG_URL}${pro.prod_img}` : "/no-image.png"}
                  alt={pro.prod_name}
                  className="card-img-top img-fluid"
                  style={{ height: "200px", objectFit: "cover", borderRadius: "10px" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{pro.prod_name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{pro.prod_brand}</h6>
                  <p className="card-text mb-1">
                    <strong>Price:</strong> ₹ {pro.prod_price}
                  </p>
                  <p className="card-text text-truncate" title={pro.prod_desc}>
                    <strong>Description:</strong> {pro.prod_desc}
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={`/productdetail/${pro._id}`}
                      className="btn btn-primary btn-sm w-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ShowProduct;
