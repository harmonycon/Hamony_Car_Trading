import React, { useState, useEffect } from 'react';
import './viewBuyers.css';
import axios from 'axios';

const ViewBuyers = () => {
  // State to store the buyers
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    // Fetch buyer data from the backend API
    axios.get('/buyers')
      .then(response => {
        // Update buyers state with the fetched data
        setBuyers(response.data);
        console.log('Retrieved buyers:', response.data);
      })
      .catch(error => {
        console.error('Error fetching buyer data:', error);
      });
  }, []);

  const toggleStatus = (buyerId) => {
    // Find the buyer to toggle
    const buyerToUpdate = buyers.find(buyer => buyer.id === buyerId);
    if (!buyerToUpdate) return;
  
    // Toggle the isActive property
    setBuyers(currentBuyers => {
      return currentBuyers.map(buyer =>
        buyer.id === buyerId ? { ...buyer, isActive: !buyer.isActive } : buyer
      );
    });
  
    // Send a request to the backend to update buyer's status
    axios.post(`/toggleStatus/${buyerId}`, { isActive: !buyerToUpdate.isActive })
      .then(response => {
        console.log('Buyer status updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error toggling buyer status:', error);
        // If there's an error, revert the state to the previous state
        setBuyers(currentBuyers => {
          // Find the buyer again to ensure we're not using a stale buyer reference
          const buyerToRevert = currentBuyers.find(buyer => buyer.id === buyerId);
          return currentBuyers.map(buyer =>
            buyer.id === buyerId ? { ...buyerToRevert, isActive: buyerToUpdate.isActive } : buyer
          );
        });
      });
  };
  return (
    <div className="view-buyers">
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer) => (
            <tr key={buyer.id}>
              <td>{buyer.id}</td>
              <td>{buyer.name}</td>
              <td>{buyer.email}</td>
              <td>{buyer.userType}</td>
              <td>
                <button
                  className={`status-button ${buyer.isActive ? 'enabled' : 'disabled'}`}
                  onClick={() => toggleStatus(buyer.id)}
                >
                  {buyer.isActive ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewBuyers;

