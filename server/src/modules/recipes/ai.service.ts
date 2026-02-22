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
                                        difficulty: { type: SchemaType.STRING },
                                        prepTimeMinutes: { type: SchemaType.NUMBER },
                                        cookTimeMinutes: { type: SchemaType.NUMBER },
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

            const prompt = `Generate 3 recipes for: "${query}". 
            Constraints: 
            1. difficulty must be "easy", "medium" or "hard". 
            2. All text in Hebrew. 
            3. If not food related, isRelevant: false.`;

            const result = await model.generateContent(prompt);
            const response = JSON.parse(result.response.text());

            return response.isRelevant ? response.recipes : null;
        } catch (error: any) {
            console.error("Gemini Error:", error.message);
            return null;
        }
    }
}