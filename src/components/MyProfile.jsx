import { useSelector } from "react-redux";
import "./DashboardComponents.css";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

  const profileFields = [
    { label: "Full Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone },
    { label: "Date of Birth", value: new Date(user?.dob).toLocaleDateString() },
    { label: "Gender", value: user?.gender },
    { label: "Joined", value: new Date(user?.createdAt).toLocaleDateString() }
  ];

  return (
    <div className="profile-container">
      <div className="profile-info">
        {profileFields.map((field, index) => (
          <div key={index} className="profile-info-item">
            <div className="profile-info-label">{field.label}</div>
            <div className="profile-info-value">{field.value || "Not provided"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;