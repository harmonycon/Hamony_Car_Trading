import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation'; 
import Hero from './Hero'; 
import CarSearchFilter from './CarSearchFilter'; 

function Home({ loggedIn, username, onLogout }) {
  const location = useLocation();

  // Check if the current page is the Home page
  const isHomePage = location.pathname === '/';

  return (
    <div className="home">
      <section className='hero-container'>
        {/* Render Navigation only if it's not the Home page */}
        {!isHomePage && <Navigation loggedIn={loggedIn} username={username} onLogout={onLogout} />}
        <Hero />
      </section>    
  </div>
  );
}

export default Home;







