
import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types.ts";

export const generateMOEMSProblemBatch = async (category: Category | 'Random') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a MOEMS (Math Olympiads for Elementary and Middle Schools) contest creator. 
               Generate a "Training Pack" of exactly 5 challenging but fair problems for a 6th grader (Division E or M).
               ${category !== 'Random' ? `The primary focus must be: ${category}.` : 'Provide a diverse mix of categories: Geometry, Number Theory, Logic, Algebra, and Fractions.'}
               
               For each problem:
               1. Focus on clever logic rather than heavy calculation.
               2. Identify mathematical symbols and provide clear definitions.
               3. Ensure answers are short (usually integers or simple fractions).
               
               Return the response in JSON as an array of 5 objects.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            problem: { type: Type.STRING },
            latex: { type: Type.STRING },
            explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            category: { type: Type.STRING },
            division: { type: Type.STRING },
            symbols: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["symbol", "meaning"]
              }
            }
          },
          required: ["title", "problem", "explanation", "answer", "category", "division"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const fetchSymbolDefinitions = async (problemText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Examine the following Math Olympiad problem and extract every mathematical symbol, operation, or complex notation.
               Provide a clear, simple definition for each one suitable for a 6th grader.
               Problem: "${problemText}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbols: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                meaning: { type: Type.STRING }
              },
              required: ["symbol", "meaning"]
            }
          }
        },
        required: ["symbols"]
      }
    }
  });
  return JSON.parse(response.text).symbols;
};

export const discoverProblemsFromWeb = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert researcher of Math Olympiad past papers. Find an EXACT problem from the MOEMS (Math Olympiads for Elementary and Middle Schools) Division M or E official papers for the query: "${query}". 
               Do not invent a problem. Look for official PDFs or contest archives.
               Identify any symbols used and define them.
               
               Format the response in JSON with:
               - "problem": the exact question text
               - "latex": any formulas in LaTeX
               - "explanation": step by step guide
               - "answer": the final result
               - "source_year": the specific year
               - "source_contest": the contest number
               - "symbols": [{"symbol": "...", "meaning": "..."}]`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING },
          latex: { type: Type.STRING },
          explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
          source_year: { type: Type.STRING },
          source_contest: { type: Type.STRING },
          symbols: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                meaning: { type: Type.STRING }
              },
              required: ["symbol", "meaning"]
            }
          }
        },
        required: ["problem", "explanation", "answer"]
      }
    }
  });

  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = grounding.map((chunk: any) => ({
    title: chunk.web?.title || 'Official MOEMS Archive',
    uri: chunk.web?.uri || '#'
  })).filter((s: any) => s.uri !== '#');

  return {
    data: JSON.parse(response.text),
    sources: sources
  };
};

export const solveCustomProblem = async (problemDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a world-class math tutor for 6th graders. Solve this MOEMS problem: "${problemDescription}". 
               Provide a clear, encouraging, step-by-step breakdown. Also define any symbols used.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING },
          latex: { type: Type.STRING },
          explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
          category: { type: Type.STRING },
          symbols: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                meaning: { type: Type.STRING }
              },
              required: ["symbol", "meaning"]
            }
          }
        },
        required: ["problem", "explanation", "answer", "category"]
      }
    }
  });

  return JSON.parse(response.text);
};
