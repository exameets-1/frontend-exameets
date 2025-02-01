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
import PreviousYearDetails from "./pages/PreviousYear/PreviousYearDetails";

import Internships from "./pages/Internships/Internships";
import InternshipDetails from "./components/InternshipDetails/InternshipDetails";

import Admissions from "./pages/Admissions/Admissions";
import AdmissionDetails from "./components/AdmissionDetails/AdmissionDetails";

import Team from "./pages/Teams/Teams";
import TeamDetails from "./components/TeamDetails/TeamDetails";

import Scholarships from "./pages/Scholarships/Scholarships";
import ScholarshipDetails from "./components/ScholarshipDetails/ScholarshipDetails";

import Results from "./pages/Results/Results";
import ResultDetails from "./components/ResultDetails/ResultDetails";

import AdmitCard from "./pages/AdmitCard/AdmitCard";
import AdmitCardDetails from "./components/AdmitCardDetails/AdmitCardDetails";

import WhatsNew from "./pages/WhatsNew/WhatsNew";

import SelectedJobs from "./pages/SelectedJobs/SelectedJobs";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

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

const App = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <Router>
          <TrackPageView />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route 
              path="/dashboard" 
              element={
                  <Dashboard />
              } 
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/job/get/:id" element={<JobDetails />} />
          
            <Route path="/community" element={<Community />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />

            <Route path="/internships" element={<Internships />} />
            <Route path="/internship/get/:id" element={<InternshipDetails/>}/>

            <Route path="/admissions" element={<Admissions />} />
            <Route path="/admission/get/:id" element={<AdmissionDetails />} />

            <Route path="/admitcards" element={<AdmitCard />} />
            <Route path="/admitcard/get/:id" element={<AdmitCardDetails />} />

            
            <Route path="/about-us" element={<AboutUs />} />

            <Route path="/previousyears" element={<PreviousYear />} />
            <Route path="/previous-year-details/:subject" element={<PreviousYearDetails />} />

            
            <Route path="/govtjobs" element={<GovtJobs />} />
            <Route path="/govtjob/get/:id" element={<GovtJobDetails />} />


            <Route path="/team" element={<Team />} />
            <Route path="/team/get/:id" element={<TeamDetails />} />

            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/scholarship/get/:id" element={<ScholarshipDetails />} />

            <Route path="/results" element={<Results />} />
            <Route path="/result/get/:id" element={<ResultDetails />} />
            <Route path="/whatsnew" element={<WhatsNew />} />

            <Route path="/selected-jobs" element={<SelectedJobs />} />

            
            
          </Routes>
          <Footer />
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
        </Router>
      </ThemeContext.Provider>
    </>
  );
};

export default App;