import fs from "fs";
import path from "path";

function generateTrendData() {
    console.log("📊 Generating 30-day risk trend data...");

    const countries = [
        { id: "us", name: "미국", baseRisk: 65 },
        { id: "eu", name: "유럽연합", baseRisk: 58 },
        { id: "cn", name: "중국", baseRisk: 72 },
        { id: "jp", name: "일본", baseRisk: 35 },
        { id: "sea", name: "동남아시아", baseRisk: 48 },
    ];

    const categories = [
        { id: "tariff", name: "관세 리스크", weight: 0.4 },
        { id: "compliance", name: "컴플라이언스", weight: 0.35 },
        { id: "logistics", name: "물류 리스크", weight: 0.25 },
    ];

    const trendData = {};

    for (const country of countries) {
        const dailyData = [];

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            // Simulate realistic risk fluctuation with trends
            const trendFactor = Math.sin(i * 0.3) * 8; // cyclical pattern
            const noiseFactor = (Math.random() - 0.5) * 12; // random noise
            const growthFactor = (29 - i) * 0.3; // slight upward trend (worsening)

            const totalRisk = Math.max(10, Math.min(95,
                Math.round(country.baseRisk + trendFactor + noiseFactor + growthFactor)
            ));

            const breakdown = {};
            for (const cat of categories) {
                const catNoise = (Math.random() - 0.5) * 15;
                breakdown[cat.id] = Math.max(5, Math.min(100,
                    Math.round(totalRisk * cat.weight / 0.4 + catNoise)
                ));
            }

            dailyData.push({
                date: dateStr,
                totalRisk,
                breakdown,
            });
        }

        trendData[country.id] = {
            name: country.name,
            data: dailyData,
        };
    }

    const output = {
        countries: countries.map(c => ({ id: c.id, name: c.name })),
        categories: categories.map(c => ({ id: c.id, name: c.name })),
        trends: trendData,
        generatedAt: new Date().toISOString(),
    };

    const outputPath = path.join(process.cwd(), "public", "data", "risk-trend.json");
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`✅ Risk trend data saved to: ${outputPath}`);
}

generateTrendData();
