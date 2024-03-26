import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userUpdate.css';
const UserUpdate = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userType: '',
    email: '',
    phone: ''
    // Add other fields as needed
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user data based on the userName from the session
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/userByUsername');
        const userData = response.data;
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send updated user data to backend to update user
      const response = await axios.put(`/userUpdate/${formData.userID}`, formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating user:', error.message);
      setMessage('Error updating user. Please try again.');
    }
  };

  const handleCancel = () => {
    // Go back to the previous page
    window.history.back();
  };

  return (
    <div className='userUpdate-container'>      
      <form className='userUpdate-form' onSubmit={handleSubmit}>
        <h2>Update User</h2>
        <label htmlFor="userName">User Name:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />

        <label htmlFor="userType">User Type:</label>
        <input
          type="text"
          id="userType"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserUpdate;
