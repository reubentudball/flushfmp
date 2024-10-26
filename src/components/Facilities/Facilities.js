import React, { useEffect, useState } from 'react';
import './Facilities.css';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import { FaCommentDots } from 'react-icons/fa'; 
import 'leaflet/dist/leaflet.css'; 
import { getAllBathrooms } from '../Repo/bathroomRepository';

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await getAllBathrooms();
        console.log(data);
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchFacilities();
  }, []);

  const handleFacilityClick = (facility) => {
    navigate(`/admin/facilities/${facility.title.toLowerCase().replace(/ /g, '-')}`, {
    state: { facilityId: facility.id } });
  };

  if (facilities.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="facilities-container">
      <h2>Facilities</h2>
      <ul className="facilities-list">
        {facilities.map((facility, index) => (
          <li key={index} className="facility-item" onClick={() => handleFacilityClick(facility)}>
            <div className="facility-info">
              <h3>{facility.title}</h3>
              <p>Directions: {facility.directions}</p>
              <p>Location: {facility.location._lat}, {facility.location._long}</p>
              <p>
                <FaCommentDots /> {facility.comments.length} Comments
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="map-container" style={{ height: '500px', marginTop: '20px' }}>
        <MapContainer center={[facilities[0].location._lat, facilities[0].location._long]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {facilities.map((facility, index) => (
            <Marker
              key={index}
              position={[facility.location._lat, facility.location._long]}
              icon={markerIcon}
            >
              <Popup>
                <strong>{facility.title}</strong><br />
                {facility.directions}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Facilities;
