import React from "react";
import { useSelector } from "react-redux";
import "./MyProfile.css";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

  const profileFields = [
    { label: "Full Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone },
    { 
      label: "Date of Birth", 
      value: user?.dob ? new Date(user.dob).toLocaleDateString() : null 
    },
    { label: "Gender", value: user?.gender },
    { 
      label: "Joined", 
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null 
    }
  ];

  return (
    <div className="profile-user-container">
      <div className="profile-user-section">
        {profileFields.map((field, index) => (
          <div key={index} className="profile-user-field">
            <div className="profile-user-label">{field.label}</div>
            <div className={`profile-user-value ${!field.value ? 'profile-user-value-empty' : ''}`}>
              {field.value || "Not provided"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;