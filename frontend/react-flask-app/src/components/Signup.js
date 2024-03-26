import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login';
import './signup.css'; 

const Signup = () => {
  // Define state variables for form data, message, and signup success
  const [formData, setFormData] = useState({
    userName: '',
    userType: '', 
    password: '',
    email: '',
    phone: ''
  });

  const [message, setMessage] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      // Send a POST request to the backend API endpoint for signup
      const response = await axios.post('/signup', formData);
      
      // Update message state with the response message from the server
      setMessage(response.data.message);

      // Handle successful signup 
      setSignupSuccess(true); // Set signup success state to true
    } catch (error) {
      console.error('Signup failed:', error.message);
      
      // Update message state with an error message
      setMessage(false);
    }
  };

  return (
    <div className="signup-container">
      {signupSuccess ? (
        <Login />
      ) : (
        <div className="signup-form-container">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            {/* User Name input field */}
            <label htmlFor="userName">User Name:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
  
            {/* User Type dropdown */}
            <label htmlFor="userType">User Type:</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="Admin">Admin</option>
              <option value="Seller">Seller</option>
              <option value="Buyer">Buyer</option>
            </select>
  
            {/* Password input field */}
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* User email input field */}
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

             {/* User phone input field */}
             <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />           

            {/* Submit button */}
            <button type="submit">Submit</button>
          </form>  
          {/* Display message if there is one */}
          {message && <p>{message}</p>}
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      )}
    </div>
  );
};

export default Signup;

