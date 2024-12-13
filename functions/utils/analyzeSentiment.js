require("dotenv").config();
const axios = require("axios");

const analyzeSentiment = async (text) => {
  const apiKey = "AIzaSyB5UkVsme5DhJOxGPCpc2SysCUueNYeGIY";
  const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;

  const body = {
    document: {
      type: "PLAIN_TEXT",
      content: text,
    },
    encodingType: "UTF8",
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data.documentSentiment.score;
    } else {
      console.error("API failed:", response.data);
      return 0;
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0;
  }
};

module.exports = {analyzeSentiment};
