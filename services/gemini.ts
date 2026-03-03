
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getShoppingAdvice = async (query: string, products: Product[]) => {
  try {
    const productContext = products.map(p => `${p.name} (৳${p.price.toLocaleString()}): ${p.description}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful premium tech assistant for "Neeedy", a leading tech store. 
      Available Gadgets:
      ${productContext}

      User Query: ${query}

      Your advice should be concise, tech-savvy, friendly, and helpful. All prices are in BDT (৳). 
      Recommend specific gadgets like high-speed chargers, TWS earbuds, or over-ear headphones if they match the user's needs.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble accessing our gadget hub database. How else can we help you today?";
  }
};

export const generateProductDescription = async (productName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a sleek tech description for an electronics product named "${productName}". Use a professional tone. Keep it under 50 words.`,
  });
  return response.text;
};
