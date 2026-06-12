import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 8000;

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// LOG all requests
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// ======================
// OPENAI SETUP
// ======================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.json({ message: "Server is working 🚀" });
});

// ======================
// AI ROUTE
// ======================
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

    console.log("📦 BODY:", req.body);

    const prompt = `
You are a travel planner AI.

Create a JSON travel plan only.

Destination: ${destination}
Start: ${startDate}
End: ${endDate}
Budget: ${budget}
Travelers: ${travelers}
Trip type: ${tripType}

Return ONLY valid JSON:

{
  "destination": "",
  "summary": "",
  "totalDays": 0,
  "estimatedCost": "",
  "dailyPlan": [
    {
      "day": 1,
      "activities": []
    }
  ]
}
`;

    console.log("🧠 Calling OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    console.log("✅ OpenAI responded");

    const result = JSON.parse(completion.choices[0].message.content);

    console.log("📊 Parsed result ready");

    return res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.log("❌ ERROR:", err.message);

    return res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});