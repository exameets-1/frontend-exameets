import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './WhatsNew.css';

const WhatsNew = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="whats-new-section">
      <div className="search-container">
        <div className="search-input-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" size={22} color="#0056b3" />
        </div>
      </div>
      
      <h3>What's New</h3>
      <div className="notification-list">
        {/* Notifications will be mapped here */}
        <Link to="/whatsnew">
        <button className="view-all-button">View All &gt;&gt;</button>
        </Link>
      </div>
    </div>
  );
};

export default WhatsNew;