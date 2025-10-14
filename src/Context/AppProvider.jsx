import { useEffect, useState } from "react" 
import AppContext from "../Context/AppContext.jsx" 
import axios from "axios" 
import { toast, Bounce } from "react-toastify" 
import "react-toastify/dist/ReactToastify.css" 

const AppProvider = (props) => {
  // const url = "http://localhost:5000" 
  const url = "https://lee-mart-api.onrender.com" 

  const [product, setProduct] = useState([])  
  const [token, setToken] = useState("") 
  const [isAuthenticated, setIsAuthenticated] = useState(false) 
  const [reload, setReload] = useState(false) 
  const [cart, setCart] = useState({ items: [] }) 
  const [userAddress, setuserAddress] = useState([])
    const [categories, setCategories] = useState([]);

  // console.log("UA",userAddress)

  
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${url}/ecom/product/allproduct`, { headers: { "Content-Type": "application/json" }, withCredentials: true,}) 
      setProduct(res.data.aproduct) 
    } catch (err) {
      console.error("Error fetching products:", err) 
    }
  } 

  fetchProducts() 
}, [])

useEffect(() => {
  const fetchCart = async () => {                 //usercart
    try {
      const api = await axios.get(`${url}/ecom/cartroute/cartproduct`, {
        headers: { "Content-Type": "application/json",  Auth: token  }, withCredentials: true, }) 
      setCart(api.data.cart) 
      // console.log("---", api)
    } catch (error) {
      console.error("Cannot fetch cart:", error) 
    }
  } 

  if (token) fetchCart() 
}, [token, !reload]) 


useEffect(()=>{
  let myToken = localStorage.getItem("token")
  if (myToken){
    setToken(myToken)
    setIsAuthenticated(true)
  }
}, [])

useEffect(() => {
    fetchCategories();
  }, []);



  // Fetch categories
const fetchCategories = async () => {
  try {
    const res = await axios.get(`${url}/ecom/category/all`);
    if (res.data.success) {
      setCategories(res.data.categories);
    }
  } catch (err) {
    console.error("Cannot fetch categories:", err);
  }
};
  
  // Add new category
const addCategory = async (name) => {
  try {
    const res = await axios.post(`${url}/ecom/category/add`, { name });
    if (res.data.success) {
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 1500,
        theme: "colored",
        transition: Bounce,
      });
      // instantly update state so dropdown refreshes immediately
      setCategories(prev => [...prev, { name }]);
    } else {
      toast.error(res.data.message, {
        position: "top-right",
        autoClose: 1500,
        theme: "colored",
        transition: Bounce,
      });
    }
    return res.data;
  } catch (err) {
    console.error("Add category failed:", err);
    return { success: false, message: "Failed to add category" };
  }
};

  const register = async (name, email, password) => {
    const api = await axios.post(
      `${url}/ecom/user/register`,
      { name, email, password },
      { headers: { "content-type": "application/json" }, withCredentials: true, }
    ) 

    toast.success(api.data.message, { position: "top-right", autoClose: 1000, theme: "colored", transition: Bounce,
    }) 

    return api.data 
  } 

  const login = async (email, password) => {
    const api = await axios.post(
      `${url}/ecom/user/login`,
      { email, password },
      {
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      }
    ) 

    // console.log("user Login", api.data) 

    setToken(api.data.token) 
    setIsAuthenticated(true) 
    localStorage.setItem("token", api.data.token)
    localStorage.setItem("userId", api.data.user._id)
    // console.log("Token stored:", token)

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
      transition: Bounce,
    }) 

    return api.data 
  } 

const addToCart = async (productId, title, price, quantity, imgSrc) => {
  const token = localStorage.getItem("token");
  try {
    const api = await axios.post(
      `${url}/ecom/cartroute/cart`,
      { productId, title, price, quantity, imgSrc },
      {
        headers: {
          "Content-Type": "application/json",
          Auth: token,  
        },
        withCredentials: true,
      }
    );

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
      transition: Bounce,
    });

    setCart(api.data.cart);
    setReload(!reload);
  } catch (err) {
    console.error("Add to cart failed:", err);
    toast.error("Login first", {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
      transition: Bounce,
    });
  }
};



    const clearCart = async () => {
      const api = await axios.delete(`${url}/ecom/cartroute/clearcart`, {
        headers: { "content-type": "application/json",  Auth: token }, withCredentials: true,
      }) 

      toast.success(api.data.message, { position: "top-right", autoClose: 1500, theme: "dark", transition: Bounce}) 
      setCart({ items: [] }) 
      setReload(!reload) 
    } 


    const decreaseQty = async (productId, quantity) => {
      const api = await axios.post(
        `${url}/ecom/cartroute/minproduct`,
        { productId, quantity },
        {
          headers: {
            "Content-Type": "application/json",
             Auth: token
          },
          withCredentials: true,
        }
      ) 

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 800,
      theme: "colored",
      transition: Bounce,
    }) 

    setCart(api.data.cart) 
    setReload(!reload) 
  } 


  const removeFromCart = async (productId) => {
  try {
    const api = await axios.delete(
      `${url}/ecom/cartroute/removeproduct/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
           Auth: token,
        },
        withCredentials: true,
      }
    );

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
      transition: Bounce,
    });

    setCart(api.data.cart);
    setReload(!reload);
  } catch (error) {
    toast.error("Failed to remove product", {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
      transition: Bounce,
    });
    console.error("Remove product error:", error);
    // console.log("this is productid",productId)
  }
}

  const logout = () => {
    setIsAuthenticated(false) 
    setToken("") 
    localStorage.removeItem("token") 
    setCart({ items: [] }) 

    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
      transition: Bounce,
    }) 
  } 


  const shippingAddress = async(    
        uname,
        address,
        city,
        pincode,
        state,
        country,
        landmark,
        phone
  ) =>{
    const api = await axios.post(
      `${url}/ecom/myaddress/createaddress`,
      {uname, phone, pincode, state, city, address, country, landmark},
      {
        headers: {
          "content-type": "Application/json",
           Auth: token
        },
        withCredentials: true,
      }
    )
    setReload(!reload)

    toast.success(api.data.message,{
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce
    })
    return api.data
    }

    const getAddress = async ()=>{
      const api = await axios.get(`${url}/ecom/myaddress/getaddress`,{
        headers:{
          "Content-Type": "Application/json",
           Auth: token,
        },
        withCredentials: true,
      })
      setuserAddress(api.data.addresses)
      // console.log("ttt",api.data.addresses)
      // setReload(!reload);
    }

    useEffect(() => {
  if (token) {
    getAddress();   
  }
}, [token, reload]);


const uploadProduct = async (productData) => {
  try {
    const formData = new FormData();
    if (productData.prod_img) {
      formData.append("prod_img", productData.prod_img);
    }

    if (productData.prod_images && productData.prod_images.length > 0) {
      productData.prod_images.forEach((img) => {
        formData.append("prod_images", img);
      });
    }

    formData.append("prod_name", productData.prod_name);
    formData.append("prod_price", productData.prod_price);
    formData.append("prod_desc", productData.prod_desc);
    formData.append("prod_brand", productData.prod_brand);
    formData.append("prod_category", productData.prod_category);
    formData.append("discount", productData.discount);
    formData.append("about", productData.about);
    formData.append("keywords", JSON.stringify(productData.keywords));
    formData.append("fields", JSON.stringify(productData.fields));
    // formData.append("prod_img", file); // main image
    //   prod_images.forEach((img) => formData.append("prod_images", img));

    const api = await axios.post( `${url}/ecom/product/upload`, formData,
      {
        headers: { "Content-Type": "multipart/form-data", Auth: token },
        withCredentials: true,
      }
    );

    toast.success(api.data.message, {
      position: "top-right",
      autoClose: 1500,
      theme: "colored",
      transition: Bounce,
    });

    return api.data;
  } catch (error) {
    console.error("Upload product failed:", error);

    toast.error("Upload failed", {
      position: "top-right",
      autoClose: 1500,
      theme: "colored",
      transition: Bounce,
    });

    return { success: false, message: "Upload failed" };
  }
};


  return (
    <AppContext.Provider
      value={{ url, product, register, login, logout, token, isAuthenticated, setIsAuthenticated, cart, addToCart, clearCart, decreaseQty, removeFromCart, shippingAddress, getAddress, userAddress, uploadProduct, categories, fetchCategories, addCategory }}
    >
      {props.children}
    </AppContext.Provider>
  ) 
} 

export default AppProvider 
