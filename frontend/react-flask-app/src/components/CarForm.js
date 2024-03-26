import React, { useState, useEffect } from 'react';
import './carForm.css';

function CarForm({ carToEdit, onCancel, onSave }) {
    const [vinNumber, setVinNumber] = useState(carToEdit ? carToEdit.vinNumber : '');
    const [engNumber, setEngNumber] = useState(carToEdit ? carToEdit.engNumber : '');
    const [make, setMake] = useState(carToEdit ? carToEdit.make : '');
    const [model, setModel] = useState(carToEdit ? carToEdit.model : '');
    const [regDate, setRegDate] = useState(carToEdit ? carToEdit.regDate : '');
    const [color, setColor] = useState(carToEdit ? carToEdit.color : '');
    const [bodyType, setBodyType] = useState(carToEdit ? carToEdit.bodyType : '');
    const [gearBoxType, setGearBoxType] = useState(carToEdit ? carToEdit.gearBoxType : '');
    const [price, setPrice] = useState(carToEdit ? carToEdit.price : '');
    const [description, setDescription] = useState(carToEdit ? carToEdit.description : '');
    const [mileage, setMileage] = useState(carToEdit ? carToEdit.mileage : '');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (carToEdit) {
            // Populate form fields with car details for editing
            setVinNumber(carToEdit.vinNumber);
            setEngNumber(carToEdit.engNumber);
            setMake(carToEdit.make);
            setModel(carToEdit.model);
            setRegDate(carToEdit.regDate);
            setColor(carToEdit.color);
            setBodyType(carToEdit.bodyType);
            setGearBoxType(carToEdit.gearBoxType);
            setPrice(carToEdit.price);
            setDescription(carToEdit.description);
            setMileage(carToEdit.mileage);
        }
    }, [carToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (vinNumber && make && model && regDate && price) {
            const formData = new FormData();
            formData.append('vinNumber', vinNumber);
            formData.append('engNumber', engNumber);
            formData.append('make', make);
            formData.append('model', model);
            formData.append('regDate', regDate);
            formData.append('color', color);
            formData.append('bodyType', bodyType);
            formData.append('gearBoxType', gearBoxType);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('mileage', mileage);
            formData.append('imageData', image);

            try {
                let response;
                if (carToEdit) {
                    // Edit existing car
                    response = await fetch(`/update_car/${vinNumber}`, {
                        method: 'PUT',
                        body: formData,
                    });
                } else {
                    // Add new car
                    response = await fetch('/add_car', {
                        method: 'POST',
                        body: formData,
                    });
                }

                if (response.ok) {
                    console.log('Car details saved successfully!');
                    onSave();
                } else {
                    console.error('Error saving car details:', response.statusText);
                }
            } catch (error) {
                console.error('Error saving car details:', error.message);
            }
        }
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    return (
        <form className="car-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="VIN Number"
                value={vinNumber}
                onChange={(e) => setVinNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Engine Number"
                value={engNumber}
                onChange={(e) => setEngNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
            />
            <input
                type="text"
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
            />
            <input
                type="date"
                placeholder="Registration Date"
                value={regDate}
                onChange={(e) => setRegDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <input
                type="text"
                placeholder="Body Type"
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
            />
            <input
                type="text"
                placeholder="Gearbox Type"
                value={gearBoxType}
                onChange={(e) => setGearBoxType(e.target.value)}
            />
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <input
                type="number"
                placeholder="Mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <div>
                <button type="submit">{carToEdit ? 'Save' : 'Add Car'}</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default CarForm;
