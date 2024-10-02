import React, { useState } from 'react';
import './Facilities.css';
import { useNavigate } from 'react-router-dom';

const Facilities = () => {
  const navigate = useNavigate();

  const facilities = [
    {
      name: "Restroom A",
      location: "Wing 1",
      tickets: 2,
      cleanlinessRating: 4.5,
      visitors: 100,
    },
    {
      name: "Restroom B",
      location: "Wing 2",
      tickets: 1,
      cleanlinessRating: 4.0,
      visitors: 150,
    },
    {
      name: "Restroom C",
      location: "Wing 3",
      tickets: 0,
      cleanlinessRating: 3.8,
      visitors: 120,
    },
  ];

  const handleFacilityClick = (facility) => {
    navigate(`/admin/facilities/${facility.name.toLowerCase().replace(/ /g, '-')}`);
  };

  return (
    <div className="facilities-container">
      <h2>Facilities</h2>
      <ul className="facilities-list">
        {facilities.map((facility, index) => (
          <li key={index} className="facility-item" onClick={() => handleFacilityClick(facility)}>
            <div className="facility-info">
              <h3>{facility.name}</h3>
              <p>Location: {facility.location}</p>
              <p>Tickets: {facility.tickets}</p>
              <p>Cleanliness Rating: {facility.cleanlinessRating}</p>
            </div>
            {facility.tickets > 0 && <span className="alert">⚠️ {facility.tickets} Outstanding Tickets</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Facilities;
