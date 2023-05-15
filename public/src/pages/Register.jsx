import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function Register(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({
    name: "",
    address: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(
    "https://www.w3schools.com/howto/img_avatar2.png"
  );
  const [editImage, setEditImage] = useState(null);

  const generateError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    });

  // function handleClick() {
  //   if (location.pathname === '/admin') {
  //     console.log("pipipipipi");
  //     navigate('/admin');
  //   } else {
  //     navigate('/');
  //   }
  // }
  function upload(e) {
    let testing = e.target.files[0];
    setEditImage(testing);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editImage) {
        toast("please insert an image");
      }
      const formData = new FormData();
      formData.append("image", editImage);
      formData.append("name", values.name);
      formData.append("address", values.address);
      formData.append("password", values.password);

      const { data } = await axios.post(
        "http://localhost:4000/register",
        formData,
        {
          withCredentials: true,
        }
      );

      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          console.log(data)
          navigate(`/profile/${data.user}`);

        }
      }
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className="container">
      <h2>Register Account</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="mail">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="mail">Address</label>
          <input
            type="address"
            name="address"
            placeholder="address"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="passsword"
            name="password"
            placeholder="Password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          />
        </div>
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
        <button type="submit"> Submit</button>
        <span>
          Already have an acount? <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}
