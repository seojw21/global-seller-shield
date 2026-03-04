import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-2.0-flash";
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export interface RiskScreeningResult {
    risk_level: "Low" | "Medium" | "High";
    risk_reasons: string[];
    required_checks: string[];
    official_sources: string[];
    next_action: string;
}

export const screenExportRisk = async (item: string, country: string): Promise<RiskScreeningResult> => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    const prompt = `
    You are a world-class export compliance expert specializing in international trade regulations.
    Analyze the risk of exporting "${item}" to "${country}".

    COMPLIANCE RULES:
    1. Respond ONLY in valid JSON.
    2. Hallucination Control: If you are unsure about a specific regulation, state that expert verification is required. Do NOT guess.
    3. Documentation: Provide official government or trade body URLs in 'official_sources'.
    4. Language: All fields except 'risk_level' and 'official_sources' MUST be in Korean.
    5. Guidance: If the risk is High, emphasize the legal consequences and mandatory certifications.

    JSON STRUCTURE:
    - risk_level: "Low" | "Medium" | "High"
    - risk_reasons: Array of specific strings explaining risks (Korean).
    - required_checks: Array of mandatory documents/checks (Korean).
    - official_sources: Array of URLs (Links to official trade/gov sites).
    - next_action: A clear, definitive instruction for the seller (Korean).

    Example of strictness: "만약 정확한 정보를 찾을 수 없다면, '현재 데이터베이스 기준으로는 확인이 어려우므로 전문가의 확인이 필요합니다'라고 명시하십시오."
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean potential markdown formatting
        const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
