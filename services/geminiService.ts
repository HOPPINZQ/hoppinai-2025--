import { GoogleGenAI } from "@google/genai";
import { TIMELINE_EVENTS } from "../data";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateYearlySummary = async (): Promise<string> => {
  const client = getAIClient();
  
  if (!client) {
    // Fallback if no API key is present
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Unable to generate AI summary without API Key. However, 2025 was clearly a year of significant professional growth and personal exploration, marked by travel to Japan and a major career promotion.");
      }, 1500);
    });
  }

  const eventsText = TIMELINE_EVENTS.map(e => 
    `- ${e.date}: ${e.title} (${e.type}). ${e.description}`
  ).join('\n');

  const prompt = `
    You are an enthusiastic personal assistant. 
    Analyze the following timeline of events for the year 2025 and generate a short, inspiring summary paragraph (approx 80 words).
    Highlight the balance between work and life.
    
    Events:
    ${eventsText}
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI. Please try again later.";
  }
};
