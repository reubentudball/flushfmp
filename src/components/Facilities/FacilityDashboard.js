import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
import "./FacilityDashboard.css";
import {
  getBathroomById,
  getReviewsFromBathroom,
  deleteComment,
  deleteReview,
} from "../Repo/bathroomRepository";
import { useUser } from "../context/UserContext";
import flushIcon from "../../assets/toilet.png";

const FacilityDashboard = () => {
  const {facility} = useUser();
  const [cleanlinessData, setCleanlinessData] = useState(null);
  const [commentSentimentData, setCommentSentimentData] = useState(null);
  const [facilityNotFound, setFacilityNotFound] = useState(false);
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const location = useLocation();
  const bathroom = location.state?.bathroom;

  const cleanlinessDescriptions = [
    "Very Messy",
    "Messy",
    "Clean",
    "Very Clean",
    "Spotless",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!bathroom) {
        setFacilityNotFound(true);
        return;
      }
      try {
        setComments(bathroom.comments || []);

        const reviewsData = await getReviewsFromBathroom(bathroom.id);
        setReviews(reviewsData);

        const timestamps = reviewsData.map((review) =>
          new Date(review.createdAt.seconds * 1000).toLocaleDateString()
        );

        const cleanlinessRatings = reviewsData.map(
          (review) => review.cleanliness
        );

        setCleanlinessData({
          labels: timestamps,
          datasets: [
            {
              label: "Cleanliness Score Over Time",
              data: cleanlinessRatings.length > 0 ? cleanlinessRatings : [0],
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
              fill: false,
              tension: 0.3,
            },
          ],
        });

        const sentimentCounts = {
          positive: 0,
          neutral: 0,
          negative: 0,
        };

        bathroom.comments.forEach((comment) => {
          const { sentimentScore } = comment;
          if (sentimentScore > 0.2) {
            sentimentCounts.positive++;
          } else if (sentimentScore >= -0.2 && sentimentScore <= 0.2) {
            sentimentCounts.neutral++;
          } else if (sentimentScore < -0.2) {
            sentimentCounts.negative++;
          }
        });

        setCommentSentimentData({
          labels: ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              label: "Comment Sentiment",
              data: [
                sentimentCounts.positive,
                sentimentCounts.neutral,
                sentimentCounts.negative,
              ],
              backgroundColor: [
                "rgba(75,192,192,0.6)",
                "rgba(255,206,86,0.6)",
                "rgba(255,99,132,0.6)",
              ],
              borderColor: [
                "rgba(75,192,192,1)",
                "rgba(255,206,86,1)",
                "rgba(255,99,132,1)",
              ],
              borderWidth: 2,
            },
          ],
        });

        const lightweightReviewUrl = `${window.location.origin}/submit-review/${bathroom.id}`;

        setQrCodeUrl(lightweightReviewUrl);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [bathroom, bathroom.comments]);

  if (facilityNotFound) {
    return <div>Facility not found. Please check the facility ID.</div>;
  }

  if (!cleanlinessData || !commentSentimentData) {
    return <div>Loading...</div>;
  }

  const handleDeleteComment = async (commentIndex) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const updatedComments = comments.filter(
          (_, index) => index !== commentIndex
        );
        setComments(updatedComments);
        await deleteComment(bathroom.id, commentIndex);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleDeleteReview = async (reviewIndex) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const updatedReviews = reviews.filter(
          (_, index) => index !== reviewIndex
        );
        setReviews(updatedReviews);
        await deleteReview(bathroom.id, reviewIndex);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handlePrint = () => {
    const qrCodeCanvas = document.querySelector('.qr-code canvas');
    const qrCodeDataUri = qrCodeCanvas.toDataURL('image/png');
  
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              text-align: center;
            }
            .poster {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-around;
              height: 100vh;
              box-sizing: border-box;
              padding: 40px;
              background-color: #f9f9f9;
            }
            .branding {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              font-size: 2rem;
              font-weight: bold;
              color: #007bff;
            }
            .branding img {
              width: 50px;
              height: 50px;
            }
            .tagline {
              font-size: 1.5rem;
              margin: 20px 0;
              color: #555;
            }
            .qr-code img {
              margin: 20px auto;
              width: 200px;
              height: 200px;
            }
            .download-links {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              margin-top: 20px;
            }
            .download-text {
              font-size: 1.2rem;
              font-weight: bold;
              color: #007bff;
            }
            .placeholder {
              width: 120px;
              height: 50px;
              background-color: #e0e0e0;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1rem;
              color: #555;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            }
          </style>
        </head>
        <body>
          <div class="poster">
            <div class="branding">
              <img src="${flushIcon}" alt="Flush Logo" />
              <span>${bathroom.title}</span>
            </div>
            <div class="tagline">Leave Your Review Today!</div>
            <div class="qr-code">
              <img src="${qrCodeDataUri}" alt="QR Code" />
            </div>
            <div class="download-links">
              <div class="download-text">Download the official Flush app today!</div>
              <div class="placeholder">iOS</div>
              <div class="placeholder">Play Store</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  

  return (
    <div className="facility-dashboard-container">
      <h2>{bathroom.title} Dashboard</h2>
      <div className="chart-grid">
        <div className="chart-container">
          <h3>Cleanliness Scores Over Time</h3>
          <Line data={cleanlinessData} />
        </div>

        <div className="chart-container">
          <h3>Comment Sentiment</h3>
          <Pie data={commentSentimentData} />
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments and Sentiment Scores</h3>
        {comments.length === 0 ? (
          <p>No comments available for this facility.</p>
        ) : (
          <ul className="comments-list">
            {comments.map((comment, index) => (
              <li key={index} className="comment-item">
                <p>
                  <strong>Comment:</strong> {comment.reviewText}
                </p>
                <p>
                  <strong>Sentiment Score:</strong>{" "}
                  {comment.sentimentScore?.toFixed(2) || "N/A"}
                </p>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteComment(index)}
                >
                  Delete Comment
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews available for this facility.</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <p>
                  <strong>Cleanliness:</strong>{" "}
                  {cleanlinessDescriptions[review.cleanliness - 1] || "Unknown"}
                </p>
                <p>
                  <strong>Traffic:</strong> {review.traffic}
                </p>
                <p>
                  <strong>Size:</strong> {review.size}
                </p>
                <p>
                  <strong>Accessibility Features:</strong>{" "}
                  {review.accessibilityFeatures.join(", ") || "None"}
                </p>
                <p>
                  <strong>Feedback:</strong> {review.feedback || "No comment"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(review.createdAt.seconds * 1000).toLocaleString()}
                </p>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteReview(index)}
                >
                  Delete Review
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="qr-code-section">
        <h3>Manage Reviews</h3>
        <div className="qr-code">
          <QRCodeCanvas value={qrCodeUrl} size={200} />
        </div>
        <button className="print-poster-button" onClick={handlePrint}>
          Print QR Code Poster
        </button>
      </div>
    </div>
  );
};

export default FacilityDashboard;
