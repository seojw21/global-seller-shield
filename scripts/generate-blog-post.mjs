import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-2.0-flash";

async function generateBlogPost() {
    console.log("📝 Starting Blog Post Generation...");

    if (!API_KEY) {
        console.error("❌ Error: VITE_GEMINI_API_KEY is missing in .env");
        process.exit(1);
    }

    // Read daily insight data
    const insightPath = path.join(process.cwd(), "public", "data", "daily-insight.json");
    if (!fs.existsSync(insightPath)) {
        console.error("❌ daily-insight.json not found. Run generate-daily-insights.mjs first.");
        process.exit(1);
    }

    const insightData = JSON.parse(fs.readFileSync(insightPath, "utf8"));
    const today = new Date().toISOString().split("T")[0];

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
        You are a senior content strategist for 'Global Seller Shield', writing an SEO-optimized blog post in Korean.
        
        Based on this daily risk intelligence data:
        Title: ${insightData.title}
        Summary: ${insightData.summary}
        Risks: ${JSON.stringify(insightData.risks)}
        Advice: ${insightData.advice}
        Source: ${insightData.source}

        Write a complete, professional blog post in HTML format. Follow these rules:
        1. The HTML must be a complete standalone page with dark theme styling (bg: #0f172a, text: white/slate).
        2. Use Google Font 'Inter' for typography.
        3. Structure: Hero banner → Executive Summary → 3 Risk Deep-Dives → Expert Advice → CTA
        4. Each risk section should have an icon emoji, a bold title, and 2-3 paragraphs of analysis.
        5. Use professional Korean throughout. Write like a McKinsey analyst writing for C-level executives.
        6. At the very end, include this EXACT CTA block:
           <div style="margin-top:3rem;padding:2rem;background:linear-gradient(135deg,#0ea5e9,#6366f1);border-radius:1.5rem;text-align:center;">
             <h3 style="color:white;font-size:1.5rem;font-weight:900;margin-bottom:0.5rem;">상세한 리스크 대응 전략 리포트가 필요하신가요?</h3>
             <p style="color:rgba(255,255,255,0.8);margin-bottom:1.5rem;">Global Seller Shield 프리미엄 구독으로 매일 업데이트되는 맞춤형 리스크 분석 리포트를 받아보세요.</p>
             <a href="/" style="display:inline-block;padding:1rem 2.5rem;background:white;color:#0f172a;border-radius:1rem;font-weight:800;text-decoration:none;font-size:1.1rem;">지금 구독하기 →</a>
           </div>
        7. Include proper meta tags for SEO: title, description, og:title, og:description, og:type.
        8. Return ONLY the raw HTML. No markdown wrapping.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let html = response.text();

        // Remove any markdown code fences
        html = html.replace(/```html/g, "").replace(/```/g, "").trim();

        const outputDir = path.join(process.cwd(), "public", "blog");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, `${today}.html`);
        fs.writeFileSync(outputPath, html);

        // Also save a latest.html symlink-like copy for easy access
        fs.writeFileSync(path.join(outputDir, "latest.html"), html);

        console.log(`✅ Blog post generated: ${outputPath}`);
        console.log(`✅ Latest copy saved: ${path.join(outputDir, "latest.html")}`);
    } catch (error) {
        console.error("❌ Failed to generate blog post:", error);
    }
}

generateBlogPost();
