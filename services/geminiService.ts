
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || "";

/**
 * AI Service (Controller Layer Logic)
 */
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Tìm kiếm thông tin với Search Grounding (gemini-3-flash-preview)
   */
  async searchWithGrounding(prompt: string): Promise<{ text: string; sources: any[] }> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      return {
        text: response.text || "Không tìm thấy kết quả.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      };
    } catch (error) {
      console.error("Search Grounding Error:", error);
      throw error;
    }
  }

  /**
   * Chỉnh sửa hình ảnh bằng Text Prompt (gemini-2.5-flash-image)
   */
  async editImage(base64Image: string, prompt: string): Promise<string | null> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image Edit Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
