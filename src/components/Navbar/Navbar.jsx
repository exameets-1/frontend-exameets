import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '../../App';
import { UserCog } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { darkMode, setDarkMode } = useTheme();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <header className="w-full dark:bg-gray-800">
      {/* Top Line */}
      <div className="bg-[#015990] dark:bg-gray-950 text-white dark:text-gray-100 text-center h-[50px] flex items-center justify-center">
        <p className="mt-1.5 text-xl whitespace-nowrap">
          ...Exameets is a one-step platform for students, where all the needs are met...
        </p>
      </div>

      {/* Logo and Menu */}
      <div className="flex items-center justify-between px-5 py-4 relative dark:bg-gray-800">
        {/* Logo */}
        <Link to="/" className="max-w-[350px] mx-auto">
          <img src={darkMode ? "/logo-final-dark.png" : "/logo-final.png"} alt="Exameets Logo" className="w-auto h-auto max-h-[250px]" />
        </Link>

        {/* Hamburger Menu */}
        <div 
          className="flex flex-col justify-between w-8 h-10 cursor-pointer md:hidden"
          onClick={toggleMenu}
        >
          <div className="w-full h-1" style={{ backgroundColor: darkMode ? 'white' : 'black' }}></div>
          <div className="w-full h-1" style={{ backgroundColor: darkMode ? 'white' : 'black' }}></div>
          <div className="w-full h-1" style={{ backgroundColor: darkMode ? 'white' : 'black' }}></div>
        </div>

        {/* Close Menu (Mobile) */}
        {isMenuOpen && (
          <div 
            className="absolute cursor-pointer right-5 top-16 md:hidden"
            onClick={toggleMenu}
            style={{ 
              color: darkMode ? 'white' : 'black',
              fontSize: '24px'
            }}
          >
            ✕
          </div>
        )}

        {/* Navigation Menu */}
        <nav className={`${isMenuOpen ? 'absolute top-20 right-0 w-1/2 shadow-lg z-50' : 'hidden'} md:flex md:flex-wrap md:justify-center md:gap-4 md:items-center`}>
        
        {isMenuOpen ? (
            // Mobile Menu Items - Right Aligned with half-width background
            <div className="flex flex-col p-4 space-y-2 text-right pr-8 bg-white dark:bg-gray-800 w-full">
              <Link to="/" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Home</Link>
              <Link to="/govtjobs" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Govt Jobs</Link>
              <Link to="/admitcards" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Admit Card</Link>
              <Link to="/results" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Result</Link>
              <Link to="/jobs" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Tech Jobs</Link>
              <Link to="/internships" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Internships</Link>
              <Link to="/admissions" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Admissions</Link>
              <Link to="/previousyears" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">PYQ</Link>
              <Link to="/scholarships" onClick={closeMobileMenu} className="text-xl dark:text-gray-100">Scholarships</Link>
            </div>
          ): (
            // Desktop Menu Items
            <>
              <div className="flex flex-col items-center m-4 group" onClick={closeMobileMenu}>
                <Link to="/" className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                    <img src="/Home_Icon.svg" alt="Home" />
                  </div>
                  <span className="text-xl dark:text-gray-100">Home</span>
                </Link>
              </div>

              <div className="relative flex flex-col items-center m-4 group" onClick={closeMobileMenu}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                    <img src="/Govt_Icon.svg" alt="Govt Jobs" className="w-9 h-auto dark-image" />
                  </div>
                  <span className="text-xl dark:text-gray-100">Govt Jobs</span>
                </div>
                
                <div className="absolute hidden bg-white dark:bg-gray-700 shadow-lg top-[100px] left-[-35px] min-w-[130px] z-50 group-hover:block">
                  <Link to="/govtjobs" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-100">Govt Jobs</Link>
                  <Link to="/admitcards" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-100">Admit Card</Link>
                  <Link to="/results" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-100">Result</Link>
                </div>
              </div>

              <div className="flex flex-col items-center m-4" onClick={closeMobileMenu}>
                <Link to="/jobs" className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                    <img src="/Tech_Icon.svg" alt="Tech Jobs" className="w-9 h-auto dark-image" />
                  </div>
                  <span className="text-xl dark:text-gray-100">Tech Jobs</span>
                </Link>
              </div>

              <div className="flex flex-col items-center m-4" onClick={closeMobileMenu}>
                <Link to="/internships" className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                    <img src="/Courses_Icon.svg" alt="Courses" className="w-9 h-auto dark-image" />
                  </div>
                  <span className="text-xl dark:text-gray-100">Internships</span>
                </Link>
              </div>

              <div className="flex flex-col items-center m-4" onClick={closeMobileMenu}>
                <Link to="/admissions" className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                    <img src="/Admission_Icon.svg" alt="Admissions" className="w-9 h-auto dark-image" />
                  </div>
                  <span className="text-xl dark:text-gray-100">Admissions</span>
                </Link>
              </div>

              <div className="flex flex-col items-center m-4" onClick={closeMobileMenu}>
                <Link to="/previousyears" className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                    <img src="/PYQ_Icon.svg" alt="PYQ" className="w-9 h-auto dark-image" />
                  </div>
                  <span className="text-xl dark:text-gray-100">PYQ</span>
                </Link>
              </div>

              <div className="flex flex-col items-center m-4" onClick={closeMobileMenu}>
                <Link to="/scholarships" className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                    <img src="/Intern_Icon.svg" alt="Internships" className="w-9 h-auto dark-image" />
                  </div>
                  <span className="text-xl dark:text-gray-100">Scholarships</span>
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Line */}
      <div className={`bg-[#015990] dark:bg-gray-950 text-white dark:text-gray-100 h-auto min-h-[50px] py-2 flex flex-col md:flex-row items-center justify-between px-5 relative`}>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute right-4 rounded-full backdrop-blur-sm"
          style={{
            cursor: 'pointer'
          }}
        >
          <span className="text-xl">{darkMode ? '| ☀️' : '| 🌙'}</span>
        </button>

        {isAuthenticated ? (
          <div className="w-full flex justify-between items-center pr-12">
            <p className="text-xl">Hi, {user.name}</p>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-white dark:text-gray-100 no-underline flex items-center">
                <UserCog className="md:hidden" size={24} />
                <span className="hidden md:inline text-xl">Profile</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xl mb-2 md:mb-0">Register to get the notifications you need</p>
            <div className="flex items-center gap-4 pr-12">
              <Link to="/login" className="text-xl text-white dark:text-gray-100 no-underline">Login</Link>
              <span className="text-xl">|</span>
              <Link to="/register" className="text-xl text-white dark:text-gray-100 no-underline">Register</Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;