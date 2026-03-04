import React from 'react';
import { Shield, Mail, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="text-sky-500 w-8 h-8" />
                            <span className="text-2xl font-bold glow-text">Global Seller Shield</span>
                        </div>
                        <p className="text-slate-400 max-w-sm mb-8">
                            글로벌 셀러를 위한 인공지능 기반 리스크 스크리닝 엔진.
                            Gemini 1.5 Pro가 실시간으로 통관 규정을 분석하여 최적의 솔루션을 제공합니다.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500 transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500 transition-all">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">주요 리소스</h4>
                        <ul className="space-y-4 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-sky-400 transition-colors">컴플라이언스 가이드</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">HS 코드 조회</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">협력 관세사 네트워크</a></li>
                            <li><a href="#" className="hover:text-sky-400 transition-colors">API 문서</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">고객 지원</h4>
                        <div className="flex items-center gap-3 text-slate-400 text-sm mb-4">
                            <Mail className="w-4 h-4" />
                            support@globalsellershield.com
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            본 서비스는 수출입 관련 리스크를 사전 스크리닝하는 도구이며, 법적인 효력을 갖는 공식 판결이 아닙니다.
                            수출 전 반드시 전문 관세사와 최종 상담하십시오.
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm text-center md:text-left">
                        © 2026 Global Seller Shield. All rights reserved. (모든 권리 보유)
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg text-[11px] text-red-400 font-medium">
                        IMPORTANT: 모든 정보는 참고용이며, 수출 전 반드시 전문 관세사와 상담하십시오.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
