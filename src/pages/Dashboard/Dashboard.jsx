import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, clearAllUserErrors, getUser } from "../../store/slices/userSlice";
import { LuMoveRight } from "react-icons/lu";
import { FaUser, FaEdit, FaKey, FaSignOutAlt, FaTrash } from "react-icons/fa";
import MyProfile from "../../components/MyProfile";
import UpdateProfile from "../../components/UpdateProfile";
import UpdatePassword from "../../components/UpdatePassword";
import DeleteAccount from "../../components/DeleteAccount";
import "./Dashboard.css";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [componentName, setComponentName] = useState("My Profile");

  const { loading, isAuthenticated, error, user } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [componentName]);

  useEffect(() => {
    
    // Fetch user data on mount if authenticated but no user data
    if (isAuthenticated && !user?.name) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, loading, isAuthenticated, navigateTo]);

  const menuItems = [
    { name: "My Profile", icon: <FaUser />, component: "My Profile" },
    { name: "Update Profile", icon: <FaEdit />, component: "Update Profile" },
    { name: "Update Password", icon: <FaKey />, component: "Update Password" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>
            Welcome, <span>{user && user.name}</span>!
          </p>
        </div>

        <div className="dashboard-content">
          {/* Sidebar */}
          <div className={`sidebar ${show ? "show" : ""}`}>
            <h4>Manage Account</h4>
            <div className="sidebar-links">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setComponentName(item.component);
                    setShow(false);
                  }}
                  className={`sidebar-link ${
                    componentName === item.component ? "active" : ""
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                <FaSignOutAlt /> Logout
              </button>
              <button
                onClick={() => {
                  setComponentName("Delete Account");
                  setShow(false);
                }}
                className="delete-button"
              >
                <FaTrash /> Delete Account
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="content-area">
            <div className="sidebar-toggle" onClick={() => setShow(!show)}>
              <LuMoveRight className={show ? "rotate-180" : ""} />
            </div>
            <div className="content-header">
              <h2>{componentName}</h2>
            </div>
            {(() => {
              switch (componentName) {
                case "My Profile":
                  return <MyProfile />;
                case "Update Profile":
                  return <UpdateProfile />;
                case "Update Password":
                  return <UpdatePassword />;
                case "Delete Account":
                  return <DeleteAccount />;
                default:
                  return <MyProfile />;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
