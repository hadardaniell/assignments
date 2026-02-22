import { RecipeDTO } from './recipe.types';
import { Types } from 'mongoose';
import { AppError } from '../../common';

export class AIService {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        if (!this.apiKey) {
            console.error("AI Service Error: GEMINI_API_KEY is missing");
        }
    }

    public async generateFullRecipe(query: string): Promise<RecipeDTO[] | null> {
        if (!this.apiKey) return null;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

        const prompt = `
            נתח את השאילתה הבאה: "${query}".
            1. קבע האם היא קשורה לאוכל, חומרי גלם, בישול או מתכונים (isRelevant).
            2. אם כן, צור 3 מתכונים מתאימים.
        `;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        response_mime_type: "application/json",
                        response_schema: {
                            type: "object",
                            properties: {
                                isRelevant: { type: "boolean" }, 
                                recipes: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            title: { type: "string" },
                                            description: { type: "string" },
                                            creatorName: { type: "string" },
                                            difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                                            prepTimeMinutes: { type: "number" },
                                            cookTimeMinutes: { type: "number" },
                                            totalTimeMinutes: { type: "number" },
                                            categories: { type: "array", items: { type: "string" } },
                                            ingredients: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        name: { type: "string" },
                                                        quantity: { type: "number" },
                                                        unit: { type: "string" }
                                                    },
                                                    required: ["name", "quantity", "unit"]
                                                }
                                            },
                                            steps: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        index: { type: "number" },
                                                        instruction: { type: "string" }
                                                    },
                                                    required: ["index", "instruction"]
                                                }
                                            }
                                        },
                                        required: ["title", "description", "ingredients", "steps"]
                                    }
                                }
                            },
                            required: ["isRelevant", "recipes"]
                        }
                    }
                })
            });

            const data: any = await response.json();
            if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) return null;

            const result = JSON.parse(data.candidates[0].content.parts[0].text);

            if (!result.isRelevant) {
                throw new AppError(400, "נראה שהחיפוש שלך לא קשור לעולם הבישול והמתכונים. נסה משהו טעים יותר!");
            }

            if (!result.recipes || result.recipes.length === 0) {
                throw new AppError(404, "לא הצלחתי למצוא מתכונים מתאימים לשאילתה הזו.");
            }

            return result.recipes.map((recipe: any) => ({
                ...recipe,
                Id: new Types.ObjectId().toString(),
                createdAt: new Date().toISOString(),
                likesCount: 0,
                commentsCount: 0,
                isUserLiked: false,
                sourceType: 'ai'
            })) as RecipeDTO[];

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            console.error("AI Service Error:", error.message);
            return null;
        }
    }
}