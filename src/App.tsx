import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./features/products/Home"
import ShopPage from "./features/products/ShopPage"
import ProductPage from "./features/products/ProductPage"
import CartPage from "./features/cart/CartPage"
import Layout from "./Layout/Layout"
import { CartProvider } from './features/cart/CartContext'
import CheckoutPage from './features/checkout/checkoutPage'
import { ProtectedRoute } from './features/auth/protectedRoute'

function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:shopId" element={<ShopPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </CartProvider>
  )
}

export default App
