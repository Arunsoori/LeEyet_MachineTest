import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import axios from "axios"

export default function Login() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    name: "",
    password: "",
  })

  const generateError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    })



  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("http://localhost:4000/login",
        {
          ...values,
        }, {
        withCredentials: true,

      })

      if (data) {
        if (data.errors) {
          const { name, password } = data.errors;
          if (name) generateError(name);
          else if (password) generateError(password)
        }
        else {
          navigate(`/profile/${data.user}`)
        }
      }
    }
    catch (err) {
      // console.log(err);
    }
  }


  return (
    <div className="container"  >
      <h2>Login</h2>
      <form onSubmit={(e) => handleSubmit(e)} >
        <div>
          <label htmlFor="name">Username</label>
          <input type="name" name="name" placeholder="name" onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="passsword" name="password" placeholder="Password" onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} />
        </div>
        <button type="submit" > Submit</button>
        <span>
          Already have an acount? <Link to="/register">Register</Link>
        </span>


      </form>
      <ToastContainer />

    </div>
  )
}
