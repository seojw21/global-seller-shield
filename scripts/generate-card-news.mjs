import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-2.0-flash";

function generateCardHTML(risk, index, totalCount, date, source) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${risk.title} - Global Seller Shield</title>
    <meta name="description" content="${risk.description.substring(0, 150)}">
    <meta property="og:title" content="${risk.title}">
    <meta property="og:description" content="${risk.description.substring(0, 150)}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Global Seller Shield">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #0f172a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        .card {
            width: 100%;
            max-width: 480px;
            background: linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9));
            border: 1px solid rgba(56,189,248,0.2);
            border-radius: 2rem;
            padding: 2.5rem;
            position: relative;
            overflow: hidden;
        }
        .card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%);
            pointer-events: none;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0.75rem;
            background: rgba(239,68,68,0.15);
            border: 1px solid rgba(239,68,68,0.3);
            border-radius: 2rem;
            color: #f87171;
            font-size: 0.65rem;
            font-weight: 900;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
        }
        .badge .dot {
            width: 6px; height: 6px;
            background: #ef4444;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        .counter {
            color: rgba(148,163,184,0.6);
            font-size: 0.7rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
        }
        h1 {
            color: #f1f5f9;
            font-size: 1.6rem;
            font-weight: 900;
            line-height: 1.3;
            margin-bottom: 1.25rem;
        }
        .description {
            color: #94a3b8;
            font-size: 0.85rem;
            line-height: 1.7;
            margin-bottom: 2rem;
        }
        .footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(148,163,184,0.1);
        }
        .source {
            color: rgba(148,163,184,0.5);
            font-size: 0.6rem;
        }
        .brand {
            color: #38bdf8;
            font-size: 0.65rem;
            font-weight: 900;
            letter-spacing: 0.05em;
        }
        .cta {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            padding: 0.9rem;
            background: linear-gradient(135deg, #0ea5e9, #6366f1);
            color: white;
            border-radius: 1rem;
            text-decoration: none;
            font-weight: 800;
            font-size: 0.85rem;
            transition: transform 0.2s;
        }
        .cta:hover { transform: scale(1.02); }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge"><span class="dot"></span> RISK ALERT</div>
        <div class="counter">${index + 1} / ${totalCount} · ${date}</div>
        <h1>⚠️ ${risk.title}</h1>
        <p class="description">${risk.description}</p>
        <a class="cta" href="/">상세 리포트 보기 → Global Seller Shield</a>
        <div class="footer">
            <span class="source">출처: ${source}</span>
            <span class="brand">GLOBAL SELLER SHIELD</span>
        </div>
    </div>
</body>
</html>`;
}

async function generateCardNews() {
    console.log("🃏 Starting Card News Generation...");

    const insightPath = path.join(process.cwd(), "public", "data", "daily-insight.json");
    if (!fs.existsSync(insightPath)) {
        console.error("❌ daily-insight.json not found. Run generate-daily-insights.mjs first.");
        process.exit(1);
    }

    const insightData = JSON.parse(fs.readFileSync(insightPath, "utf8"));
    const today = new Date().toISOString().split("T")[0];

    const outputDir = path.join(process.cwd(), "public", "cards", today);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const risks = insightData.risks || [];
    for (let i = 0; i < risks.length; i++) {
        const html = generateCardHTML(risks[i], i, risks.length, today, insightData.source || "");
        const filePath = path.join(outputDir, `card-${i + 1}.html`);
        fs.writeFileSync(filePath, html);
        console.log(`  ✅ Card ${i + 1} saved: ${filePath}`);
    }

    // Also save latest copies
    const latestDir = path.join(process.cwd(), "public", "cards", "latest");
    if (!fs.existsSync(latestDir)) {
        fs.mkdirSync(latestDir, { recursive: true });
    }
    for (let i = 0; i < risks.length; i++) {
        const html = generateCardHTML(risks[i], i, risks.length, today, insightData.source || "");
        fs.writeFileSync(path.join(latestDir, `card-${i + 1}.html`), html);
    }

    console.log(`✅ All ${risks.length} card news pages generated for ${today}`);
}

generateCardNews();
