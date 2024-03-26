import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

import './Navigation.css';

function Navigation({ loggedIn, onLogout }) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (loggedIn) {
            getSessionDetails();
        }
    }, [loggedIn]);

    const getSessionDetails = async () => {
        try {
            const response = await fetch('/session-details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch session details');
            }
            const data = await response.json();
            setUserData(data);
            setDropdownOpen(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = () => {
        onLogout();
        setUserData(null);
        setDropdownOpen(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navigation">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/BuyerDashboard">Cars</Link></li>
                <li><Link to="/AboutUs">About Us</Link></li>
                <li><Link to="/Contacts">Contact Us</Link></li>
                {loggedIn ? (
                    <li className="user-dropdown" onClick={toggleDropdown}>
                        <span>Welcome, {userData && userData.userName} <FaUser /></span>
                        {dropdownOpen && (
                            <ul className="dropdown-menu">
                                {userData && userData.userType === 'Admin' && <li><Link to="/AdminDashboard">Admin Dashboard</Link></li>}
                                {userData && userData.userType === 'Seller' && <li><Link to="/SellerDashboard">Seller Dashboard</Link></li>}
                                <li><Link to="/UserUpdate">Edit profile</Link></li>
                                <li onClick={handleLogout}>Logout</li>
                            </ul>
                        )}
                    </li>
                ) : (
                    <li><Link to="/login">Login/Sign Up</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default Navigation;








