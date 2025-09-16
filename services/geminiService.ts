import { GoogleGenAI } from "@google/genai";
import type { ReadingLogEntry } from "../types";

// FIX: Per coding guidelines, API_KEY from process.env.API_KEY is always assumed to be present.
// The constructor now directly uses process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeStudentReadings = async (logs: ReadingLogEntry[]): Promise<string> => {
  // FIX: Per coding guidelines, API_KEY from process.env.API_KEY is always assumed to be present, so this check is removed.
  const prompt = `
You are an expert reading coach providing insights to a teacher about a student.
Analyze the following reading logs, provided in JSON format, for this student.

Based on the data:
1.  Write a concise summary of the student's reflections and recent reading activities. Note any patterns in their thoughts (e.g., focus on action, characters, etc.).
2.  Identify the student's preferred genres based on the 'genre' field.
3.  Suggest three specific, new book titles that the student might enjoy. For each book, provide a one-sentence explanation for why it's a good recommendation based on their reading history.

Format your response in clear, easy-to-read markdown. Use headings for each section.

Student's reading logs:
${JSON.stringify(logs, null, 2)}
`;

  try {
    // FIX: model name string is passed directly as per guidelines.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for student analysis:", error);
    return "An error occurred while analyzing the reading data. Please check the console for details.";
  }
};


export const analyzeClassReadings = async (logs: ReadingLogEntry[]): Promise<string> => {
  // FIX: Per coding guidelines, API_KEY from process.env.API_KEY is always assumed to be present, so this check is removed.
  const prompt = `
You are an AI teaching assistant analyzing a 6th-grade class's reading habits.
Based on the entire class's reading logs (provided as a JSON array):
1.  Identify the Top 3 Most Popular Genres in the class.
2.  List the 3 Most Frequently Read Books, if any stand out.
3.  Provide one actionable insight or suggestion for the teacher. For example, is there an under-represented genre they could introduce? Or a common theme the class is exploring that could be a topic for discussion?

Format your response in clear, easy-to-read markdown.

Class reading logs:
${JSON.stringify(logs, null, 2)}
`;

  try {
    // FIX: model name string is passed directly as per guidelines.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for class analysis:", error);
    return "An error occurred while analyzing class data.";
  }
};


export const generateBookCover = async (title: string, author: string): Promise<string> => {
  // FIX: Per coding guidelines, API_KEY from process.env.API_KEY is always assumed to be present, so this check is removed.
  const prompt = `Generate a unique and artistic book cover for a young adult novel titled "${title}" by ${author}. The style should be imaginative, colorful, and suitable for middle school readers. The cover must not contain any text, words, or letters.`;

  try {
    // FIX: model name string is passed directly and outputMimeType is updated as per guidelines.
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '3:4',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    return "";
  } catch (error) {
    console.error(`Error generating cover for "${title}":`, error);
    return "";
  }
};

export const generateBookFeedback = async (log: ReadingLogEntry): Promise<string> => {
  const prompt = `
You are a supportive and encouraging 6th-grade reading teacher.
A student has submitted the following reading log entry.
Book: "${log.bookTitle}"
Student's Reflection: "${log.quickThought || log.deepDiveAnalysis}"

Write a short, positive, and constructive feedback comment (2-3 sentences).
- Acknowledge their thought.
- Ask a gentle, open-ended question to encourage deeper thinking.
- Keep the tone encouraging and friendly.
`;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for feedback generation:", error);
    return "Could not generate feedback due to an error.";
  }
};