import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

export const handler = async (event) => {
  const prompt = event.queryStringParameters.text

  const result = await model.generateContent(prompt);
  const geminiresponse = await result.response;
  const text = geminiresponse.text();

  const response = {
    statusCode: 200,
    body: JSON.stringify(text),
  };
  return response;
  
};
