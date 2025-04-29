import { Groq } from "groq-sdk";
import dotenv from "dotenv";


dotenv.config();


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


async function analyzeFakeNews(article) {
  const prompt = `Analyze the following news article and determine if it is fake or real. Provide a label ("FAKE" or "REAL") and a confidence score (0-1).

  *Guidelines:*
  - Carefully evaluate the content for misinformation, bias, or lack of credible sources.
  - Consider the tone, language, and factual accuracy of the article.
  - Provide a clear and concise response in JSON format.
  - Do not include any additional text or explanations outside the JSON object.

  *Input Article:*
  ${article}

  Return only a JSON object in this exact format:
  {
    "label": "FAKE" or "REAL",
    "confidence": 0.0 to 1.0
  }`;

  try {
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a fact-checking assistant that evaluates news articles for authenticity and provides a clear verdict with a confidence score.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama3-70b-8192", 
    });

    
    const parsedResponse = JSON.parse(response.choices[0].message.content);

    
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing fake news:", error.message);
    throw new Error("Failed to analyze the news article. Please try again.");
  }
}

export default analyzeFakeNews;
