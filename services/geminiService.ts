import { GoogleGenAI, Type } from "@google/genai";
import { DesignState, BrandIssue, HeatmapPoint, TESCO_BLUE, TESCO_RED } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

// Helper to sanitize JSON response
function cleanJson(text: string): string {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

/**
 * Checks the current design against "Tesco" brand guidelines.
 * Simulates a brand book check:
 * - Primary color must be Tesco Blue (#00539F)
 * - Accent must be Tesco Red (#E11C1B) or white/yellow for promos
 * - Font must be sans-serif (Inter/Arial)
 */
export const checkBrandAlignment = async (state: DesignState): Promise<BrandIssue[]> => {
  const prompt = `
    You are the Brand Guardian for Tesco. Analyze the following creative design configuration and identify violations of the brand guidelines.
    
    Brand Guidelines:
    1. Primary Color MUST be exactly '${TESCO_BLUE}' (Tesco Blue).
    2. Accent Color MUST be '${TESCO_RED}' (Tesco Red) or White.
    3. Font Family must be 'Inter', 'Arial', or 'Helvetica'. Serif fonts are strictly forbidden.
    4. Headline must be friendly, helpful, and value-driven. No aggressive hard-selling (e.g., avoid "BUY NOW OR DIE").
    
    Current Design Configuration:
    ${JSON.stringify(state, null, 2)}
    
    Return a JSON array of objects representing issues. 
    Each object must have:
    - id: string
    - severity: "critical" | "warning" | "info"
    - message: string (short description of the violation)
    - suggestion: string (how to fix it)
    - fixedState: object (Partial<DesignState> containing strictly the keys and values needed to fix the issue automatically).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              severity: { type: Type.STRING },
              message: { type: Type.STRING },
              suggestion: { type: Type.STRING },
              fixedState: {
                type: Type.OBJECT,
                properties: {
                    primaryColor: { type: Type.STRING, nullable: true },
                    accentColor: { type: Type.STRING, nullable: true },
                    fontFamily: { type: Type.STRING, nullable: true },
                    headline: { type: Type.STRING, nullable: true },
                },
                nullable: true
              }
            },
            required: ["id", "severity", "message", "suggestion"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(cleanJson(text)) as BrandIssue[];
  } catch (error) {
    console.error("Brand check failed:", error);
    return [];
  }
};

/**
 * Generates predictive heatmap points based on the text and layout description.
 * (In a real scenario, this would analyze the actual image bytes).
 */
export const generateHeatmapData = async (state: DesignState): Promise<HeatmapPoint[]> => {
  const prompt = `
    Predict user attention (eye-tracking heatmap) for a retail banner with these elements:
    Headline: "${state.headline}" (Top Center)
    CTA: "${state.ctaText}" (Bottom Right)
    Image: Product shot (Center)
    
    Return a JSON array of 5-8 heatmap points.
    Each point has:
    - x: number (0-100 percentage from left)
    - y: number (0-100 percentage from top)
    - intensity: number (0.5-1.0)
    
    Focus attention on the Headline (approx x=50, y=20) and CTA (approx x=80, y=80).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              intensity: { type: Type.NUMBER }
            },
            required: ["x", "y", "intensity"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(cleanJson(text)) as HeatmapPoint[];
  } catch (error) {
    console.error("Heatmap generation failed:", error);
    return [];
  }
};

/**
 * Localizes the content to a target language while maintaining brand voice.
 */
export const localizeContent = async (state: DesignState, targetLanguage: string): Promise<Partial<DesignState>> => {
  const prompt = `
    Translate the following marketing copy to ${targetLanguage}.
    Maintain a friendly, helpful, and value-focused tone consistent with a major family-friendly retailer.
    
    Headline: "${state.headline}"
    Subheadline: "${state.subheadline}"
    CTA: "${state.ctaText}"
    
    Return JSON with translated keys: headline, subheadline, ctaText.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                ctaText: { type: Type.STRING }
            }
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error("Localization failed:", error);
    return {};
  }
};

/**
 * Suggests a creative refresh based on a context (e.g. "Summer Sale").
 */
export const getAiSuggestions = async (context: string): Promise<Partial<DesignState>> => {
  const prompt = `
    Generate a creative configuration for a retail banner.
    Context: "${context}".
    
    Brand Guidelines:
    - Primary Color: ${TESCO_BLUE}
    - Accent Color: ${TESCO_RED}
    - Font: Inter
    
    Return JSON with:
    - headline (Catchy, max 6 words)
    - subheadline (Value prop, max 10 words)
    - ctaText (Action oriented)
    - layoutMode (standard, seasonal, or promo)
  `;

  try {
     const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                ctaText: { type: Type.STRING },
                layoutMode: { type: Type.STRING, enum: ["standard", "seasonal", "promo"] }
            }
        }
      }
    });
    const text = response.text || "{}";
    return JSON.parse(cleanJson(text));
  } catch (error) {
      console.error("Suggestion failed", error);
      return {};
  }
};