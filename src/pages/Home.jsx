import Hero from "../components/Hero";
import TopNiches from "../components/TopNiches";
import HowItWorks from "../components/HowItWorks";
import  { useEffect } from 'react';



const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>
    </main>
  );
};

export default Home;
