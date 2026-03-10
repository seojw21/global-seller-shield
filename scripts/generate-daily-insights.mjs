import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

console.log("🔍 Debug: API_KEY length:", process.env.VITE_GEMINI_API_KEY?.length);

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-2.0-flash";

const NOTEBOOK_DATA = `
최근 글로벌 이커머스 수출입 환경에서 규제와 정책이 급격히 변화함에 따라 글로벌 셀러들이 주의해야 할 가장 중요한 리스크 3가지:

1. 관세 면세 한도(De Minimis) 폐지 및 세금 부과 강화:
미국(800달러) 및 EU(150유로) 면세 혜택 축소/폐지. DDP 모델 도입 및 정확한 HTS 코드 관리 필수.

2. 공급망 추적성(Traceability) 요구 및 ESG/강제 노동 규제:
미국 위구르 강제노동 금지법(UFLPA) 및 EU 삼림벌채방지법(EUDR) 강화. 선적 전 증빙 자료(Evidence Pack) 구축 필요.

3. 수출 통제, 경제 제재 및 글로벌 컴플라이언스 복잡성:
반도체 등 민감 기술 수출 통제 확대. ECCN 플래그 도입 및 거래처 스크리닝(Consolidated Screening List) 강화 필요.
`;

async function generateDailyInsights() {
    console.log("🚀 Starting Daily Insight Generation with NotebookLM Data...");

    if (!API_KEY) {
        console.error("❌ Error: VITE_GEMINI_API_KEY is missing in .env");
        process.exit(1);
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
        You are a senior export risk analyst for 'Global Seller Shield'.
        Based on this latest data from our intelligence engine (NotebookLM):
        
        ${NOTEBOOK_DATA}

        Generate a daily "Risk Insight Report" for Korean global sellers.
        
        The report must include:
        1. Title: A catchy, high-impact title (Korean).
        2. Summary: A concise 2-sentence summary of the most critical risk today (Korean).
        3. Key Risks: 3 specific bullet points with brief explanations (Korean).
        4. Actionable Advice: Professional advice on what sellers should do immediately (Korean).
        5. Source Reference: Mention official bodies like 'US Customs', 'EU Commission', or '국제무역센터'.

        Format: JSON only.
        Structure: { "title": "", "summary": "", "risks": [], "advice": "", "source": "" }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON
        const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const insightData = JSON.parse(cleanedJson);

        const outputPath = path.join(process.cwd(), "public", "data", "daily-insight.json");

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify({
            ...insightData,
            timestamp: new Date().toISOString()
        }, null, 2));

        console.log(`✅ Daily insight generated and saved to: ${outputPath}`);
    } catch (error) {
        console.error("❌ Failed to generate insight:", error);
    }
}

generateDailyInsights();
