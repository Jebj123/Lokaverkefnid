import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "../src/Pages/Home"
import Layout from "./Layout/Layout"

function App() {
  return (
    <>
    <BrowserRouter>
    <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    </Layout>
    </BrowserRouter>
    </>
  )
}

export default App
