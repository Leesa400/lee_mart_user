import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import RelatedProduct from "./RelatedProduct";
import AppContext from "../Context/AppContext";

const ProductDetail = () => {
  const { id } = useParams();
  // const url = "http://localhost:5000";
    const url = "https://lee-mart-api.onrender.com" 

  const IMG_URL = "http://localhost:5000/uploads/";
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(""); // 👈 current main image
  const { addToCart } = useContext(AppContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const api = await axios.get(`${url}/ecom/product/singleproduct/${id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const fetched = api.data.aproduct;
        setProduct(fetched);

        // set default main image
        if (fetched?.prod_img) {
          setMainImage(`${IMG_URL}${fetched.prod_img}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">No product found</div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container mt-5">
        <div className="card mb-3 border-0">
          <div className="row g-0">
            {/* Left side - Product Images */}
            <div className="col-md-5 text-center">
              {/* Main Image */}
              <img
                src={mainImage || "/no-image.png"}
                alt={product.prod_name}
                className="img-fluid rounded mb-3"
                style={{ objectFit: "cover", width: "100%", height: "350px" }}
              />

              {/* Thumbnails */}
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {/* Show main image also as thumbnail */}
                {product.prod_img && (
                  <img
                    src={`${IMG_URL}${product.prod_img}`}
                    alt="Main"
                    className="img-thumbnail"
                    style={{
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                    onClick={() => setMainImage(`${IMG_URL}${product.prod_img}`)}
                  />
                )}

                {/* Multiple product images */}
                {product.prod_images?.map((img, i) => (
                  <img
                    key={i}
                    src={`${IMG_URL}${img}`}
                    alt={`thumb-${i}`}
                    className="img-thumbnail"
                    style={{
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                    onClick={() => setMainImage(`${IMG_URL}${img}`)}
                  />
                ))}
              </div>
            </div>

            {/* Right side - Product Info */}
            <div className="col-md-7">
              <div className="card-body">
                <h2 className="card-title">{product.prod_name}</h2>
                <h5 className="card-subtitle mb-2 text-muted">
                  {product.prod_brand}
                </h5>

                <p className="card-text">{product.prod_desc}</p>
                <h4 className="text-success">₹ {product.prod_price}</h4>

                <button
                  className="btn btn-primary mt-3"
                  onClick={() =>
                    addToCart(
                      product._id,
                      product.prod_name,
                      product.prod_price,
                      1,
                      mainImage
                    )
                  }
                >
                  Add to Cart
                </button>

                <Link
                  to="/showproducts"
                  className="btn btn-outline-secondary mt-3 ms-2"
                >
                  Go Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProduct
        category={product.prod_category}
        currentProductId={product._id}
      />
    </div>
  );
};

export default ProductDetail;
