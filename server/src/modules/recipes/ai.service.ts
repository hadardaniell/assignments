import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { RecipeDTO } from './recipe.types';
import { AppError } from '../../common';

export class AIService {
    private readonly genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    public async generateFullRecipe(query: string): Promise<RecipeDTO[] | null> {
        try {
            const model = this.genAI.getGenerativeModel({ 
                model: "gemini-3-flash-preview",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: SchemaType.OBJECT,
                        properties: {
                            isRelevant: { type: SchemaType.BOOLEAN },
                            recipes: {
                                type: SchemaType.ARRAY,
                                items: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        title: { type: SchemaType.STRING },
                                        description: { type: SchemaType.STRING },
                                        difficulty: { 
                                            type: SchemaType.STRING, 
                                            description: "Must be exactly: easy, medium, or hard" 
                                        },
                                        prepTimeMinutes: { type: SchemaType.NUMBER },
                                        cookTimeMinutes: { type: SchemaType.NUMBER },
                                        totalTimeMinutes: { type: SchemaType.NUMBER },
                                        categories: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                                        ingredients: {
                                            type: SchemaType.ARRAY,
                                            items: {
                                                type: SchemaType.OBJECT,
                                                properties: {
                                                    name: { type: SchemaType.STRING },
                                                    quantity: { type: SchemaType.NUMBER },
                                                    unit: { type: SchemaType.STRING }
                                                },
                                                required: ["name", "quantity", "unit"]
                                            }
                                        },
                                        steps: {
                                            type: SchemaType.ARRAY,
                                            items: {
                                                type: SchemaType.OBJECT,
                                                properties: {
                                                    index: { type: SchemaType.NUMBER },
                                                    instruction: { type: SchemaType.STRING }
                                                },
                                                required: ["index", "instruction"]
                                            }
                                        }
                                    },
                                    required: ["title", "description", "ingredients", "steps", "difficulty"]
                                }
                            }
                        },
                        required: ["isRelevant", "recipes"]
                    }
                }
            });

            const prompt = `
                צור 3 מתכונים עבור השאילתה: "${query}". 
                דגש קריטי: שדה ה-difficulty חייב להיות באנגלית בלבד: "easy", "medium", או "hard".
                שאר הטקסט חייב להיות בעברית.
                אם השאילתה לא קשורה לאוכל, החזר isRelevant: false.
            `;

            const result = await model.generateContent(prompt);
            const response = JSON.parse(result.response.text());

            if (!response.isRelevant) {
                throw new AppError(400, "נראה שהחיפוש שלך לא קשור לעולם הבישול.");
            }

            return response.recipes;
        } catch (error: any) {
            if (error.status === "RESOURCE_EXHAUSTED" || error.message?.includes("429")) {
                throw new AppError(429, "חריגה ממכסת הבקשות של Google. נסה שוב בעוד דקה.");
            }
            console.error("Gemini AI Error:", error.message);
            return null;
        }
    }
}