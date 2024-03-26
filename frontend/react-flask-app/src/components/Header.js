import React from 'react';
import './header.css'; 
import Navigation from './Navigation';

const Header = ({ loggedIn, username, onLogout }) => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>CarTrader</h1>
      </div>
      <Navigation loggedIn={loggedIn} username={username} onLogout={onLogout} />
    </header>
  );
};

export default Header;

