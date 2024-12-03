import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "./Profile.css";
import toiletIcon from "../../assets/toilet.png";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const { user, facility } = useUser();

  if (!user || !facility) {
    return <div>Loading...</div>;
  }

  const customIcon = L.icon({
    iconUrl: toiletIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const facilityLocation = {
    name: facility.name,
    coordinates: [facility.location.latitude, facility.location.longitude],
    radius: facility.jurisdictionRadius || 400,
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-details">
        <div className="profile-item">
          <label>Name:</label>
          <p>{user.firstName} {user.lastName}</p>
        </div>
        <div className="profile-item">
          <label>Email:</label>
          <p>{user.email}</p>
        </div>
        <div className="profile-item">
          <label>Username:</label>
          <p>{user.username}</p>
        </div>
        <div className="profile-item">
          <label>Facility:</label>
          <p>{facilityLocation.name}</p>
        </div>
        <div className="profile-item">
          <label>Radius:</label>
          <p>{facilityLocation.radius} meters</p>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={facilityLocation.coordinates}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Circle
            center={facilityLocation.coordinates}
            radius={facilityLocation.radius}
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          />
          <Marker position={facilityLocation.coordinates} icon={customIcon}>
            <Popup>{facilityLocation.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Profile;
