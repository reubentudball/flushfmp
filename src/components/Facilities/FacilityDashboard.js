import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import "./FacilityDashboard.css";
import {
  getBathroomById,
  getReviewsFromBathroom,
  deleteComment,
  deleteReview,
} from "../Repo/bathroomRepository";

const FacilityDashboard = ({ facilityName }) => {
  const [cleanlinessData, setCleanlinessData] = useState(null);
  const [commentSentimentData, setCommentSentimentData] = useState(null);
  const [facilityNotFound, setFacilityNotFound] = useState(false);
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);

  const location = useLocation();
  const facilityId = location.state?.facilityId;

  const cleanlinessMap = {
    "Very Clean": 4,
    Clean: 3,
    Messy: 2,
    "Very Messy": 1,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!facilityId) {
        setFacilityNotFound(true);
        return;
      }

      try {
        const facility = await getBathroomById(facilityId);
        if (!facility) {
          setFacilityNotFound(true);
          return;
        }

        setComments(facility.comments || []);

        const reviewsData = await getReviewsFromBathroom(facilityId);
        setReviews(reviewsData);

        const timestamps = reviewsData.map((_, i) => {
          const fakeDate = new Date();
          fakeDate.setDate(fakeDate.getDate() - (reviewsData.length - i) * 7);
          return fakeDate.toLocaleDateString();
        });

        const cleanlinessRatings = reviewsData.map(
          (review) => cleanlinessMap[review.cleanliness] || 0
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

        facility.comments.forEach((comment) => {
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
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [facilityId]);

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
        await deleteComment(facilityId, commentIndex);
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
        await deleteReview(facilityId, reviewIndex);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <div className="facility-dashboard-container">
      <h2>{facilityName} Dashboard</h2>
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
                  <strong>Cleanliness:</strong> {review.cleanliness} (
                  {cleanlinessMap[review.cleanliness]} out of 4)
                </p>
                <p>
                  <strong>Review Text:</strong> {review.feedback || "No comment"}
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
    </div>
  );
};

export default FacilityDashboard;
