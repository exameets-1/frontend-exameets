import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/slices/updateProfileSlice";
import { getUser } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { loading: updateLoading } = useSelector((state) => state.updateProfile);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: ""
  });

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        gender: user.gender || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {};
    if (formData.name !== user.name) updatedData.name = formData.name;
    if (formData.dob !== (user.dob ? new Date(user.dob).toISOString().split('T')[0] : "")) updatedData.dob = formData.dob;
    if (formData.gender !== user.gender) updatedData.gender = formData.gender;

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes to update");
      return;
    }

    try {
      await dispatch(updateProfile(updatedData)).unwrap();
      toast.success("Profile updated successfully!");
      dispatch(getUser());
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile-card">
        <form onSubmit={handleSubmit} className="update-profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              minLength={3}
              maxLength={30}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className={`update-button ${(loading || updateLoading) ? 'loading' : ''}`}
            disabled={loading || updateLoading}
          >
            {updateLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;