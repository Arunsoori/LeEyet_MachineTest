import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"
import './Secret.css'



export default function Secret() {
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies([])
  const [editImage, setEditImage] = useState(null)
  const [user, setUser] = useState(null)
  const [profilePic, setProfilePic] = useState(null)


  const { id } = useParams();
  useEffect(() => {

    console.log("jjjjjjjjjjjjjjjjjj");

    const verifyUser = async () => {


      if (!cookies.jwt)
        navigate("/login")

      else {
        console.log("und");

        const { data } = await axios.post("http://localhost:4000", {userID:id}, { withCredentials: true })
        // console.log(data, "dtaaaaaaa")
        console.log( "dtaaaaaaa")
        if (!data.status) {
          removeCookie("jwt")
          navigate("/login")
        }
        else {
          let userDetails = { ...data }
          console.log(userDetails, "userdetails");
          let profilePic = userDetails.image ? `http://localhost:4000/${userDetails.image}` : "https://www.w3schools.com/howto/img_avatar2.png"
          console.log(profilePic, "proffilepic");
          setProfilePic(profilePic)
          setUser(userDetails)


        }


      }
    }
    verifyUser()
  }, [cookies, navigate, removeCookie, profilePic])



  const logOut = () => {
    removeCookie("jwt")
    navigate("/register")
  }
  function upload(e) {
    let testing = e.target.files[0]
    setEditImage(testing)
  }
  function uploadImage() {
    if (!editImage) {
      toast("please insert an image")
    }
    const formData = new FormData()
    formData.append('image', editImage)
    axios.post("http://localhost:4000/uploadimage", formData, { withCredentials: true })
      .then((data) => {

        // console.log(data,"popopopo");
        let userDetails = { ...data.data }
        // console.log(userDetails,"userdetails");
        let dp = userDetails.image
        // console.log(dp);
        setProfilePic(dp)
        setEditImage(null)
        toast("Image uploaded succesfuly", { position: 'top-center' })

      })

  }



  return (
    // <>
    // <div className='private'>
    //   <h1> Super Secret Page</h1>
    //   <button onClick={logOut} >Logout</button>
    //   </div>

    //   <ToastContainer/>
    //   </>

    <div className="border p-5 bg-secondary, userbody">

     {user ?<>
      <div className="d-flex justify-content-center mb-4">
        <div style={{ position: "relative" }} className=" rounded-cirlce">
          <img src={editImage ? URL.createObjectURL(editImage) : profilePic} alt="" width={150} height={150} className="picture" />
          <label htmlFor="camera-upload" className="camera-upload-label">
            <i className="fa fa-image" aria-hidden="true" ></i>
          </label>
          <input type="file" onChange={upload} id="camera-upload" className="camera-upload-input" accept="image/*;capture=camera" />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        {editImage ? <button onClick={uploadImage}>Save Image</button> : ""}
      </div>

      <div className="d-flex flex-column mb-3" >
        {user?.name}
        {user ? <input type="text" value={`${user.name}`}  className='bg-white' placeholder='Name' /> : ""}
      </div>
      <div className="d-flex flex-column mb-3" >
        {user ? <input type="text" value={`${user.address}`}  className='bg-white' placeholder='address' /> : ""}
      </div>
  
       <div>
        <button onClick={()=> navigate("/edit")}>edit</button>
       </div>
      <div style={{ textAlign: 'center' }}>  <button onClick={logOut}>Log out</button></div>
     </> :""}
      <ToastContainer />
    </div>

  )
}
