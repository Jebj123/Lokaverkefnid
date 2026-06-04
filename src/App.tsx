import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./features/products/Home"
import ShopPage from "./features/products/ShopPage"
import ProductPage from "./features/products/ProductPage"
import CartPage from "./features/cart/CartPage"
import Layout from "./Components/layout/Layout"
import CheckoutPage from './features/checkout/checkoutPage'
import { ProtectedRoute } from './features/auth/protectedRoute'
import OrderCompletePage from './features/order/OrderCompletePage'
import RetroProductPage from './features/products/RetroProductPage'
import SearchResultsPage from './features/products/SearchResultsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/:shopId" element={<ShopPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/retro-product" element={<RetroProductPage />} />
        <Route path="/retro-product/:productId" element={<ProductPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-complete" element={<ProtectedRoute><OrderCompletePage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}

export default App
