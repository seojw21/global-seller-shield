import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Info, ExternalLink, ArrowRight, MessageCircle, Copy } from 'lucide-react';
import { RiskScreeningResult } from '../lib/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TrafficLightResultProps {
    result: RiskScreeningResult;
}

const TrafficLightResult: React.FC<TrafficLightResultProps> = ({ result }) => {
    const [copied, setCopied] = useState(false);
    const isLow = result.risk_level === 'Low';
    const isMedium = result.risk_level === 'Medium';
    const isHigh = result.risk_level === 'High';

    const riskLevelKo = isLow ? "낮음" : isMedium ? "보통" : "높음";

    const copyToClipboard = () => {
        const text = `
[Global Seller Shield - 수출 리스크 진단 결과]
품목 리스크 수준: ${riskLevelKo}

■ 리스크 요인:
${result.risk_reasons.map(r => `• ${r}`).join('\n')}

■ 필수 점검 항목:
${result.required_checks.map(c => `• ${c}`).join('\n')}

■ 전담 관세사 제언:
${result.next_action}

■ 관련 근거:
${result.official_sources.join('\n')}
        `.trim();

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Traffic Light Header */}
            <div className={cn(
                "p-8 rounded-3xl border text-center transition-all duration-500",
                isLow && "bg-green-500/10 border-green-500/20 risk-low",
                isMedium && "bg-yellow-500/10 border-yellow-500/20 risk-medium",
                isHigh && "bg-red-500/10 border-red-500/20 risk-high"
            )}>
                <div className="flex justify-center mb-4">
                    {isLow && <CheckCircle className="w-16 h-16 text-green-500" />}
                    {isMedium && <AlertTriangle className="w-16 h-16 text-yellow-500" />}
                    {isHigh && <XCircle className="w-16 h-16 text-red-500" />}
                </div>
                <h2 className={cn(
                    "text-4xl font-black mb-2",
                    isLow && "text-green-500",
                    isMedium && "text-yellow-500",
                    isHigh && "text-red-500"
                )}>
                    리스크 수준: {riskLevelKo}
                </h2>
                <p className="text-slate-400 max-w-lg mx-auto">
                    {isLow ? "상대적으로 안전한 품목입니다. 표준 서류 구비 시 무난한 통관이 예상됩니다." :
                        isMedium ? "추가 검역이나 인증이 필요할 수 있습니다. 사전 전문가 확인을 권장합니다." :
                            "통관 거부나 제품 압수 위험이 큽니다. 전문 관세사의 법적 조언이 필수적입니다."}
                </p>
            </div>

            {/* Structured Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Reasons */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="flex items-center gap-2 font-bold mb-4 text-slate-200">
                        <AlertTriangle className="w-5 h-5 text-sky-400" />
                        리스크 요인 분석
                    </h3>
                    <ul className="space-y-3">
                        {result.risk_reasons.map((reason, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-400">
                                <span className="text-sky-500">•</span>
                                {reason}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Required Checks */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="flex items-center gap-2 font-bold mb-4 text-slate-200">
                        <CheckCircle className="w-5 h-5 text-sky-400" />
                        필수 점검 항목
                    </h3>
                    <ul className="space-y-3">
                        {result.required_checks.map((check, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-400">
                                <span className="text-sky-500">•</span>
                                {check}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Official Sources & CTA */}
            <div className="glass-card p-8 rounded-2xl border-sky-500/20">
                <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                    <div className="flex-1">
                        <h3 className="flex items-center gap-2 font-bold mb-4 text-slate-200">
                            <Info className="w-5 h-5 text-sky-400" />
                            관련 근거 및 공식 출처
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {result.official_sources.map((source, i) => (
                                <a
                                    key={i}
                                    href={source}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 hover:bg-sky-500/10 hover:border-sky-500/30 transition-all flex items-center gap-1.5"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    공식 출처 {i + 1}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl mb-4">
                            <span className="text-xs font-bold text-sky-400 block mb-1 uppercase tracking-wider">전담 관세사 제언</span>
                            <p className="text-sm font-medium text-slate-200">{result.next_action}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-semibold rounded-xl transition-all active:scale-95"
                            >
                                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-sky-400" />}
                                {copied ? '복사 완료!' : '결과 리포트 복사하기'}
                            </button>
                            <a
                                href="https://open.kakao.com/o/s9Meawji"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full premium-button flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                전문 관세사 밀착 지원 받기
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center p-6 border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-500 text-sm">
                    더 깊은 분석이 필요하신가요?
                    <a
                        href="https://open.kakao.com/o/s9Meawji"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 cursor-pointer font-bold hover:underline ml-2 flex inline-items items-center gap-1"
                    >
                        <MessageCircle className="w-4 h-4" />
                        무료 진단 신청 (카카오톡)
                    </a>
                </p>
            </div>
        </motion.div>
    );
};

export default TrafficLightResult;
