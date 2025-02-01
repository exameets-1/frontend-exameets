import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, clearAllUserErrors, getUser } from "../../store/slices/userSlice";
import { LuMoveRight } from "react-icons/lu";
import { FaUser, FaEdit, FaKey, FaSignOutAlt, FaTrash } from "react-icons/fa";
import MyProfile from "../../components/MyProfile/MyProfile";
import UpdateProfile from "../../components/UpdateProfile/UpdateProfile";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import DeleteAccount from "../../components/DeleteAccount/DeleteAccount";
import './Dashboard.css';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("My Profile");

  const { loading, isAuthenticated, error, user } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeComponent]);

  useEffect(() => {
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
    <div className="user-dashboard">
      <div className="user-dashboard-container">
        <div className="user-dashboard-header">
          <h1>Dashboard</h1>
          <p>
            Welcome, <span>{user && user.name}</span>!
          </p>
        </div>

        <div className="user-dashboard-content">
          <div className={`user-sidebar ${isMenuOpen ? "menu-visible" : ""}`}>
            <h4>Manage Account</h4>
            <div className="user-sidebar-links">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveComponent(item.component);
                    setIsMenuOpen(false);
                  }}
                  className={`user-sidebar-link ${
                    activeComponent === item.component ? "link-active" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="user-sidebar-link user-logout-button"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
              <button
                onClick={() => {
                  setActiveComponent("Delete Account");
                  setIsMenuOpen(false);
                }}
                className="user-sidebar-link user-delete-button"
              >
                <FaTrash />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

          <div className="user-content-area">
            <div className="user-sidebar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <LuMoveRight className={isMenuOpen ? "menu-rotated" : ""} />
            </div>
            <div className="user-content-header">
              <h2>{activeComponent}</h2>
            </div>
            {(() => {
              switch (activeComponent) {
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