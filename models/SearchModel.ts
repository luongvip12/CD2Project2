
import { GoogleGenAI } from "@google/genai";

export interface SearchResult {
  text: string;
  sources: any[];
}

export class SearchModel {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  }

  // Phương thức "query" dữ liệu từ AI Database
  async findByQuery(prompt: string): Promise<SearchResult> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
    };
  }
}
