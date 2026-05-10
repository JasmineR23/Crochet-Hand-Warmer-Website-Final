import React, { useState } from "react";
import "./Profile.css";
import profile_template from "../../assets/profile_template.png";
import axios from "axios";

const Profile = ({ currentUser, setCurrentUser }) => {

  const [preview, setPreview] = useState(
    currentUser?.profileImage
      ? `http://localhost:4000/uploads/${currentUser.profileImage}`
      : null
  );

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;


    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:4000/api/user/profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const filename = res.data.profileImage;

      setCurrentUser((prev) => ({
        ...prev,
        profileImage: filename
      }));

    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please log in again.");
    }
  };

  const finalImageSrc =
    preview ||
    (currentUser?.profileImage
      ? `http://localhost:4000/uploads/${currentUser.profileImage}`
      : profile_template);

  return (
    <div className="profile">
      <div className="right-panel">
        <img className="profile-image" src={finalImageSrc} alt="profile" />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="left-panel"></div>
    </div>
  );
};

export default Profile;
