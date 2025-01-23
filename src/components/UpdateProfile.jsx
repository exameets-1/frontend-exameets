import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/updateProfileSlice";
import { getUser } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import "./DashboardComponents.css";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { loading: updateLoading } = useSelector((state) => state.updateProfile);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: ""
  });

  // Load user data when component mounts
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        gender: user.gender || ""
      });
    }
  }, [user]);

  // Read-only fields
  const email = user?.email || "";
  const phone = user?.phone || "";

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only include changed fields in the update
    const updatedData = {};
    if (formData.name !== user.name) updatedData.name = formData.name;
    if (formData.dob !== (user.dob ? new Date(user.dob).toISOString().split('T')[0] : "")) updatedData.dob = formData.dob;
    if (formData.gender !== user.gender) updatedData.gender = formData.gender;

    // Only proceed if there are changes
    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes to update");
      return;
    }

    try {
      await dispatch(updateProfile(updatedData)).unwrap();
      toast.success("Profile updated successfully!");
      // Refresh user data
      dispatch(getUser());
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-section">
        <div className="profile-field">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            minLength={3}
            maxLength={30}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="action-buttons">
          <button
            type="submit"
            className="submit-button"
            disabled={loading || updateLoading}
          >
            {updateLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;