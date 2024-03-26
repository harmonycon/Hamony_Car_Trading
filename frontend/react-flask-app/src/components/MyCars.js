import React, { useState, useEffect } from 'react';
import './myCars.css';
import CarForm from './CarForm';

function MyCars() {
    const [cars, setCars] = useState([]);
    const [editingCar, setEditingCar] = useState(null);

    useEffect(() => {
        fetch('/myCars')
            .then(response => response.json())
            .then(data => setCars(data))
            .catch(error => console.error('Error fetching cars:', error));
    }, []);

    const handleEditCar = (car) => {
        setEditingCar(car);
    };

    const handleSaveCar = async () => {
        const response = await fetch('/myCars');
        const updatedCars = await response.json();
        setCars(updatedCars);
        setEditingCar(null);
    };

    const handleMarkAsSold = async (vinNumber) => {
        try {
            const response = await fetch(`/markAsSold/${vinNumber}`, { method: 'PUT' });
            if (response.ok) {
                // Refresh the car list after marking as sold
                const updatedCars = await response.json();
                setCars(updatedCars);
            } else {
                console.error('Error marking car as sold:', response.statusText);
            }
        } catch (error) {
            console.error('Error marking car as sold:', error.message);
        }
    };

    const handleDeleteCar = async (vinNumber) => {
        // Show confirmation dialog
        const confirmed = window.confirm('Are you sure you want to delete this car?');
        if (!confirmed) {
            return; // Do nothing if user cancels
        }
    
        try {
            const response = await fetch(`/deleteCar/${vinNumber}`, { method: 'DELETE' });
            if (response.ok) {
                // Remove the deleted car from the car list
                setCars(prevCars => prevCars.filter(car => car.vinNumber !== vinNumber));
                // Show success message
                alert('Car successfully removed from the system.');
            } else {
                console.error('Error deleting car:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting car:', error.message);
        }
    };  

    return (
        <div>
            <h1>My Cars</h1>
            {cars.map(car => (
                <div key={car.vinNumber} className="car-container">
                    <div className="car">
                        <div>
                            <img src={`data:image/jpeg;base64,${car.imageData}`} alt="Car" className="car-image" />
                        </div>
                        {editingCar && editingCar.vinNumber === car.vinNumber ? (
                            <CarForm carToEdit={editingCar} onSave={handleSaveCar} />
                        ) : (
                            <div className="car-details">
                                <p>{car.make} {car.model}</p>
                                <p>VIN Number: {car.vinNumber}</p>
                                <p>Engine Number: {car.engNumber}</p>
                                <p>Registration Date: {car.regDate ? new Date(car.regDate).toLocaleDateString() : 'Not Available'}</p>
                                <p>Color: {car.color}</p>
                                <p>Body Type: {car.bodyType}</p>
                                <p>Gearbox Type: {car.gearBoxType}</p>
                                <p>Price: ${car.price}</p>
                                <p>Description: {car.description}</p>
                                <p>Mileage: {car.mileage} miles</p>
                                <div className="button-container">
                                    <button onClick={() => handleEditCar(car)}>Edit</button>
                                    <button onClick={() => handleMarkAsSold(car.vinNumber)}>Mark as Sold</button>
                                    <button onClick={() => handleDeleteCar(car.vinNumber)}>Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyCars;







