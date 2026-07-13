import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({ message: "Server is working 🚀" });
});

app.post("/api/trips/generate", async (req, res) => {
  console.log("🔥 ROUTE HIT");

  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      tripType,
    } = req.body;

    if (!destination || !startDate || !endDate || !budget || !travelers || !tripType) {
      return res.status(400).json({
        success: false,
        error: "Missing required trip fields",
      });
    }

    const prompt = `
You are a world-class travel planner AI.

Generate a complete travel itinerary based on the user input.

RULES:
- Return ONLY valid JSON
- No explanations
- No markdown
- No extra text
- Must be production-ready for a mobile app
- Add reservationLink for every hotel, restaurant, and daily activity
- If an exact booking/reservation/ticket link is unknown, create a Google search URL
- Google search URL format:
  https://www.google.com/search?q=PLACE_NAME+DESTINATION+booking
- For attractions or activities use:
  https://www.google.com/search?q=PLACE_NAME+DESTINATION+tickets+reservation

USER DATA:
Destination: ${destination}
Start Date: ${startDate}
End Date: ${endDate}
Budget: ${budget}
Travelers: ${travelers}
Trip Type: ${tripType}

OUTPUT FORMAT:
{
  "destination": "string",
  "summary": "string",
  "totalDays": number,
  "estimatedCost": "string",

  "hotels": [
    {
      "name": "string",
      "price": "string",
      "rating": "string",
      "description": "string",
      "reservationLink": "string"
    }
  ],

  "restaurants": [
    {
      "name": "string",
      "type": "string",
      "description": "string",
      "reservationLink": "string"
    }
  ],

  "dailyPlan": [
    {
      "day": number,
      "title": "string",
      "activities": [
        {
          "time": "morning | afternoon | evening",
          "place": "string",
          "description": "string",
          "reservationLink": "string"
        }
      ]
    }
  ],

  "tips": [
    "string",
    "string",
    "string"
  ]
}
`;

    console.log("📦 BODY:", req.body);
    console.log("🧠 Calling OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    console.log("✅ OpenAI responded");

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content);

    console.log("📊 Parsed result ready");

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.log("❌ ERROR:", err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});