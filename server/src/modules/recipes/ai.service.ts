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
            עבור כל מתכון, המצא שם של שף דמיוני והכנס אותו לשדה "creatorName".
            
            החזר אך ורק מערך JSON (Array) המכיל 5 אובייקטים בפורמט הבא:
            [
              {
                "title": "שם המתכון",
                "description": "תיאור קצר",
                "creatorName": "שם השף",
                "difficulty": "easy", 
                "prepTimeMinutes": 15,
                "cookTimeMinutes": 30,
                "totalTimeMinutes": 45,
                "categories": ["קטגוריה"],
                "ingredients": [
                    {"name": "שם הרכיב", "quantity": 1, "unit": "יחידה", "notes": ""}
                ],
                "steps": [
                    {"index": 1, "instruction": "הוראה", "durationMinutes": 5}
                ],
                "notes": "טיפים",
                "sourceType": "ai"
              }
            ]
            חשוב: אל תוסיף הסברים, אל תוסיף Markdown, ואל תוסיף הערות בתוך ה-JSON. החזר רק את המערך.
        `;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                })
            });

            const data: any = await response.json();

            if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
                console.error("Gemini API Error or Empty Response");
                return null;
            }

            let text = data.candidates[0].content.parts[0].text.trim();

            const start = text.indexOf('[');
            const end = text.lastIndexOf(']');
            
            if (start === -1 || end === -1) {
                console.error("AI response is not a JSON array");
                return null;
            }

            text = text.substring(start, end + 1);

            return JSON.parse(text);

        } catch (error) {
            console.error("AIService JSON Parse Error:", error);
            return null;
        }
    }
}