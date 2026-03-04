import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface HeaderProps {
    onOpenSubscription: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSubscription }) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold glow-text tracking-tight">
                        Global Seller Shield
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <a href="#" className="hover:text-sky-400 transition-colors">리스크 체크</a>
                    <a href="#" className="hover:text-sky-400 transition-colors">시장 통찰</a>
                    <a href="#" className="hover:text-sky-400 transition-colors">컴플라이언스 블로그</a>
                </nav>

                <button
                    onClick={onOpenSubscription}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold hover:bg-sky-500 hover:border-sky-400 transition-all group"
                >
                    <Sparkles className="w-4 h-4 text-sky-400 group-hover:text-white" />
                    <span>프리미엄 리포트 구독</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
