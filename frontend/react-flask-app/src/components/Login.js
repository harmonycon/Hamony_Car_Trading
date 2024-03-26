import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = ({ onLoginSuccess, setUserID, setUsername }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        userType: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', formData);
            setMessage(response.data.message);

            if (response.data.redirect) {
                navigate(response.data.redirect);
            }

            onLoginSuccess(response.data.userID);
            setUserID(response.data.userID);
            setUsername(response.data.username); 
        } catch (error) {
            console.error('Login failed:', error.message);
            setMessage('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="userName">User Name:</label>
                    <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} required />

                    <label htmlFor="userType">User Type:</label>
                    <select id="userType" name="userType" value={formData.userType} onChange={handleChange} required>
                        <option value="">Select User Type</option>
                        <option value="Admin">Admin</option>
                        <option value="Seller">Seller</option>
                        <option value="Buyer">Buyer</option>
                    </select>

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    <button type="submit">Submit</button>
                </form>
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
};

export default Login;





