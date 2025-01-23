import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './Footer.css';

const motivationalQuotes = [
    "The only place where success comes before work is in the dictionary.",
    "The key to success is to focus on goals, not obstacles.",
    "Happiness is not by chance, but by choice.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Believe you can and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "You don’t have to be great to start, but you have to start to be great.",
    "It’s never too late to be what you might have been.",
    "It’s going to be hard, but hard does not mean impossible.",
    "Do something today that your future self will thank you for.",
    "Don’t wait for opportunity. Create it.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Nothing will work unless you do.",
    "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "We may encounter many defeats, but we must not be defeated.",
    "Push yourself, because no one else is going to do it for you.",
    "The only way to achieve the impossible is to believe it is possible.",
    "Don’t let yesterday take up too much of today.",
    "Success is the result of preparation, hard work, and learning from failure.",
    "The best dreams happen when you’re awake.",
    "Believe in yourself and all that you are.",
    "Success is not measured by what you accomplish, but by the obstacles you overcome.",
    "Success usually comes to those who are too busy to be looking for it.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Dream it. Wish it. Do it.",
    "Little things make big days.",
    "It does not matter how slowly you go as long as you do not stop.",
    "You are never too old to set another goal or to dream a new dream.",
    "There are no limits to what you can accomplish, except the limits you place on your own thinking.",
    "You are capable of more than you know.",
    "Every day may not be good, but there’s something good in every day.",
    "A year from now you may wish you had started today.",
    "You don’t have to be great to start, but you have to start to be great.",
    "Don't wait for the right opportunity, create it.",
    "Wake up with determination. Go to bed with satisfaction.",
    "We can do anything we want to if we stick to it long enough.",
    "Dream bigger. Do bigger.",
    "The best way to predict the future is to create it.",
    "In order to succeed, we must first believe that we can.",
    "If you want to achieve greatness stop asking for permission.",
    "Your time is limited, so don’t waste it living someone else’s life.",
    "Do not wait to strike till the iron is hot, but make it hot by striking.",
    "Dream it, believe it, build it.",
    "The harder the battle, the sweeter the victory.",
    "Start where you are. Use what you have. Do what you can.",
    "The mind is everything. What you think you become.",
    "The best way to get things done is to simply begin.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Everything has beauty, but not everyone can see it.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Success is not how high you have climbed, but how you make a positive difference to the world.",
    "Your only limit is you.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Success is not in what you have, but who you are.",
    "You miss 100% of the shots you don’t take.",
    "Your attitude, not your aptitude, will determine your altitude.",
    "Great things never come from comfort zones.",
    "The way to get started is to quit talking and begin doing.",
    "Believe in your dreams and they may come true. Believe in yourself and they will come true.",
    "Don’t be afraid to give up the good to go for the great.",
    "If you want something you've never had, you must be willing to do something you've never done."
];

const Footer = () => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      return motivationalQuotes[randomIndex];
    };

    const updateQuote = () => {
      setIsVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentQuote(getRandomQuote()); // Change quote while invisible
        setIsVisible(true); // Start fade in
      }, 1000); // Wait for fade out to complete
    };

    // Update quote every 5 seconds
    const intervalId = setInterval(updateQuote, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="bg-[#015990] text-white">
      <div className="footer-container">
        <div className="footer-title">
          <h1 className="text-2xl font-bold">Exameets</h1>
        </div>

        <div className="footer-links">
          <Link to="/contact-us">Contact Us</Link>
          <span>|</span>
          <Link to="/about-us">About Us</Link>
          <span>|</span>
          <Link to="/community">Community</Link>
          <span>|</span>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span>|</span>
          <Link to="/team">Our Team</Link>
        </div>

        <div className="footer-bottom">
          <div className="left-side">
            <p>© 2025 Exameets. All Rights Reserved.</p>
          </div>
          <div className="middle-side">
            <p>Developed in Partnership with Ceeras</p>
          </div>
          <div className="right-side">
            <a href="https://wa.me/9014185655" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100093111888181" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.instagram.com/ceeras_official/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
            <a href="https://x.com/ceeras_official" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.linkedin.com/company/ceeras-official/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        <div className="footer-quotes">
          <div className={`quote-text ${isVisible ? 'fade-in' : 'fade-out'}`}>
            {currentQuote}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
