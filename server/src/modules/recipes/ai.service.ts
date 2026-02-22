import { RecipeDTO } from './recipe.types';
import { Types } from 'mongoose';

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

        const prompt = `צור 3 מתכונים שונים בעברית עבור השאילתה: "${query}".`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        response_mime_type: "application/json",
                        response_schema: {
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
                                                unit: { type: "string" },
                                                notes: { type: "string" }
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
                                                instruction: { type: "string" },
                                                durationMinutes: { type: "number" }
                                            },
                                            required: ["index", "instruction"]
                                        }
                                    },
                                    notes: { type: "string" },
                                    sourceType: { type: "string" }
                                },
                                required: ["title", "description", "ingredients", "steps"]
                            }
                        }
                    }
                })
            });

            const data: any = await response.json();

            if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
                console.error("AI Error:", data.error || "Invalid response");
                return null;
            }

            const rawText = data.candidates[0].content.parts[0].text;
            const parsedRecipes = JSON.parse(rawText);

            return parsedRecipes.map((recipe: any) => ({
                ...recipe,
                Id: new Types.ObjectId().toString(),
                createdAt: new Date().toISOString(),
                likesCount: 0,
                commentsCount: 0,
                isUserLiked: false,
                sourceType: 'ai'
            })) as RecipeDTO[];

        } catch (error: any) {
            console.error("AI Generation Failed at Parsing:", error.message);
            return null;
        }
    }
}