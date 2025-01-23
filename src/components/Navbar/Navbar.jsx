import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="top-line">
        <p>...Exameets is a one-step platform for students, where all the needs are met...</p>
      </div>

      <div className="logo-menu">
        <div className="logo">
          <Link to="/"><img src="/logo.jpg" alt="Exameets Logo" /></Link>
        </div>
        
        <div 
          className="hamburger" 
          id="hamburger" 
          onClick={toggleMenu}
          style={{ display: isMenuOpen ? 'none' : 'flex' }}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        
        <div 
          className="close-menu" 
          style={{ display: isMenuOpen ? 'block' : 'none' }}
          onClick={toggleMenu}
        >
          &times;
        </div>
        
        <nav className={`menu ${isMenuOpen ? 'show' : ''}`} style={{ border: 'none' }}>
          <div className="menu-item">
            <div className="menu-item-content">
              <div className="icon-circle">
              <Link to="/">   <img src="/Home_Icon.svg" alt="Home" /> </Link>
              </div>
              <Link to="/">Home</Link>
            </div>
          </div>
          
          <div className="menu-item govt-job-container">
            <div className="menu-item-content">
              <div className="icon-circle">
                <img src="/Govt_Icon.svg" alt="Govt Jobs" />
              </div>
              <Link to="#">Govt Jobs</Link>
            </div>
            <div className="dropdown">
              <div className="dropdown-content">
                <div className="dropdown-item">
                  <Link to="/govtjobs">Govt Jobs</Link>
                </div>
                <div className="dropdown-item">
                  <Link to="/admitcards">Admit Card</Link>
                </div>
                <div className="dropdown-item">
                  <Link to="/results">Result</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="menu-item">
            <div className="menu-item-content">
              <div className="icon-circle">
              <Link to="/jobs"><img src="/Tech_Icon.svg" alt="Tech Jobs" /></Link>
              </div>
              <Link to="/jobs">Tech Jobs</Link>
            </div>
          </div>
          
          <div className="menu-item">
            <div className="menu-item-content">
              <div className="icon-circle">
              <Link to="/internships">  <img src="/Intern_Icon.svg" alt="Internships" /> </Link>
              </div>
              <Link to="/internships">Internships</Link>
            </div>
          </div>
          
          <div className="menu-item">
            <div className="menu-item-content">
              <div className="icon-circle">
              <Link to="/admissions">  <img src="/Admission_Icon.svg" alt="Admissions" /> </Link>
              </div>
              <Link to="/admissions">Admissions</Link>
            </div>
          </div>
          
          <div className="menu-item">
            <div className="menu-item-content">
              <div className="icon-circle">
              <Link to="/previousyears">  <img src="/PYQ_Icon.svg" alt="PYQ" /> </Link>
              </div>
              <Link to="/previousyears">PYQ</Link>
            </div>
          </div>
          
          <div className="menu-item">
            <div className="menu-item-content">
              <div className="icon-circle">
              <Link to="/scholarships">  <img src="/Courses_Icon.svg" alt="Courses" /> </Link>
              </div>
              <Link to="/scholarships">Scholarships</Link>
            </div>
          </div>
        </nav>
      </div>

      <div className="bottom-line">
        <p>Register to get the notifications you need</p>
        <div className="auth-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <span className="thick-line">|</span>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <Link to="/dashboard">Profile</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;