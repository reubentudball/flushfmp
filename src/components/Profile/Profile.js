import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Profile.css';
import toiletIcon from '../../assets/toilet.png';

const Profile = () => {
  // Sample user data
  const user = {
    name: "Jamie Cowan",
    email: "jamie.cowan@sheridancollege.com",
    role: "Facilities Manager",
    phone: "(555) 555-5555",
    facilityLocation: {
      name: "Sheridan College",
      coordinates: [43.4691, -79.7000], 
    },
  };

  // Create custom icon
  const customIcon = L.icon({
    iconUrl: toiletIcon,
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-details">
        <div className="profile-item">
          <label>Name:</label>
          <p>{user.name}</p>
        </div>
        <div className="profile-item">
          <label>Email:</label>
          <p>{user.email}</p>
        </div>
        <div className="profile-item">
          <label>Role:</label>
          <p>{user.role}</p>
        </div>
        <div className="profile-item">
          <label>Phone:</label>
          <p>{user.phone}</p>
        </div>
        <div className="profile-item">
          <label>Facility Location:</label>
          <p>{user.facilityLocation.name}</p>
        </div>
      </div>

      <div className="map-container">
        <MapContainer 
          center={user.facilityLocation.coordinates} 
          zoom={13} 
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker 
            position={user.facilityLocation.coordinates}
            icon={customIcon} // Apply custom icon
          >
            <Popup>{user.facilityLocation.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Profile;
