import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ViewCars from './ViewCars';
import ViewSellers from './ViewSellers';
import ViewBuyers from './ViewBuyers';
import AdminCarView from './AdminCarView';
const Admin = () => {
  const [selectedOption, setSelectedOption] = useState('cars');
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
      <div>
        <Sidebar setSelectedOption={setSelectedOption} />
      </div>

      <div className='admin-view'>
        {/* Conditionally render components based on selected option */}
        {selectedOption === 'cars' && <AdminCarView cars={filteredCars} />}
        {selectedOption === 'sellers' && <ViewSellers />}
        {selectedOption === 'buyers' && <ViewBuyers />}
      </div>
    </div>
  );
};

export default Admin;

