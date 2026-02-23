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
                                minItems: 3,
                                maxItems: 3,
                                items: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        title: { type: SchemaType.STRING },
                                        description: { type: SchemaType.STRING },
                                        difficulty: { 
                                            type: SchemaType.STRING,
                                            description: "easy, medium, or hard"
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
                Generate exactly 3 unique recipes for: "${query}". 
                
                Important Guidelines:
                1. Include ANY food or drink related request (smoothies, shakes, cocktails, desserts, snacks, etc.) as relevant (isRelevant: true).
                2. "Shakes", "Smoothies", and "Drinks" are considered valid recipes.
                3. Field "difficulty" MUST be "easy", "medium", or "hard" (English).
                4. All other text MUST be in Hebrew.
                5. Set isRelevant: false ONLY if the query is completely unrelated to the culinary world (e.g., "how to fix a car", "math homework").
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            if (!responseText) return null;

            const response = JSON.parse(responseText);

            if (!response.isRelevant) {
                throw new AppError(400, "נראה שהחיפוש שלך לא קשור לעולם הבישול או המשקאות.");
            }

            return response.recipes;
        } catch (error: any) {
            if (error.status === "RESOURCE_EXHAUSTED" || error.message?.includes("429")) {
                throw new AppError(429, "חריגה ממכסת הבקשות של Google. נסה שוב בעוד דקה.");
            }
            if (error instanceof AppError) throw error;
            console.error("Gemini AI Error:", error.message);
            return null;
        }
    }
}