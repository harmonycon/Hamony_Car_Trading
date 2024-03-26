import React, { useState } from 'react';
import './search.css';

function Search({ handleSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClickSearch = () => {
        handleSearch(searchTerm);
    };

    return (
        <div className="search-container">
            <input 
                type="text" 
                placeholder="Search by make or model..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="search-input" 
            />
            <button onClick={handleClickSearch}>Search</button>
        </div>
    );
}

export default Search;

