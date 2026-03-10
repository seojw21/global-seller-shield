import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-2.0-flash";

async function generateMarketingContent() {
    console.log("📣 Starting Marketing Content Generation...");

    if (!API_KEY) {
        console.error("❌ Error: VITE_GEMINI_API_KEY is missing in .env");
        process.exit(1);
    }

    const insightPath = path.join(process.cwd(), "public", "data", "daily-insight.json");
    if (!fs.existsSync(insightPath)) {
        console.error("❌ daily-insight.json not found. Run generate-daily-insights.mjs first.");
        process.exit(1);
    }

    const insight = JSON.parse(fs.readFileSync(insightPath, "utf8"));
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You are a senior growth marketing strategist for "Global Seller Shield" — a SaaS that protects global e-commerce sellers from export compliance risks.

Today's Risk Intelligence Data:
- Title: ${insight.title}
- Summary: ${insight.summary}
- Risks: ${JSON.stringify(insight.risks)}
- Advice: ${insight.advice}

Generate marketing content for TWO channels. Follow these rules EXACTLY:

=== LINKEDIN POST ===
- Write in Korean, professional B2B tone
- Focus on business insight, urgency of risk response
- 3-4 paragraphs with line breaks
- End with: "👉 무료 리스크 진단을 받아보세요: https://globalsellershield.com"
- Include hashtags: #GlobalSellerShield #TradeCompliance #Ecommerce #수출입 #글로벌셀러 #리스크관리

=== TWITTER/X THREAD ===
- Generate exactly 3 tweets in Korean
- Tweet 1: Breaking news style hook with 🚨 emoji, max 240 chars
- Tweet 2: Key risk insight with specific data point
- Tweet 3: CTA with "지금 무료로 리스크를 진단하세요 👇 https://globalsellershield.com/subscribe" 
- Each tweet must be under 280 characters

Return ONLY valid JSON:
{
  "linkedin": {
    "post": "full linkedin post text here",
    "hashtags": ["#tag1", "#tag2"]
  },
  "twitter": {
    "thread": [
      { "order": 1, "text": "tweet 1" },
      { "order": 2, "text": "tweet 2" },
      { "order": 3, "text": "tweet 3" }
    ]
  },
  "generated_at": ""
}
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const content = JSON.parse(cleanedJson);

        content.generated_at = new Date().toISOString();
        content.source_insight = insight.title;

        const outputPath = path.join(process.cwd(), "public", "data", "marketing-content.json");
        fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));

        console.log("✅ Marketing content generated!");
        console.log(`   📄 Saved to: ${outputPath}`);
        console.log(`   🔗 LinkedIn: ${content.linkedin.post.substring(0, 80)}...`);
        console.log(`   🐦 Twitter: ${content.twitter.thread.length} tweets`);
    } catch (error) {
        console.error("❌ Failed to generate marketing content:", error);
    }
}

generateMarketingContent();
