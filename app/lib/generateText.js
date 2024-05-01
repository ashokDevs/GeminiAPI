const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const buffer = require("buffer");

const MODEL_NAME = "gemini-1.0-pro-vision-latest";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Use environment variables for API key

// Function to generate text from an image buffer
async function generateText(imageBuffer) {
  try {
    // Create a new instance of GoogleGenerativeAI with the API key
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Get the generative model with the specified model name
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Configuration for content generation
    const generationConfig = {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    // Safety settings to avoid generating harmful content
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Prepare parts for content generation
    const parts = [
      { text: "rate this person face out of 10 " }, // Adjust prompt as needed
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: Buffer.from(imageBuffer).toString("base64"),
        },
      },
      { text: "\n\n" },
    ];

    // Generate content based on the parts, configuration, and safety settings
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    // Return the generated text from the response
    return result.response.text();
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error generating text from image:", error);
    throw error;
  }
}

module.exports = generateText;
