import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Link, link } from 'react-router-dom'
import { setUserDetails } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'



import axios from "axios"

function Home() {
  const [usersData, setUsersData] = useState()
  const [cookies, setCookie, removeCookie] = useCookies([])
  const navigate = useNavigate()


  const dispatch = useDispatch()



  async function getUserData() {

    const { data } = await axios.get("http://localhost:4000/admin")
    const userdatas = data.userData

    if (!data.status) {
      removeCookie("Ajwt")
      navigate("/adminlogin")
    }

    if (data.status === '201' || data) {
      console.log("A");
      setUsersData(userdatas)
    }
    if (!data || data.status === '422')
      toast("Something went wrong")

  }


  useEffect(() => {


    getUserData()



    const verifyAdmin = async () => {

      console.log(cookies.Ajwt);
      if (!cookies.Ajwt)
        navigate("/admin/login")

      else {
        console.log("unddddddddddd");

        const { data } = await axios.post("http://localhost:4000/admin/checkadmin", {}, { withCredentials: true })

        console.log(data);
        if (!data.status) {
          removeCookie("Ajwt")
          navigate("/admin/login")
        }
        else {


          navigate('/admin')






        }


      }
    }
    verifyAdmin()

  }, [cookies, removeCookie, navigate])

  async function deleteUser(id) {
    console.log("delete in");
    const { data } = await axios.post(`http://localhost:4000/admin/deleteuser/${id}`)

    console.log(data, "dataaaaaaaaaaaaaa");
    getUserData()


  }
  const logOut = () => {
    removeCookie("Ajwt")


    navigate("/admin/login")
  }




  return (
    <div>
      <table class="table" style={{ position: "absolute", top: "0", left: "0" }}>
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Email</th>
            <th scope="col">Name</th>
            <th scope="col">edit</th>
            <th scope="col">delete</th>
            <Link to='/admin/adduser'> <button className='btn-success' > Add user</button></Link>
            <button onClick={logOut} className='btn-success' > logout</button>



          </tr>
        </thead>
        <tbody>
          {
            usersData && usersData.map((user, id) => {
              return (
                <tr key={id}>
                  <th scope="row">{id + 1}</th>
                  <td>{user.email}</td>
                  <td>{user.name}</td>

                  <td><Link to='/admin/edit'><button onClick={() => {
                    dispatch(setUserDetails({
                      id: user._id,
                      name: user.name,
                      email: user.email
                    }))

                  }}> Edit user</button></Link>  </td>
                  <td><button onClick={() => deleteUser(user._id)}   > Delete</button></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

    </div>
  )
}

export default Home
