import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RelatedProduct = ({ category, currentProductId }) => {
  const [related, setRelated] = useState([]);
  // const url = "http://localhost:5000";
    const url = "https://lee-mart-api.onrender.com" 

  const IMG_URL = "http://localhost:5000/uploads/";

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`${url}/ecom/product/allproduct?category=${category}`);
        if (res.data.aproduct) {
          // filter out current product
          const filtered = res.data.aproduct.filter(
            (item) => item._id !== currentProductId
          );
          setRelated(filtered);
        }
      } catch (err) {
        console.error("Error fetching related products", err);
      }
    };
    fetchRelated();
  }, [category, currentProductId]);

  if (related.length === 0) {
    return <p className="mt-4 text-muted">No related products found.</p>;
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Related Products</h3>
      <div className="row">
        {related.map((pro) => (
          <div className="col-md-3 mb-4" key={pro._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={pro.prod_img ? `${IMG_URL}${pro.prod_img}` : "/no-image.png"}
                alt={pro.prod_name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{pro.prod_name}</h5>
                <p className="card-text text-muted">{pro.prod_brand}</p>
                <Link
                  to={`/productdetail/${pro._id}`}
                  className="btn btn-sm btn-primary w-100"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
