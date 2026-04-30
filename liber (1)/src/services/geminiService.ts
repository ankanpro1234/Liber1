import { GoogleGenAI, Type } from "@google/genai";
import { Book, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getRecommendations(profile: UserProfile, allBooks: Book[]): Promise<string[]> {
  const prompt = `
    Based on the following user profile:
    Preferences: ${profile.preferences?.genres.join(', ') || 'None'}
    Reading History (Book Titles): ${profile.readingHistory?.join(', ') || 'None'}

    Recommend at most 5 books from the available list below. Return ONLY a JSON array of book IDs.
    Available Books:
    ${allBooks.map(b => `${b.id}: ${b.title} by ${b.author} (Genre: ${b.category})`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function searchBooksAI(query: string, allBooks: Book[]): Promise<string[]> {
  const prompt = `
    Find books that match the search query: "${query}"
    Available Books:
    ${allBooks.map(b => `${b.id}: ${b.title} by ${b.author} (${b.category}) - ${b.description}`).join('\n')}

    Return ONLY a JSON array of book IDs that are most relevant.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini search Error:", error);
    return [];
  }
}
