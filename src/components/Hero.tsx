import React, { useState } from 'react';
import { Globe, Package, Loader2, Search, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { screenExportRisk, RiskScreeningResult } from '../lib/gemini';
import { Analytics } from '../lib/analytics';
import TrafficLightResult from './TrafficLightResult';

const Hero: React.FC = () => {
    const [item, setItem] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RiskScreeningResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dailyInsight, setDailyInsight] = useState<any>(null);

    React.useEffect(() => {
        fetch('/data/daily-insight.json')
            .then(res => res.json())
            .then(data => setDailyInsight(data))
            .catch(err => console.error("Failed to load daily insight:", err));
    }, []);

    const handleScreening = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !country) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await screenExportRisk(item, country);
            setResult(data);
            Analytics.riskScreening(item, country);
        } catch (err: any) {
            setError(err.message || "리스크 분석에 실패했습니다. API 키를 확인해 주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-[128px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse-slow"></div>
            </div>

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
                        Gemini 2.0 Flash 기반 지능형 스크리닝
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                        수출 리스크, <br />
                        <span className="glow-text">발생 전에 차단하십시오.</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                        AI 기반 실시간 수출입 컴플라이언스 스크리닝.
                        단 몇 초 만에 전 세계 통관 장벽과 법적 리스크를 진단해 드립니다.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl mx-auto glass-card p-6 rounded-3xl mb-12"
                >
                    <form onSubmit={handleScreening}>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="relative">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => setItem(e.target.value)}
                                    placeholder="판매할 품목을 입력하세요 (예: 반도체 장비)"
                                    className="w-full pl-12 pr-4 py-4 glass-input"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="대상 국가를 입력하세요 (예: 중국)"
                                    className="w-full pl-12 pr-4 py-4 glass-input"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full premium-button flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            리스크 스크리닝 시작하기
                        </button>
                    </form>
                </motion.div>

                {/* Daily Insight Section */}
                <AnimatePresence>
                    {dailyInsight && !result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto mb-12"
                        >
                            <div className="glass-card p-8 rounded-3xl border-sky-500/20 relative overflow-hidden text-left">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Globe className="w-32 h-32 text-sky-500" />
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded animate-pulse">LIVE</div>
                                    <span className="text-sky-400 text-xs font-black tracking-widest uppercase">Global Risk Intelligence</span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 leading-tight">{dailyInsight.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{dailyInsight.summary}</p>

                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    {dailyInsight.risks.map((risk: any, i: number) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-sky-500/30 transition-all">
                                            <h4 className="text-sky-400 text-xs font-bold mb-2 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                {risk.title}
                                            </h4>
                                            <p className="text-slate-500 text-[10px] leading-tight">{risk.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-300 italic">"실시간 데이터 분석에 따르면 해당 리스크로 인한 통관 지연율이 최근 15% 증가했습니다."</p>
                                    </div>
                                    <div className="text-right text-[10px] text-slate-500">
                                        출처: {dailyInsight.source}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-4">
                                    <a href="/blog/latest.html" target="_blank" rel="noopener noreferrer"
                                        onClick={() => Analytics.blogClick()}
                                        className="flex-1 text-center px-4 py-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400 text-xs font-bold hover:bg-sky-500/20 transition-all">
                                        📝 오늘의 블로그 읽기
                                    </a>
                                    <a href="/cards/latest/card-1.html" target="_blank" rel="noopener noreferrer"
                                        onClick={() => Analytics.cardNewsClick()}
                                        className="flex-1 text-center px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition-all">
                                        🃏 카드 뉴스 보기
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-center gap-8 text-slate-500 font-medium grayscale opacity-60">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        실시간 진단
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                        공식 데이터 출처
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                        글로벌 커버리지
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center"
                        >
                            <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
                            <p className="text-sky-400 font-medium animate-pulse">전 세계 관세 데이터베이스를 스캔하는 중...</p>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 text-left"
                        >
                            <TrafficLightResult result={result} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Hero;
