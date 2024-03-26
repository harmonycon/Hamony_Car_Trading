import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewCars from './ViewCars';
import './carSearchFilter.css';
function CarSearchFilter() {
  const [makeOptions, setMakeOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    startYear: '',
    endYear: ''
  });
  const [filteredCars, setFilteredCars] = useState([]);
  const [searched, setSearched] = useState(false); // Flag to track if search button is clicked

  useEffect(() => {
    // Fetch makes for populating makeOptions
    fetch('/makes')
      .then(response => response.json())
      .then(data => setMakeOptions(data))
      .catch(error => console.error('Error fetching makes:', error));
  }, []);

  const handleMakeChange = (selectedMake) => {
    setSearchCriteria({ ...searchCriteria, make: selectedMake });
    // Fetch models associated with the selected make
    fetch(`/models?make=${selectedMake}`)
      .then(response => response.json())
      .then(data => setModelOptions(data))
      .catch(error => console.error('Error fetching models:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const handleSearch = async () => {
    try {
      // Send search criteria to the backend to fetch filtered cars
      const response = await axios.get('/filter_cars', { params: searchCriteria });
      setFilteredCars(response.data);
      setSearched(true); // Set searched flag to true
    } catch (error) {
      console.error('Error searching cars:', error.message);
    }
  };

  return (
    <div className='filter-container'> 
        <h3>Car Search</h3>  
        <div className='flex-container'>
            <div  className='item-container'>
              <label className="flex-item" htmlFor="make">Make:</label>
              <select className="flex-item" id="make" name="make" value={searchCriteria.make} onChange={(e) => handleMakeChange(e.target.value)}>
              <option  value="">Select Make</option>
                {makeOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
              ))}
              </select>
            </div>      
            <div className='item-container'>
              <label className="flex-item" htmlFor="model">Model:</label>
              <select className="flex-item" id="model" name="model" value={searchCriteria.model} onChange={handleInputChange}>
              <option value="">Select Model</option>
                {modelOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
              ))}
              </select>
            </div>
        </div>
        <div className='flex-container'>
          <div className='item-container'>
            <label className="flex-item" htmlFor="minPrice">Min Price:</label>
            <input className="flex-item" type="number" id="minPrice" name="minPrice" value={searchCriteria.minPrice} onChange={handleInputChange} />
          </div>
          <div className='item-container'> 
            <label className='flex-item '  htmlFor="maxPrice">Max Price:</label>
            <input className='flex-item '  type="number" id="maxPrice" name="maxPrice" value={searchCriteria.maxPrice} onChange={handleInputChange} />
          </div>
        </div>
        <div className='flex-container'>
          <div className= 'item-container' >
            <label className="flex-item" htmlFor="startYear">Start Year:</label>
            <input className="flex-item"type="number" id="startYear" name="startYear" value={searchCriteria.startYear} onChange={handleInputChange} />
          </div>
          <div className='item-container'>
            <label  className="flex-item" htmlFor="endYear">End Year:</label>
            <input className="flex-item" type="number" id="endYear" name="endYear" value={searchCriteria.endYear} onChange={handleInputChange} />
          </div>
      </div>            
      <button onClick={handleSearch}>Search</button>
      {searched && <ViewCars cars={filteredCars} />}
    </div>
  
  );
}

export default CarSearchFilter;
