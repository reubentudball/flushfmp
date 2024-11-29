
/*eslint-disable */

/**
 * Firebase Functions Index File
 * This includes cloud functions for facility key generation and comment sentiment analysis.
 */



// Import necessary modules
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { analyzeSentiment } = require("./utils/analyzeSentiment"); 

admin.initializeApp();

const db = admin.firestore();


exports.analyzeSentiments = onSchedule("every 24 hours", async (event) => {
  console.log("Running scheduled sentiment analysis...");

  try {
      const bathroomsSnapshot = await db.collection("Bathroom").get();
      if (bathroomsSnapshot.empty) {
          console.log("No bathrooms found.");
          return;
      }

      for (const bathroomDoc of bathroomsSnapshot.docs) {
          const bathroomData = bathroomDoc.data();
          const bathroomId = bathroomDoc.id;

          const comments = bathroomData.comments || [];
          let processedCount = 0;

          for (const comment of comments) {
              if (!comment.processed) {
                  try {
                      const sentimentScore = await analyzeSentiment(comment.reviewText);
                      comment.sentimentScore = sentimentScore; // Add sentiment score
                      comment.processed = true; // Mark as processed
                      processedCount++;
                  } catch (err) {
                      console.error(`Error processing comment for bathroom ${bathroomId}:`, err);
                  }
              }
          }

          if (processedCount > 0) {
              await db.collection("Bathroom").doc(bathroomId).update({
                  comments: comments,
              });
              console.log(`Updated comments for bathroom ${bathroomId}.`);
          }
      }

      console.log("Sentiment analysis completed.");
  } catch (error) {
      console.error("Error running sentiment analysis:", error);
  }
});


exports.calculateHealthScores = onSchedule("every day at 12:30 AM", async (event) => {
  console.log("Running scheduled health score calculation...");

  try {
      const bathroomsSnapshot = await db.collection("Bathroom").get();
      if (bathroomsSnapshot.empty) {
          console.log("No bathrooms found.");
          return;
      }

      for (const bathroomDoc of bathroomsSnapshot.docs) {
          const bathroomData = bathroomDoc.data();
          const bathroomId = bathroomDoc.id;

          let cleanlinessWeight = 0;
          let commentWeight = 0;

          const cleanWeightValue = 0.75;
          const commentWeightValue = 0.25;

          const reviews = bathroomData.reviews || [];
          for (const review of reviews) {
              const cleanliness = review.cleanliness;
              if (cleanliness === "Very Clean") cleanlinessWeight += 4.0;
              else if (cleanliness === "Clean") cleanlinessWeight += 3.0;
              else if (cleanliness === "Messy") cleanlinessWeight += 2.0;
              else if (cleanliness === "Very Messy") cleanlinessWeight += 1.0;
          }

          if (reviews.length > 0) {
              cleanlinessWeight = 
                  (((cleanlinessWeight / reviews.length) / 4.0) * 100) * cleanWeightValue;
          }

          const comments = bathroomData.comments || [];
          for (const comment of comments) {
              if (comment.processed && comment.sentimentScore !== undefined) {
                  commentWeight += comment.sentimentScore;
              }
          }

          if (comments.length > 0) {
              commentWeight = (commentWeight / comments.length) * 100 * commentWeightValue;
          }

          const healthScore = cleanlinessWeight + commentWeight;

          await db.collection("Bathroom").doc(bathroomId).update({
              healthScore: healthScore,
          });

          console.log(`Updated bathroom ${bathroomId} with health score ${healthScore}.`);
      }

      console.log("Health score calculation completed.");
  } catch (error) {
      console.error("Error calculating health scores:", error);
  }
});

exports.updateBathroomScores = onDocumentCreated(
  "Bathroom/{bathroomId}/Reviews/{reviewId}",
  async (event) => {
    console.log("Updating bathroom scores due to new or updated review...");

    try {
      const { bathroomId } = event.params;

      const reviewsSnapshot = await db
        .collection(`Bathroom/${bathroomId}/Reviews`)
        .get();

      if (reviewsSnapshot.empty) {
        console.log(`No reviews found for Bathroom ${bathroomId}`);
        return;
      }

      let totalCleanliness = 0;
      let totalQuietness = 0;
      let totalAccessibility = 0;
      const reviewCount = reviewsSnapshot.size;

      reviewsSnapshot.forEach((doc) => {
        const review = doc.data();
        totalCleanliness += mapScore(review.cleanliness);
        totalQuietness += mapScore(review.traffic);
        totalAccessibility += review.accessibility ? 1 : 0;
      });

      const cleanlinessScore = totalCleanliness / reviewCount;
      const quietnessScore = totalQuietness / reviewCount;
      const accessibilityScore = (totalAccessibility / reviewCount) * 100;

      const healthScore =
        cleanlinessScore * 0.5 +
        quietnessScore * 0.3 +
        accessibilityScore * 0.2;

      await db.collection("Bathroom").doc(bathroomId).update({
        cleanlinessScore,
        quietnessScore,
        accessibilityScore,
        healthScore,
      });

      console.log(
        `Updated scores for Bathroom ${bathroomId}: Cleanliness (${cleanlinessScore}), Quietness (${quietnessScore}), Accessibility (${accessibilityScore}), Health (${healthScore})`
      );
    } catch (error) {
      console.error("Error updating bathroom scores:", error);
    }
  }
);

function mapScore(value) {
  switch (value) {
    case "Very Clean":
    case "Very Quiet":
      return 4;
    case "Clean":
    case "Quiet":
      return 3;
    case "Messy":
    case "Noisy":
      return 2;
    case "Very Messy":
    case "Very Noisy":
      return 1;
    default:
      return 0;
  }
}
