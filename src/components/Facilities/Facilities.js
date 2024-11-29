import React, { useEffect, useState } from "react";
import "./Facilities.css";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { FaCommentDots } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import Modal from "react-modal";
import {
  getBathroomsWithinRadius,
  createBathroom,
  deleteBathroom,
  verifyBathroom,
  unverifyBathroom,
} from "../Repo/bathroomRepository";
import { logActivity } from "../Repo/LogRepository"; 
import { useUser } from "../context/UserContext";
import { calculateDistance } from "../Util/util";

const unverifiedMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const verifiedMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBathroom, setNewBathroom] = useState({ title: "", directions: "", geo: { geopoint: { latitude: "", longitude: "" } } });
  const { facility: facilityContext, user } = useUser();
  const navigate = useNavigate();

  const facility = facilityContext || JSON.parse(localStorage.getItem("facility"));

  const defaultRadius = 400;

  useEffect(() => {
    const fetchFacilities = async () => {
      if (!facility || !facility.facilityId) {
        console.error("No facility context or ID available.");
        return;
      }

      try {
        const data = await getBathroomsWithinRadius(
          {
            _lat: facility.location.latitude,
            _long: facility.location.longitude,
          },
          facility.jurisdictionRadius || defaultRadius
        );
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchFacilities();
  }, [facility]);

  const handleFacilityClick = (bathroom) => {
    navigate(`/admin/facilities/${bathroom.title.toLowerCase().replace(/ /g, "-")}`, {
      state: { facilityId: bathroom.id },
    });
  };

  const handleVerifyBathroom = async (bathroom) => {
    try {
      await verifyBathroom(bathroom.id, facility.facilityId);
      setFacilities((prev) =>
        prev.map((b) =>
          b.id === bathroom.id ? { ...b, isVerified: true, facilityID: facility.facilityId } : b
        )
      );
  
      await logActivity({
        action: "Verified Bathroom",
        actor: user.uid,
        actorName: user.email,
        targetType: "Bathroom",
        targetId: bathroom.id,
        targetName: bathroom.title, 
        details: `Bathroom "${bathroom.title}" verified for facility ${facility.facilityId}`,
      });
    } catch (error) {
      console.error("Error verifying bathroom:", error);
    }
  };
  
  const handleUnverifyBathroom = async (bathroom) => {
    try {
      await unverifyBathroom(bathroom.id);
      setFacilities((prev) =>
        prev.map((b) =>
          b.id === bathroom.id ? { ...b, isVerified: false, facilityID: null } : b
        )
      );
  
      await logActivity({
        action: "Unverified Bathroom",
        actor: user.uid,
        actorName: user.email,
        targetType: "Bathroom",
        targetId: bathroom.id,
        targetName: bathroom.title, 
        details: `Bathroom "${bathroom.title}" unverified for facility ${facility.facilityId}`,
      });
    } catch (error) {
      console.error("Error unverifying bathroom:", error);
    }
  };
  
  const handleDeleteBathroom = async (bathroom) => {
    try {
      await deleteBathroom(bathroom.id);
      setFacilities((prev) => prev.filter((b) => b.id !== bathroom.id));
  
      await logActivity({
        action: "Deleted Bathroom",
        actor: user.uid,
        actorName: user.email,
        targetType: "Bathroom",
        targetId: bathroom.id,
        targetName: bathroom.title,
        details: `Bathroom "${bathroom.title}" deleted from facility ${facility.facilityId}`,
      });
    } catch (error) {
      console.error("Error deleting bathroom:", error);
    }
  };
  
  const handleAddBathroom = async () => {
    try {
      const { latitude, longitude } = newBathroom.geo.geopoint;
      if (!newBathroom.title || !newBathroom.directions || !latitude || !longitude) {
        alert("All fields are required.");
        return;
      }
  
      const addedBathroom = await createBathroom({
        ...newBathroom,
        isVerified: true,
        facilityID: facility.facilityId,
      });
      setFacilities((prev) => [...prev, addedBathroom]);
      setIsModalOpen(false);
      setNewBathroom({ title: "", directions: "", geo: { geopoint: { latitude: "", longitude: "" } } });
  
      await logActivity({
        action: "Added Bathroom",
        actor: user.uid,
        actorName: user.email,
        targetType: "Bathroom",
        targetId: addedBathroom.id,
        targetName: newBathroom.title,
        details: `Bathroom "${newBathroom.title}" added to facility ${facility.facilityId}`,
      });
    } catch (error) {
      console.error("Error adding bathroom:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const AddBathroomOnClick = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const distance = calculateDistance(
          facility.location.latitude,
          facility.location.longitude,
          lat,
          lng
        );
        if (distance <= (facility.jurisdictionRadius || defaultRadius)) {
          const title = prompt("Enter a title for the new bathroom:");
          const directions = prompt("Enter directions for the new bathroom:");
          if (title && directions) {
            createBathroom({
              title,
              directions,
              geo: { geopoint: { latitude: lat, longitude: lng } },
              isVerified: true,
              facilityID: facility.facilityId,
            })
              .then(async (addedBathroom) => {
                setFacilities((prev) => [...prev, addedBathroom]);

                await logActivity({
                  action: "Added Bathroom (Map Click)",
                  actor: user.uid,
                  actorName: user.email,
                  targetType: "Bathroom",
                  targetId: addedBathroom.id,
                  targetName: title,
                  details: `Bathroom "${title}" added to facility ${facility.facilityId} via map click.`,
                });
              })
              .catch((error) => console.error("Error adding bathroom:", error));
          }
        } else {
          alert("Selected location is outside your jurisdiction radius.");
        }
      },
    });
    return null;
  };

  return (
    <div className="facilities-container">
      <h2>Facilities Management</h2>
      <button className="add-bathroom-button" onClick={openModal}>
        Add Bathroom
      </button>
      <ul className="facilities-list">
        {facilities.map((bathroom, index) => (
          <li
            key={index}
            className="facility-item"
            onClick={() => handleFacilityClick(bathroom)}
          >
            <div className="facility-info">
              <h3>{bathroom.title}</h3>
              <p>Directions: {bathroom.directions}</p>
              <p>
                Location: {bathroom.geo.geopoint.latitude}, {bathroom.geo.geopoint.longitude}
              </p>
              <p>
                <FaCommentDots /> {bathroom.comments?.length || 0} Comments
              </p>
              <div className="facility-actions">
                {bathroom.isVerified ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnverifyBathroom(bathroom); 
                    }}
                  >
                    Unverify
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerifyBathroom(bathroom);
                    }}
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBathroom(bathroom); 
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="map-container">
        <MapContainer
          center={[facility.location.latitude, facility.location.longitude]}
          zoom={15}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Circle
            center={[facility.location.latitude, facility.location.longitude]}
            radius={facility.jurisdictionRadius || defaultRadius}
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          />

          {facilities.map((bathroom, index) => (
            <Marker
              key={index}
              position={[bathroom.geo.geopoint.latitude, bathroom.geo.geopoint.longitude]}
              icon={bathroom.isVerified ? verifiedMarkerIcon : unverifiedMarkerIcon}
            >
              <Popup>
                <strong>{bathroom.title}</strong>
                <br />
                {bathroom.directions}
              </Popup>
            </Marker>
          ))}
          <AddBathroomOnClick />
        </MapContainer>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <h3>Add New Bathroom</h3>
          <form className="modal-form">
            <label>Title:</label>
            <input
              type="text"
              value={newBathroom.title}
              onChange={(e) => setNewBathroom({ ...newBathroom, title: e.target.value })}
            />
            <label>Directions:</label>
            <input
              type="text"
              value={newBathroom.directions}
              onChange={(e) => setNewBathroom({ ...newBathroom, directions: e.target.value })}
            />
            <label>Latitude:</label>
            <input
              type="number"
              value={newBathroom.geo.geopoint.latitude || ""}
              onChange={(e) =>
                setNewBathroom({
                  ...newBathroom,
                  geo: { ...newBathroom.geo, geopoint: { ...newBathroom.geo.geopoint, latitude: parseFloat(e.target.value) } },
                })
              }
            />
            <label>Longitude:</label>
            <input
              type="number"
              value={newBathroom.geo.geopoint.longitude || ""}
              onChange={(e) =>
                setNewBathroom({
                  ...newBathroom,
                  geo: { ...newBathroom.geo, geopoint: { ...newBathroom.geo.geopoint, longitude: parseFloat(e.target.value) } },
                })
              }
            />
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="cancel-button">
                Cancel
              </button>
              <button type="button" onClick={handleAddBathroom} className="add-button">
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Facilities;
