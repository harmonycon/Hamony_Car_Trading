import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ setSelectedOption }) => {
  return (
    <div className="sidebar">
      <div className='sidebar-links'>
        <Link className='sb-Link' to="#" onClick={() => setSelectedOption('cars')}>Cars</Link>
        <Link className='sb-Link' to="#" onClick={() => setSelectedOption('sellers')}>Sellers</Link>
        <Link className='sb-Link' to="#" onClick={() => setSelectedOption('buyers')}>Buyers</Link>
      </div>
    </div>
  );
};

export default Sidebar;
