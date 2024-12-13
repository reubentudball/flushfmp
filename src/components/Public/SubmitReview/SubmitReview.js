import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createReview } from "../../Repo/bathroomRepository";
import flushLogo from "../../../assets/FlushLogo.png";
import "./SubmitReview.css";

const SubmitReview = () => {
  const { bathroomId } = useParams();
  const [cleanliness, setCleanliness] = useState(3);
  const [traffic, setTraffic] = useState(3);
  const [size, setSize] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [selectedAccessibilityFeatures, setSelectedAccessibilityFeatures] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const accessibilityOptions = [
    "Wheelchair Accessible",
    "Braille Signage",
    "Elevator Access",
    "Automatic Doors",
    "Accessible Parking",
    "Grab Bars",
    "Low Counters",
    "Wide Doorways",
  ];

  const toggleAccessibilityFeature = (feature) => {
    setSelectedAccessibilityFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const newReview = {
      cleanliness,
      traffic,
      size,
      feedback,
      accessibilityFeatures: selectedAccessibilityFeatures,
      userId: "Anonymous",
      createdAt: new Date(),
    };

    try {
      await createReview(bathroomId, newReview);
      setSuccessMessage("Thank you for your review!");
      setCleanliness(3);
      setTraffic(3);
      setSize(3);
      setFeedback("");
      setSelectedAccessibilityFeatures([]);
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderRating = (rating, setRating) => {
    return (
      <div className="rating-bar">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            className={`rating-item ${rating >= value ? "active" : ""}`}
            onClick={() => setRating(value)}
          >
            {value}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="submit-review-container">
      <div className="submit-review-logo">
        <img src={flushLogo} alt="Flush Logo" />
      </div>

      <h1 className="submit-review-header">Leave a Review</h1>

      <form onSubmit={handleSubmit} className="submit-review-form">
        <label className="submit-review-label">
          Cleanliness:
          {renderRating(cleanliness, setCleanliness)}
        </label>

        <label className="submit-review-label">
          Traffic:
          {renderRating(traffic, setTraffic)}
        </label>

        <label className="submit-review-label">
          Size (Stalls):
          {renderRating(size, setSize)}
        </label>

        <fieldset className="submit-review-fieldset">
          <legend>Accessibility Features:</legend>
          {accessibilityOptions.map((feature) => (
            <div key={feature} className="submit-review-accessibility-feature">
              <label>
                <input
                  type="checkbox"
                  checked={selectedAccessibilityFeatures.includes(feature)}
                  onChange={() => toggleAccessibilityFeature(feature)}
                />
                {feature}
              </label>
            </div>
          ))}
        </fieldset>

        <textarea
          className="submit-review-textarea"
          rows="5"
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          className="submit-review-button"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {successMessage && (
        <p className="submit-review-success-message">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="submit-review-error-message">{errorMessage}</p>
      )}

      <div className="submit-review-app-promotion">
        <h2 className="submit-review-app-promotion-header">Download the Flush App!</h2>
        <p className="submit-review-app-promotion-description">
          Experience a seamless way to discover and review bathrooms!
        </p>
        <div className="submit-review-app-buttons">
          <button className="submit-review-app-button submit-review-app-button-ios">
            Get it on iOS
          </button>
          <button className="submit-review-app-button submit-review-app-button-android">
            Get it on Android
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;