import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Lock, ChevronDown, Globe, BarChart3 } from 'lucide-react';
import { Analytics } from '../lib/analytics';

interface TrendPoint {
    date: string;
    totalRisk: number;
    breakdown: Record<string, number>;
}

interface CountryTrend {
    name: string;
    data: TrendPoint[];
}

interface TrendData {
    countries: { id: string; name: string }[];
    categories: { id: string; name: string }[];
    trends: Record<string, CountryTrend>;
    generatedAt: string;
}

interface RiskDashboardProps {
    onSubscribe?: () => void;
}

const CHART_COLORS = {
    primary: '#38bdf8',
    gradient: ['#0ea5e9', '#6366f1'],
    grid: 'rgba(148,163,184,0.08)',
    text: '#94a3b8',
    accent: '#818cf8',
};

const RiskDashboard: React.FC<RiskDashboardProps> = ({ onSubscribe }) => {
    const [data, setData] = useState<TrendData | null>(null);
    const [selectedCountry, setSelectedCountry] = useState('us');

    useEffect(() => {
        Analytics.dashboardView();
    }, []);
    const [isPremium] = useState(false); // Will integrate with auth later
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    useEffect(() => {
        fetch('/data/risk-trend.json')
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error("Failed to load trend data:", err));
    }, []);

    if (!data) return null;

    const countryData = data.trends[selectedCountry];
    if (!countryData) return null;

    const points = countryData.data;
    const maxRisk = Math.max(...points.map(p => p.totalRisk));
    const minRisk = Math.min(...points.map(p => p.totalRisk));
    const avgRisk = Math.round(points.reduce((s, p) => s + p.totalRisk, 0) / points.length);
    const latestRisk = points[points.length - 1].totalRisk;
    const prevRisk = points[points.length - 2]?.totalRisk || latestRisk;
    const delta = latestRisk - prevRisk;

    // SVG chart dimensions
    const W = 800;
    const H = 280;
    const PAD = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const toX = (i: number) => PAD.left + (i / (points.length - 1)) * chartW;
    const toY = (v: number) => PAD.top + chartH - ((v - minRisk + 5) / (maxRisk - minRisk + 10)) * chartH;

    // Generate SVG path
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(p.totalRisk).toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L ${toX(points.length - 1).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} L ${toX(0).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`;

    // Grid lines
    const gridCount = 5;
    const gridLines = Array.from({ length: gridCount }, (_, i) => {
        const v = minRisk - 5 + ((maxRisk - minRisk + 10) / (gridCount - 1)) * i;
        return { y: toY(v), label: Math.round(v).toString() };
    });

    // X-axis labels (every 5 days)
    const xLabels = points.filter((_, i) => i % 5 === 0 || i === points.length - 1).map((p) => {
        const idx = points.indexOf(p);
        return { x: toX(idx), label: p.date.substring(5) }; // MM-DD
    });

    const getRiskColor = (risk: number) => {
        if (risk >= 70) return '#ef4444';
        if (risk >= 50) return '#f59e0b';
        return '#22c55e';
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                            <BarChart3 className="w-4 h-4" />
                            30-Day Risk Trend Monitor
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                            국가별 <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">리스크 추이</span> 대시보드
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            지난 30일간의 수출 리스크 변동 추이를 한눈에 파악하세요.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto relative">
                        {/* Dashboard Card */}
                        <div className="glass-card p-6 md:p-8 rounded-3xl">
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-sky-400" />
                                    <div className="relative">
                                        <select
                                            value={selectedCountry}
                                            onChange={(e) => { setSelectedCountry(e.target.value); Analytics.countrySelect(e.target.value); }}
                                            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-sm font-medium focus:outline-none focus:border-sky-500/50 cursor-pointer"
                                        >
                                            {data.countries.map(c => (
                                                <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Stats pills */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="px-3 py-1.5 bg-white/5 rounded-lg text-xs">
                                        <span className="text-slate-500">현재 </span>
                                        <span className="font-bold" style={{ color: getRiskColor(latestRisk) }}>{latestRisk}</span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-white/5 rounded-lg text-xs">
                                        <span className="text-slate-500">평균 </span>
                                        <span className="text-white font-bold">{avgRisk}</span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-white/5 rounded-lg text-xs">
                                        <span className="text-slate-500">변동 </span>
                                        <span className={`font-bold ${delta > 0 ? 'text-red-400' : delta < 0 ? 'text-green-400' : 'text-slate-400'}`}>
                                            {delta > 0 ? `+${delta}` : delta}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SVG Chart */}
                            <div className="relative">
                                <svg
                                    viewBox={`0 0 ${W} ${H}`}
                                    className="w-full h-auto"
                                    onMouseLeave={() => setHoveredPoint(null)}
                                >
                                    <defs>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity="0.3" />
                                            <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor={CHART_COLORS.gradient[0]} />
                                            <stop offset="100%" stopColor={CHART_COLORS.gradient[1]} />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid lines */}
                                    {gridLines.map((g, i) => (
                                        <g key={i}>
                                            <line x1={PAD.left} y1={g.y} x2={W - PAD.right} y2={g.y}
                                                stroke={CHART_COLORS.grid} strokeWidth="1" />
                                            <text x={PAD.left - 8} y={g.y + 4} textAnchor="end"
                                                fill={CHART_COLORS.text} fontSize="10">{g.label}</text>
                                        </g>
                                    ))}

                                    {/* X-axis labels */}
                                    {xLabels.map((l, i) => (
                                        <text key={i} x={l.x} y={H - 6} textAnchor="middle"
                                            fill={CHART_COLORS.text} fontSize="10">{l.label}</text>
                                    ))}

                                    {/* Area fill */}
                                    <path d={areaPath} fill="url(#areaGrad)" />

                                    {/* Line */}
                                    <path d={linePath} fill="none" stroke="url(#lineGrad)"
                                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                                    {/* Data points (interactive) */}
                                    {points.map((p, i) => (
                                        <g key={i} onMouseEnter={() => setHoveredPoint(i)}>
                                            <circle cx={toX(i)} cy={toY(p.totalRisk)} r={hoveredPoint === i ? 6 : 3}
                                                fill={hoveredPoint === i ? '#ffffff' : CHART_COLORS.primary}
                                                stroke={CHART_COLORS.primary} strokeWidth="2"
                                                style={{ transition: 'r 0.15s' }} />
                                            {/* Invisible larger hit area */}
                                            <rect x={toX(i) - 12} y={PAD.top} width="24" height={chartH}
                                                fill="transparent" />
                                        </g>
                                    ))}

                                    {/* Tooltip */}
                                    {hoveredPoint !== null && (
                                        <g>
                                            <line x1={toX(hoveredPoint)} y1={PAD.top} x2={toX(hoveredPoint)} y2={PAD.top + chartH}
                                                stroke="rgba(148,163,184,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                                            <rect x={toX(hoveredPoint) - 45} y={toY(points[hoveredPoint].totalRisk) - 36}
                                                width="90" height="28" rx="8" fill="rgba(15,23,42,0.9)"
                                                stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
                                            <text x={toX(hoveredPoint)} y={toY(points[hoveredPoint].totalRisk) - 18}
                                                textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                                                {points[hoveredPoint].date.substring(5)} : {points[hoveredPoint].totalRisk}
                                            </text>
                                        </g>
                                    )}
                                </svg>

                                {/* Premium Blur Overlay */}
                                {!isPremium && (
                                    <div className="absolute inset-0 flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.7) 30%, rgba(15,23,42,0.95) 100%)',
                                            backdropFilter: 'blur(6px)',
                                            borderRadius: '1rem',
                                            top: '40%'
                                        }}>
                                        <div className="text-center p-6">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 mb-4">
                                                <Lock className="w-7 h-7 text-purple-400" />
                                            </div>
                                            <h3 className="text-xl font-extrabold text-white mb-2">프리미엄 전용 기능</h3>
                                            <p className="text-slate-400 text-sm mb-4 max-w-xs mx-auto">
                                                30일 리스크 추이 분석, 국가별 상세 리포트, CSV 다운로드를 이용하세요.
                                            </p>
                                            <div className="text-3xl font-black text-white mb-1">₩39,000<span className="text-sm font-normal text-slate-500">/월</span></div>
                                            <button onClick={() => { Analytics.subscribeClick('dashboard_overlay'); onSubscribe?.(); }} className="premium-button mt-3 text-sm px-8 py-3">
                                                <TrendingUp className="w-4 h-4 inline mr-1" />
                                                지금 구독하기
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Category Breakdown (teaser) */}
                            <div className="grid grid-cols-3 gap-3 mt-6">
                                {data.categories.map((cat) => {
                                    const val = points[points.length - 1].breakdown[cat.id] || 0;
                                    return (
                                        <div key={cat.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{cat.name}</div>
                                            <div className="text-xl font-black" style={{ color: getRiskColor(val) }}>{val}</div>
                                            <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${val}%`,
                                                        background: `linear-gradient(90deg, ${getRiskColor(val)}88, ${getRiskColor(val)})`
                                                    }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default RiskDashboard;
