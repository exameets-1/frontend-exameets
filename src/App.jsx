/* eslint-disable react-refresh/only-export-components */
import { useEffect, createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import Cookies from 'js-cookie';
import { init } from '@emailjs/browser';

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice";

import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import Community from "./components/Community/Community";

import AboutUs from "./components/About/AboutUs";
import ContactUs from "./components/ContactUs/ContactUs";

import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./components/JobDetails/JobDetails";

import GovtJobs from "./pages/GovtJobs/GovtJobs";
import GovtJobDetails from "./components/JobDetails/GovtJobDetails";

import PreviousYear from "./pages/PreviousYear/PreviousYear";
import SubjectPapers from "./components/SubjectPapers";
import YearPapers from "./components/YearPapers";

import Internships from "./pages/Internships/Internships";
import InternshipDetails from "./components/InternshipDetails/InternshipDetails";

import Admissions from "./pages/Admissions/Admissions";
import AdmissionDetails from "./components/AdmissionDetails/AdmissionDetails";

import Team from "./pages/Teams/Teams";
import TeamDetails from "./components/TeamDetails/TeamDetails";

import EmployeesPage from "./pages/Employees/Employees";
import EmployeeDetails from "./components/EmployeeDetails/EmployeeDetails";

import Scholarships from "./pages/Scholarships/Scholarships";
import ScholarshipDetails from "./components/ScholarshipDetails/ScholarshipDetails";

import Results from "./pages/Results/Results";
import ResultDetails from "./components/ResultDetails/ResultDetails";

import AdmitCard from "./pages/AdmitCard/AdmitCard";
import AdmitCardDetails from "./components/AdmitCardDetails/AdmitCardDetails";

import WhatsNew from "./pages/WhatsNew/WhatsNew";

import SelectedJobs from "./pages/SelectedJobs/SelectedJobs";

import SocialModal from "./components/SocialModal";
import ProtectedRoute from "./components/ProtectedRoute";

import Tasks from "./pages/Tasks/Tasks";
import ViewUserTasks from "./pages/ViewUserTasks/ViewUserTasks";

// Create ThemeContext
export const ThemeContext = createContext();

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Initialize EmailJS
init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    const hasConsent = Cookies.get("exameets-consent") === "true";
    
    if (window.gtag && hasConsent) {
      window.gtag("event", "page_view", {
        page_path: location.pathname,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
};

// Component to conditionally render Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/login';

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

function App() {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleOnline = () => {
      toast.success("Connection is restored!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          background: "#065f46",
          color: "#fff",
        },
        icon: "🌐",
      });
    };

    const handleOffline = () => {
      toast.error("You are offline!", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          background: "#7f1d1d",
          color: "#fff",
        },
        icon: "📡",
      });
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [darkMode]);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Router>
          <TrackPageView />
          <AppLayout>
            <Routes>
              {/* Public route - only login is accessible */}
              <Route path="/login" element={<Login />} />
              
              {/* Home route - special handling */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              
              {/* All other routes are protected */}
              <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
              <Route path="/job/get/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
              
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
              <Route path="/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />

              <Route path="/internships" element={<ProtectedRoute><Internships /></ProtectedRoute>} />
              <Route path="/internship/get/:id" element={<ProtectedRoute><InternshipDetails /></ProtectedRoute>} />

              <Route path="/admissions" element={<ProtectedRoute><Admissions /></ProtectedRoute>} />
              <Route path="/admission/get/:id" element={<ProtectedRoute><AdmissionDetails /></ProtectedRoute>} />

              <Route path="/admitcards" element={<ProtectedRoute><AdmitCard /></ProtectedRoute>} />
              <Route path="/admitcards/get/:id" element={<ProtectedRoute><AdmitCardDetails /></ProtectedRoute>} />

              <Route path="/about-us" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />

              <Route path="/papers" element={<ProtectedRoute><PreviousYear /></ProtectedRoute>} />
              <Route path="/papers/:subjectSlug" element={<ProtectedRoute><SubjectPapers /></ProtectedRoute>} />
              <Route path="/papers/:subjectSlug/:year" element={<ProtectedRoute><YearPapers /></ProtectedRoute>} />
              
              <Route path="/govtjobs" element={<ProtectedRoute><GovtJobs /></ProtectedRoute>} />
              <Route path="/govtjob/get/:id" element={<ProtectedRoute><GovtJobDetails /></ProtectedRoute>} />

              <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
              <Route path="/team/get/:id" element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />

              <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
              <Route path="/emp/get/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />

              <Route path="/scholarships" element={<ProtectedRoute><Scholarships /></ProtectedRoute>} />
              <Route path="/scholarship/get/:id" element={<ProtectedRoute><ScholarshipDetails /></ProtectedRoute>} />

              <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/results/get/:id" element={<ProtectedRoute><ResultDetails /></ProtectedRoute>} />
              <Route path="/whatsnew" element={<ProtectedRoute><WhatsNew /></ProtectedRoute>} />

              <Route path="/selected-jobs" element={<ProtectedRoute><SelectedJobs /></ProtectedRoute>} />

              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/tasks/view/:userId" element={<ProtectedRoute><ViewUserTasks /></ProtectedRoute>} />

              {/* 404 - also protected */}
              <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            </Routes>
          </AppLayout>
          <ToastContainer
            position="top-right"
            theme="light"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <CookieConsent
            location="bottom"
            buttonText="Accept"
            cookieName="exameetsCookieConsent"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
            expires={150}
            onAccept={() => {
              Cookies.set('cookieConsent', true, { expires: 150 });
            }}
          >
            This website uses cookies to enhance the user experience.{" "}
            <span style={{ fontSize: "10px" }}>
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              apply.
            </span>
          </CookieConsent>
          <SocialModal />
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
export { useTheme };