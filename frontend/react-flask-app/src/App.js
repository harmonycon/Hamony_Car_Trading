import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import ViewCars from './components/ViewCars';
import ViewSellers from './components/ViewSellers';
import ViewBuyers from './components/ViewBuyers';
import AdminCarView from './components/AdminCarView';
import MyCars from './components/MyCars';
import UserUpdate from './components/UserUpdate';
import Contacts from './components/Contacts';

function App() {
  const [user, setUser] = useState({ loggedIn: false, username: '', userType: '' });

  useEffect(() => {
    // This effect runs when `user` state changes
    if (user.loggedIn) {
      // If the user is logged in, do something with the `username`
      // For example, you could store it in localStorage or send it to an API
    }
  }, [user]);

  const handleLoginSuccess = (userID, username, userType) => {
    setUser({
      loggedIn: true,
      username: username,
      userType: userType
    });
  };

  const handleLogout = () => {
    setUser({ loggedIn: false, username: '', userType: '' });
    // Clear any stored data if needed
  };

  return (
    <Router>
      <div className="App">
        <Header loggedIn={user.loggedIn} username={user.username} userType={user.userType} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/SellerDashboard" element={<SellerDashboard />} />
          <Route path="/BuyerDashboard" element={<BuyerDashboard />} />
          <Route path="/ViewCars" element={<ViewCars />} />
          <Route path="/ViewSellers" element={<ViewSellers />} />
          <Route path="/ViewBuyers" element={<ViewBuyers />} />
          <Route path="/AdminCarView" element={<AdminCarView />} />
          <Route path="/MyCars" element={<MyCars />} />
          <Route path="/UserUpdate" element={<UserUpdate />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Contacts" element={<Contacts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;