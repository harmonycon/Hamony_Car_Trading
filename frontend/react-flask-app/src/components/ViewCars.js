import React, { useState } from 'react';
import axios from 'axios';
import './viewCars.css';

function ViewCars({ cars }) {
    const [selectedCar, setSelectedCar] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleCarClick = (car) => {
        setSelectedCar(car);

        // Scroll to the detailed view
        const detailedViewElement = document.querySelector('.detailed-view');
        if (detailedViewElement) {
            detailedViewElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle form submission for ViewCars.js
const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {

        const response = await axios.post('/send_email', formData);
        if (response.ok) {
            console.log('Email sent successfully!');
   
        } else {
            console.error('Error sending email');
           
        }
    } catch (error) {
        console.error('Error sending email:', error);

    }
};

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    return (
        <div>
            <div className="car-grid">
                {cars.map((car, index) => (
                    <div key={index} className="car-card" onClick={() => handleCarClick(car)}>
                        <div className="car-details">
                            <p><strong>Make:</strong> {car.make}</p>
                            <p><strong>Model:</strong> {car.model}</p>
                            <p><strong>Reg Date:</strong> {car.regDate}</p>

                        </div>
                        {car.imageData && (
                            <img src={`data:image/jpeg;base64,${car.imageData}`} alt="Car" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        )}
                    </div>
                ))}
            </div>
            {selectedCar && (
                <div className="detailed-view">   
                    <div className="car-image-container">
                        {selectedCar.imageData && (
                            <img class="d-car-image" src={`data:image/jpeg;base64,${selectedCar.imageData}`} alt="Car" className="car-image" />
                        )}
                    </div>                 
                    <div className="detailed-container">                    
                        <h3>{selectedCar.make} {selectedCar.model}</h3>
                        <p><strong>Year:</strong> {selectedCar.year}</p>
                        <p><strong>Registration Date:</strong> {selectedCar.regDate}</p>
                        <p><strong>Color:</strong> {selectedCar.color}</p>
                        <p><strong>Body Type:</strong> {selectedCar.bodyType}</p>
                        <p><strong>Gearbox Type:</strong> {selectedCar.gearBoxType}</p>
                        <p><strong>Price:</strong> {selectedCar.price}</p>
                        <p><strong>Description:</strong> {selectedCar.description}</p>
                        <p><strong>Mileage:</strong> {selectedCar.mileage}</p>
                    </div>
                    {/* Contact form */}
                
                    <form className="detailed-container" onSubmit={handleFormSubmit}>
                        <div >
                            <h3>Contact the Seller</h3>
                            <div>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                        <textarea
                            name="message"
                            id="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                        </div>
                        <button type="submit">Send Email</button>
                        </div>
                        </form> 

                </div>
            )}
        </div>
    );
}

export default ViewCars;



