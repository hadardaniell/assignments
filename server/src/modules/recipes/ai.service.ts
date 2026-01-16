export class AIService {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        
        if (!this.apiKey) {
            console.error("AI Service Error: GEMINI_API_KEY is missing in .env file");
        }
    }

    public async generateFullRecipe(query: string) {
        if (!this.apiKey) {
            console.error("AI Service: Cannot proceed without API Key");
            return null;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

        const prompt = `
            אתה שף מומחה. צור 5 מתכונים שונים, מקוריים ומפורטים בעברית עבור השאילתה: "${query}".
            עבור כל מתכון, המצא שם של שף דמיוני שכתב אותו והכנס אותו לשדה "creatorName".
            
            החזר אך ורק מערך JSON (Array) המכיל 5 אובייקטים בפורמט הבא, ללא טקסט נוסף וללא Markdown:
            [
              {
                "title": "שם המתכון",
                "description": "תיאור קצר ומגרה של המנה",
                "creatorName": "שם השף הממציא",
                "difficulty": "easy", 
                "prepTimeMinutes": 15,
                "cookTimeMinutes": 30,
                "totalTimeMinutes": 45,
                "categories": ["קטגוריה1", "קטגוריה2"],
                "ingredients": [
                    {"name": "שם הרכיב", "quantity": 1, "unit": "יחידה", "notes": "הערה אופציונלית"}
                ],
                "steps": [
                    {"index": 1, "instruction": "הוראת הכנה מפורטת", "durationMinutes": 5}
                ],
                "notes": "טיפים להגשה או אחסון",
                "sourceType": "ai"
              }
            ]
        `;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data: any = await response.json();

            if (!response.ok) {
                console.error("Gemini API Error Response:", JSON.stringify(data, null, 2));
                return null;
            }

            if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts) {
                console.error("Unexpected AI response structure:", data);
                return null;
            }

            let text = data.candidates[0].content.parts[0].text.trim();

            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            
            const start = text.indexOf('[');
            const end = text.lastIndexOf(']');
            if (start !== -1 && end !== -1) {
                text = text.substring(start, end + 1);
            }

            const parsedRecipes = JSON.parse(text);
            console.log(`AI Success: Generated ${parsedRecipes.length} different recipes for "${query}"`);
            
            return parsedRecipes;

        } catch (error) {
            console.error("AIService Exception:", error);
            return null;
        }
    }
}