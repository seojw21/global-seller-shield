import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ComplianceInsight from './components/ComplianceInsight';
import RiskDashboard from './components/RiskDashboard';
import Footer from './components/Footer';
import SubscriptionModal from './components/SubscriptionModal';

import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
    const [isSubModalOpen, setSubModalOpen] = useState(false);
    const [view, setView] = useState<'main' | 'success' | 'fail'>('main');

    React.useEffect(() => {
        const path = window.location.pathname;
        if (path === '/payment-success') setView('success');
        if (path === '/payment-fail') setView('fail');
    }, []);

    if (view === 'success') {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <div className="glass-card p-12 rounded-[3rem] text-center max-w-lg w-full border-green-500/20">
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-black text-white mb-4">구독 활성화 완료!</h1>
                    <p className="text-slate-400 mb-8">이제 모든 프리미엄 리스크 분석 기능을 무제한으로 이용하실 수 있습니다.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="premium-button w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'fail') {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <div className="glass-card p-12 rounded-[3rem] text-center max-w-lg w-full border-red-500/20">
                    <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-black text-white mb-4">결제 실패</h1>
                    <p className="text-slate-400 mb-8">결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="premium-button w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col selection:bg-sky-500/30">
            <Header onOpenSubscription={() => setSubModalOpen(true)} />

            <main className="flex-grow">
                <Hero />

                <section className="py-20 bg-slate-950/50">
                    <ComplianceInsight />
                </section>

                <RiskDashboard onSubscribe={() => setSubModalOpen(true)} />
            </main>

            <Footer />

            <SubscriptionModal
                isOpen={isSubModalOpen}
                onClose={() => setSubModalOpen(false)}
            />
        </div>
    );
};

export default App;
