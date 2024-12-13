import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "./EmployeeProfile.css";
import { useUser } from "../../context/UserContext";
import toiletIcon from "../../../assets/toilet.png";

const EmployeeProfile = () => {
  const { user, facility } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const customIcon = L.icon({
    iconUrl: toiletIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const facilityLocation = facility
    ? {
        name: facility.name,
        coordinates: [facility.location.latitude, facility.location.longitude],
        radius: facility.jurisdictionRadius || 400,
      }
    : null;

  return (
    <div className="employee-profile-container">
      <h2 className="employee-profile-title">Employee Profile</h2>
      <div className="employee-profile-details">
        <div className="employee-profile-item">
          <label>Name:</label>
          <p>{user.firstName} {user.lastName}</p>
        </div>
        <div className="employee-profile-item">
          <label>Email:</label>
          <p>{user.email}</p>
        </div>
        {facility && (
          <>
            <div className="employee-profile-item">
              <label>Facility:</label>
              <p>{facilityLocation.name}</p>
            </div>
            <div className="employee-profile-item">
              <label>Jurisdiction Radius:</label>
              <p>{facilityLocation.radius} meters</p>
            </div>
          </>
        )}
      </div>
      {facility && (
        <div className="employee-map-container">
          <MapContainer
            center={facilityLocation.coordinates}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Circle
              center={facilityLocation.coordinates}
              radius={facilityLocation.radius}
              pathOptions={{ color: "green", fillOpacity: 0.2 }}
            />
            <Marker position={facilityLocation.coordinates} icon={customIcon}>
              <Popup>{facilityLocation.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
