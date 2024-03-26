import React, { useState, useEffect } from 'react';
import './viewSellers.css'; // Import the corresponding CSS file
import axios from 'axios';

const ViewSellers = () => {
  // State to store the users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch seller data from the backend API
    axios.get('/sellers')
      .then(response => {
        // Assuming the response data is already in the correct format
        // Update users state with the fetched data
        setUsers(response.data);
        console.log('Retrieved users:', response.data);
      })
      .catch(error => {
        console.error('Error fetching seller data:', error);
      });
  }, []);

  const toggleStatus = (userId) => {
    // Find the user to toggle
    const userToUpdate = users.find(user => user.id === userId);
    if (!userToUpdate) return;
  
    // Toggle the isActive property
    setUsers(currentUsers => {
      return currentUsers.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      );
    });
  
    // Send a request to the backend to update user's status
    axios.post(`/toggleStatus/${userId}`, { isActive: !userToUpdate.isActive })
      .then(response => {
        console.log('User status updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error toggling user status:', error);
        // If there's an error, revert the state to the previous state
        setUsers(currentUsers => [...currentUsers]);
      });
  };

  return (
    <div className="view-sellers">
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>
                <button
                  className={`status-button ${user.isActive ? 'enabled' : 'disabled'}`}
                  onClick={() => toggleStatus(user.id)}
                >
                  {user.isActive ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSellers;

