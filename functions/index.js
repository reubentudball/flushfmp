
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
                      comment.sentimentScore = sentimentScore; 
                      comment.processed = true; 
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


exports.calculateHealthScores = onSchedule("every 24 hours", async (event) => {
  console.log("Running scheduled health score calculation...");

  try {
    const bathroomsSnapshot = await db.collection("Bathroom").get();

    if (bathroomsSnapshot.empty) {
      console.log("No bathrooms found.");
      return;
    }

    for (const bathroomDoc of bathroomsSnapshot.docs) {
      const bathroomId = bathroomDoc.id;

      let cleanlinessWeight = 0;
      let commentWeight = 0;

      const cleanWeightValue = 0.75; 
      const commentWeightValue = 0.25;

      const reviewsSnapshot = await db
        .collection("Bathroom")
        .doc(bathroomId)
        .collection("Reviews")
        .get();

      const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
      const bathroomReviewsCount = reviews.length;

      if (bathroomReviewsCount > 0) {
        const totalCleanlinessScore = reviews.reduce(
          (sum, review) => sum + Math.min(5, review.cleanliness || 1), 
          0
        );

        cleanlinessWeight =
          ((totalCleanlinessScore / bathroomReviewsCount) / 5) * 100 * cleanWeightValue;
      }

      const comments = bathroomDoc.data().comments || [];
      const totalCommentCount = comments.length;

      for (const comment of comments) {
        if (comment.processed && comment.sentimentScore !== undefined) {
          const normalizedSentiment = Math.max(0, Math.min(1, comment.sentimentScore));
          commentWeight += normalizedSentiment;
        }
      }

      if (totalCommentCount > 0) {
        commentWeight = (commentWeight / totalCommentCount) * 100 * commentWeightValue;
      }

      cleanlinessWeight = Math.max(0, cleanlinessWeight);
      commentWeight = Math.max(0, commentWeight);

      const healthScore = Math.min(100, cleanlinessWeight + commentWeight); 

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


exports.calculateAverageScores = onSchedule("every 24 hours", async (context) => {
  console.log("Running scheduled average score calculation...");

  try {
    const bathroomsSnapshot = await db.collection("Bathroom").get();

    if (bathroomsSnapshot.empty) {
      console.log("No bathrooms found.");
      return;
    }

    for (const bathroomDoc of bathroomsSnapshot.docs) {
      const bathroomId = bathroomDoc.id;
      const reviewsCollection = db.collection(`Bathroom/${bathroomId}/Reviews`);
      const reviewsSnapshot = await reviewsCollection.get();

      if (reviewsSnapshot.empty) {
        console.log(`No reviews for bathroom: ${bathroomId}`);
        continue;
      }

      let cleanlinessSum = 0;
      let trafficSum = 0;
      let sizeSum = 0;
      let reviewCount = 0;

      reviewsSnapshot.forEach((reviewDoc) => {
        const reviewData = reviewDoc.data();
        cleanlinessSum += reviewData.cleanliness || 0;
        trafficSum += reviewData.traffic || 0;
        sizeSum += reviewData.size || 0;
        reviewCount++;
      });

      const cleanlinessScore = reviewCount > 0 ? (cleanlinessSum / reviewCount) : 0;
      const trafficScore = reviewCount > 0 ? (trafficSum / reviewCount) : 0;
      const sizeScore = reviewCount > 0 ? (sizeSum / reviewCount) : 0;

      await db.collection("Bathroom").doc(bathroomId).update({
        cleanlinessScore,
        trafficScore,
        sizeScore,
      });

      console.log(`Updated bathroom ${bathroomId} with:
        Cleanliness: ${cleanlinessScore.toFixed(1)} stars,
        Traffic: ${trafficScore.toFixed(1)} stars,
        Size: ${sizeScore.toFixed(1)} stars`);
    }

    console.log("Average score calculation completed.");
  } catch (error) {
    console.error("Error calculating average scores:", error);
  }
});