import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Secret from "./pages/Secret"
import Home from "./pages/Home"
import Edit from "./pages/Edit"






import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route  exact path="/register" element={<Register/>} />
      <Route  exact path="/login" element={<Login/>} />

      <Route  exact path="/profile/:id" element={<Secret/>} />
      <Route  exact path="/edit" element={<Edit/>} />





      



    </Routes>
    
    </BrowserRouter>
  )
}
