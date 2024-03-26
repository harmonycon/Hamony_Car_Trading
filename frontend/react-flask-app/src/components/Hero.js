import React from 'react';
import './hero.css'; 
import CarSearchFilter from './CarSearchFilter';

function Hero() {
  return (
<section className="hero-section">
  <div className="hero">
    <div className='filter'>
      <h3>Discover Your Perfect Drive Today!</h3>
      <CarSearchFilter />
    </div>
    <div className="image-box">          
    </div>
  </div>
</section>

  );
}

export default Hero;

