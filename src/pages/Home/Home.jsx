import React from 'react';
import Welcome from '../../components/Welcome/Welcome';
import WhatsNew from '../../components/WhatsNew/WhatsNew';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-section">
        <Welcome />
        <WhatsNew />
      </div>
    </div>
  );
};

export default Home;