export class AIService {
    private readonly apiKey: string;

    constructor() {
        // טעינת המפתח מקובץ ה-.env
        this.apiKey = process.env.GEMINI_API_KEY || '';
        
        if (!this.apiKey) {
            console.error("AI Service Error: GEMINI_API_KEY is missing in .env file");
        }
    }

    /**
     * מייצר 5 מתכונים שונים ומפורטים על בסיס שאילתת משתמש.
     * כל מתכון כולל שם שף דמיוני בשדה creatorName לטובת התצוגה ב-UI.
     */
    public async generateFullRecipe(query: string) {
        if (!this.apiKey) {
            console.error("AI Service: Cannot proceed without API Key");
            return null;
        }

        // שימוש במודל gemini-2.5-flash שנמצא זמין בהרשאות המפתח שלך
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;

        const prompt = `
            אתה שף מומחה. צור 5 מתכונים שונים, מקוריים ומפורטים בעברית עבור השאילתה: "${query}".
            עבור כל מתכון, המצא שם של שף דמיוני שכתב אותו (למשל: "שף אייל לוי", "סבתא ג'מילה", "שף יונתן רושפלד") והכנס אותו לשדה "creatorName".
            
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

            // חילוץ הטקסט מתוך המבנה של Gemini
            if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts) {
                console.error("Unexpected AI response structure:", data);
                return null;
            }

            let text = data.candidates[0].content.parts[0].text.trim();

            // ניקוי Markdown (תגיות ```json) במידה וה-AI הוסיף אותן
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            
            // וידוי שאנחנו חותכים רק את המערך (בין הסוגריים המרובעים)
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