import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import './FacilityDashboard.css';
import { analyzeSentiment } from '../Util/SentimentAnalysis';
import { getBathroomById, getReviewsFromBathroom } from '../Repo/bathroomRepository';

const FacilityDashboard = ({ facilityName }) => {
  const [cleanlinessData, setCleanlinessData] = useState(null);
  const [commentSentimentData, setCommentSentimentData] = useState(null);
  const [facilityNotFound, setFacilityNotFound] = useState(false);
  const [commentsWithSentiment, setCommentsWithSentiment] = useState([]); 
  const [reviews, setReviews] = useState([]); 

  const location = useLocation();
  const facilityId = location.state?.facilityId;

  // Map cleanliness strings to numerical values for chart plotting
  const cleanlinessMap = {
    'Very Clean': 4,
    'Clean': 3,
    'Messy': 2,
    'Very Messy': 1,
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

        // Fetch reviews for the bathroom
        const reviewsData = await getReviewsFromBathroom(facilityId);
        setReviews(reviewsData); 

        // Create cleanliness data over time, assuming each review happened at a fixed interval
        const timestamps = reviewsData.map((_, i) => {
          // Simulate timestamps (e.g., review every 7 days)
          const fakeDate = new Date();
          fakeDate.setDate(fakeDate.getDate() - (reviewsData.length - i) * 7); // Spread reviews over weeks
          return fakeDate.toLocaleDateString(); // Convert to readable format
        });

        const cleanlinessRatings = reviewsData.map(review => cleanlinessMap[review.cleanliness] || 0);

        setCleanlinessData({
          labels: timestamps, // Simulated review dates
          datasets: [{
            label: 'Cleanliness Score Over Time',
            data: cleanlinessRatings.length > 0 ? cleanlinessRatings : [0],
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: false, // Line should not be filled below
            tension: 0.3, // Add some curvature to the line
          }],
        });

        // Process comments and analyze sentiment
        let sentimentScores = [];
        let commentsData = [];
        if (facility.comments && facility.comments.length > 0) {
          for (const comment of facility.comments) {
            const score = await analyzeSentiment(comment);
            sentimentScores.push(score);
            commentsData.push({ text: comment, sentimentScore: score });
          }
        }

        setCommentsWithSentiment(commentsData);

        setCommentSentimentData({
          labels: ['Positive', 'Neutral', 'Negative'],
          datasets: [{
            label: 'Comment Sentiment',
            data: [
              sentimentScores.filter(score => score > 0.2).length, // Positive
              sentimentScores.filter(score => score >= -0.2 && score <= 0.2).length, // Neutral
              sentimentScores.filter(score => score < -0.2).length, // Negative
            ],
            backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,206,86,0.6)', 'rgba(255,99,132,0.6)'],
            borderColor: ['rgba(75,192,192,1)', 'rgba(255,206,86,1)', 'rgba(255,99,132,1)'],
            borderWidth: 2,
          }],
        });

      } catch (error) {
        console.error('Error fetching data', error);
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
        {commentsWithSentiment.length === 0 ? (
          <p>No comments available for this facility.</p>
        ) : (
          <ul className="comments-list">
            {commentsWithSentiment.map((commentData, index) => (
              <li key={index} className="comment-item">
                <p><strong>Comment:</strong> {commentData.text}</p>
                <p><strong>Sentiment Score:</strong> {commentData.sentimentScore.toFixed(2)}</p>
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
                <p><strong>Cleanliness:</strong> {review.cleanliness} ({cleanlinessMap[review.cleanliness]} out of 4)</p>
                <p><strong>Review Text:</strong> {review.comment || "No comment"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FacilityDashboard;
