import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCarView() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('/get_cars');
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleAction = async (vinNumber, action) => {
        try {
            await axios.post(`/update_car_status/${vinNumber}`, { action });
            // Update the cars list after the action
            fetchCars();
            alert(`Car ${action === 'enable' ? 'enabled' : 'disabled'} successfully.`);
        } catch (error) {
            console.error(`Error ${action === 'enable' ? 'enabling' : 'disabling'} car:`, error);
        }
    };

    const handleDelete = async (vinNumber) => {
        const confirmed = window.confirm('Are you sure you want to delete this car?');
        if (confirmed) {
            try {
                await axios.delete(`/delete_car/${vinNumber}`);
                // Update the cars list after deletion
                fetchCars();
                alert('Car successfully deleted.');
            } catch (error) {
                console.error('Error deleting car:', error);
            }
        }
    };

    return (
        <div>
            <h3>Admin Car View</h3>
            <div className="car-grid">
                {cars.map((car, index) => (
                    <div key={index} className="car-card">
                        <div className="car-details">
                            <p><strong>Make:</strong> {car.make}</p>
                            <p><strong>Model:</strong> {car.model}</p>
                            <p><strong>Year:</strong> {car.regDate}</p>
                            <p><strong>Price:</strong> {car.price}</p>
                            <p><strong>Status:</strong> 
                                <span style={{ color: car.isActive ? 'blue' : 'red' }}>
                                    {car.isActive ? 'Enabled' : 'Disabled'}
                                </span>
                            </p>                            
                            <button onClick={() => handleAction(car.vinNumber, car.isActive ? 'disable' : 'enable')}>
                                {car.isActive ? 'Disable' : 'Enable'}
                            </button>
                            <button style={{ color: 'red' }} onClick={() => handleDelete(car.vinNumber)}>Delete</button>
                        </div>
                        {car.imageData && (
                            <img src={`data:image/jpeg;base64,${car.imageData}`} alt="Car" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminCarView;
