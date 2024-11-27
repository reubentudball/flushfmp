
/*eslint-disable */

/**
 * Firebase Functions Index File
 * This includes cloud functions for facility key generation and comment sentiment analysis.
 */



// Import necessary modules
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { v4: uuidv4 } = require("uuid"); // UUID library for generating unique keys
const admin = require("firebase-admin");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { analyzeSentiment } = require("./utils/analyzeSentiment"); // Import analyzeSentiment function

// Initialize Firebase Admin SDK
admin.initializeApp();

// Firestore instance
const db = admin.firestore();


exports.calculateHealthScores = onSchedule("every 24 hours", async (event) => {
    console.log("Running scheduled health score calculation...");
  
    try {
      // Fetch all bathrooms
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
        let processedCount = 0;
  
        // Weights
        const cleanWeightValue = 0.75;
        const commentWeightValue = 0.25;
  
        // Process cleanliness reviews
        const reviews = bathroomData.reviews || [];
        for (const review of reviews) {
          const cleanliness = review.cleanliness;
          if (cleanliness === "Very Clean") cleanlinessWeight += 4.0;
          else if (cleanliness === "Clean") cleanlinessWeight += 3.0;
          else if (cleanliness === "Messy") cleanlinessWeight += 2.0;
          else if (cleanliness === "Very Messy") cleanlinessWeight += 1.0;
        }
  
        // Normalize cleanliness weight
        if (reviews.length > 0) {
          cleanlinessWeight = 
            (((cleanlinessWeight / reviews.length) / 4.0) * 100) * cleanWeightValue;
        }
  
        // Process unprocessed comments
        const comments = bathroomData.comments || [];
        for (const comment of comments) {
          if (!comment.processed) {
            try {
              const sentimentScore = await analyzeSentiment(comment.reviewText);
              commentWeight += sentimentScore;
              comment.processed = true;
              processedCount++;
            } catch (err) {
              console.error(`Error processing comment for bathroom ${bathroomId}:`, err);
            }
          }
        }
  
        // Normalize comment weight
        if (processedCount > 0) {
          commentWeight = (commentWeight / processedCount) * 100 * commentWeightValue;
        }
  
        // Calculate health score
        const healthScore = cleanlinessWeight + commentWeight;
  
        // Update Firestore
        await db.collection("Bathroom").doc(bathroomId).update({
          comments: comments,
          healthScore: healthScore,
        });
  
        console.log(`Updated bathroom ${bathroomId} with health score ${healthScore}.`);
      }
  
      console.log("Health score calculation completed.");
    } catch (error) {
      console.error("Error calculating health scores:", error);
    }
  });