import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../Context/AppContext'
import { Link, useParams } from 'react-router-dom'

const SearchProduct = () => {
    const { product } = useContext(AppContext)
    const [SearchProduct, setSearchProduct] = useState([])

    const {item} = useParams()


    useEffect(()=>{
        setSearchProduct(
            product.filter(
            (data) => data?.prod_name?.toLowerCase().includes(item.toLowerCase())      
          )
        )
    }, [item, product])


  return (
    <>
       <div className="container">
             {SearchProduct.map((product) => (
               <div className="col-md-4 mb-4" key={product._id}>
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h2 className="card-title">{product.prod_name}</h2>
                      <h6 className="card-subtitle mb-2 text-muted">{product.prod_brand}</h6>
                      <p className="card-text mb-1">
                        <strong>Price:</strong> ₹ {product.prod_price}
                      </p>
                      <p className="card-text">
                        <strong>Description:</strong> {product.prod_desc}
                      </p>
                      <div className="mt-auto">
                        <Link to={`/productdetail/${product._id}`} className="btn btn-primary btn-sm">View Details</Link>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
        </div>  
    </>
  )
}

export default SearchProduct
