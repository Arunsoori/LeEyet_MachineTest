import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Secret.css";

export default function Secret() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [editImage, setEditImage] = useState(null);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const { id } = useParams();
  useEffect(() => {

    const verifyUser = async () => {
      if (!cookies.jwt) navigate("/login");
      else {

        const { data } = await axios.post(
          "http://localhost:4000",
          { userID: id },
          { withCredentials: true }
        );

        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          let userDetails = { ...data };
          console.log(userDetails, "userdetails");
          let profilePic = userDetails.image
            ? `http://localhost:4000/${userDetails.image}`
            : "https://www.w3schools.com/howto/img_avatar2.png";
          console.log(profilePic, "proffilepic");
          setProfilePic(profilePic);
          setUser(userDetails);
          setEditImage(userDetails.imageUrl);
        }
      }
    };
    verifyUser();
  }, [cookies, id,navigate, removeCookie, profilePic]);

  const logOut = () => {
    removeCookie("jwt");
    navigate("/register");
  };
  function upload(e) {
    let testing = e.target.files[0];
    setEditImage(testing);
  }
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (editImage) {
        formData.append("image", editImage);
      }else{
        formData.append("img", profilePic);
      }
      formData.append("id", id);
      formData.append("name", user.name);
      formData.append("address", user.address);

      const { data } = await axios.post(
        "http://localhost:4000/update",
        formData,
        {
          withCredentials: true,
        }
      );

      if (data) {
        if (data.errors) {
          toast("Some error occured");
        } 
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
 
    <div className="border p-5 bg-secondary, userbody">
      {user ? (
        <>
          <div className="d-flex justify-content-center mb-4">
            <div style={{ position: "relative" }} className=" rounded-cirlce">
              <img
                src={editImage ? URL.createObjectURL(editImage) : profilePic}
                alt=""
                width={150}
                height={150}
                className="picture"
              />
              <label htmlFor="camera-upload" className="camera-upload-label">
                <i className="fa fa-image" aria-hidden="true"></i>
              </label>
              <input
                type="file"
                onChange={upload}
                id="camera-upload"
                className="camera-upload-input"
                accept="image/*;capture=camera"
              />
            </div>
          </div>
         

          <div className="d-flex flex-column mb-3">
            {user?.name}
            {user ? (
              <input
                type="text"
                name="name"
                value={`${user.name}`}
                className="bg-white"
                placeholder="Name"
                onChange={(e) =>
                  setUser({ ...user, [e.target.name]: e.target.value })
                }
              />
            ) : (
              ""
            )}
          </div>
          <div className="d-flex flex-column mb-3">
            {user ? (
              <input
                type="text"
                value={`${user.address}`}
                className="bg-white"
                placeholder="address"
                name="address"
                onChange={(e) =>
                  setUser({ ...user, [e.target.name]: e.target.value })
                }
              />
            ) : (
              ""
            )}
          </div>

          <div>
            <button onClick={handleSubmit}>edit</button>
          </div>
          <div style={{ textAlign: "center" }}>
 
            <button onClick={logOut}>Log out</button>
          </div>
        </>
      ) : (
        ""
      )}
      <ToastContainer />
    </div>
  );
}
