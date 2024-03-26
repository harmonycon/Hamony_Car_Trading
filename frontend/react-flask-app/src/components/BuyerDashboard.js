import React, { useState, useEffect } from 'react';
import Search from './Search';
import ViewCars from './ViewCars';
import './adminDashboard.css';

const Buyer = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);

    useEffect(() => {
        fetch('/get_cars') 
            .then(response => response.json())
            .then(data => {
                setCars(data);
                setFilteredCars(data); // Set filtered cars initially with all cars
            })
            .catch(error => {
                console.error('Error fetching cars:', error);
            });
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = cars.filter(car =>
            car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCars(filtered);
    };

    return (
        <div>
            <h2>Featured Cars!</h2>
            <Search handleSearch={handleSearch} />
            <ViewCars cars={filteredCars} />
        </div>
    );
};

export default Buyer;

