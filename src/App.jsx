import '../src/App.css'
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AppProvider from './Context/AppProvider.jsx'
import Home from '../src/Component/ShowProduct.jsx'
import Nav from '../src/Component/Nav.jsx'
import ProductDetail from './Component/ProductDetail.jsx'
import Login from './Component/user/Login.jsx'
import Register from './Component/user/Register.jsx'
import Cart from './Component/Cart.jsx'
import Address from './Component/Address.jsx'
import Checkout from './Component/Checkout.jsx'
import ShowProduct from '../src/Component/ShowProduct.jsx'
import ProductForm from './Component/ProductForm.jsx'
// import About from './Component/About'

function App() {
  return (
    <AppProvider>
      <div className="d-flex flex-column min-vh-100">
        <BrowserRouter>
          <Nav />   
          <ToastContainer />
          <main className="flex-grow-1">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/showproduct' element={<ShowProduct />} />
              <Route path='/Login' element={<Login />} />
              <Route path='/Register' element={<Register />} />
              <Route path='/productdetail/:id' element={<ProductDetail />} />
              <Route path='/cart' element={<Cart/>} />
              <Route path='/shipping' element={<Address/>} />
              <Route path='/checkout' element={<Checkout/>} />
              <Route path='/productform' element={<ProductForm/>} />
              {/* <Route path='/About' element={<About />} /> */}
            </Routes>
          </main>
          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </AppProvider>
  )
}

export default App
