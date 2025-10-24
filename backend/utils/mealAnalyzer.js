const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze meal text using Gemini API
const analyzeMeal = async (mealText) => {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    // System instruction for the LLM
    const systemInstruction = `
      You are an expert environmental scientist specializing in carbon footprint analysis of food.
      Analyze the provided meal description and estimate its carbon footprint in kg of CO2 equivalent.
      Consider ingredients, portion sizes, and preparation methods.
      Provide a brief explanation of your analysis.
      
      Guidelines:
      - Plant-based meals: 0.5-2.0 kg CO2e
      - Vegetarian with dairy: 1.5-3.0 kg CO2e
      - Meals with chicken/fish: 2.0-5.0 kg CO2e
      - Meals with beef/lamb: 5.0-10.0 kg CO2e
      - Consider portion size in your calculation
    `;

    // Define the response schema
    const generationConfig = {
      temperature: 0.2,
      responseSchema: {
        type: "object",
        properties: {
          carbon_kg: {
            type: "number",
            description: "Estimated carbon footprint in kg CO2e"
          },
          explanation: {
            type: "string",
            description: "Brief explanation of the carbon footprint calculation"
          }
        },
        required: ["carbon_kg", "explanation"]
      }
    };

    // Generate content with the model
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: mealText }]
        }
      ],
      systemInstruction,
      generationConfig
    });

    const response = result.response;
    const responseJson = JSON.parse(response.text());

    return {
      carbon_kg: responseJson.carbon_kg,
      explanation: responseJson.explanation
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return fallback values
    return {
      carbon_kg: 3.0,
      explanation: 'Unable to analyze meal. Using default values.'
    };
  }
};

module.exports = { analyzeMeal };