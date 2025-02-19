import Welcome from '../../components/Welcome/Welcome';
import WhatsNew from '../../components/WhatsNew/WhatsNew';
import './Home.css';
import SelectedJobs from '../../components/SelectedJobs/SelectedJobs';
import { useSelector } from 'react-redux';
import scrollToTop from '../../hooks/useScrollToTop';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    scrollToTop(),
    <div className="home-container">
      <div className="content-section">
        {isAuthenticated ? <SelectedJobs /> : <Welcome />}
        <WhatsNew />
      </div>
    </div>
  );
};

export default Home;