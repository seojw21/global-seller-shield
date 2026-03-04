import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, Zap, BarChart3, Globe2, CreditCard } from 'lucide-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
    const handlePayment = async () => {
        try {
            // @ts-ignore - TossPayments is loaded via script tag in index.html
            if (typeof window.TossPayments !== 'undefined') {
                // @ts-ignore
                const tossPayments = window.TossPayments('test_ck_D5yaZDRar011111111111111');

                await tossPayments.requestPayment('카드', {
                    amount: 39000,
                    orderId: `order_${Math.random().toString(36).slice(2)}`,
                    orderName: 'Global Seller Shield 프리미엄 구독 (1개월)',
                    customerName: '홍길동',
                    successUrl: window.location.origin + '/payment-success',
                    failUrl: window.location.origin + '/payment-fail',
                });
            } else {
                alert('토스페이먼츠 엔진을 로드하지 못했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Payment Error:', error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl glass-card rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(56,189,248,0.1)]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="grid md:grid-cols-2">
                            <div className="p-12 bg-sky-500/5">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                                        <Zap className="text-white w-6 h-6 fill-current" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-white">프리미엄 쉴드</span>
                                </div>

                                <h2 className="text-3xl font-black mb-6">프로급 <span className="text-sky-400">컴플라이언스</span>로 업그레이드 하세요.</h2>

                                <ul className="space-y-6 mb-12">
                                    {[
                                        { icon: ShieldCheck, text: "특정 HS CODE 기반 무제한 상세 리포트" },
                                        { icon: BarChart3, text: "실시간 관세 변동 자동 알림 서비스" },
                                        { icon: Globe2, text: "200개국 이상의 최신 통관 규정 데이터셋" },
                                        { icon: Zap, text: "Gemini 1.5 Pro 우선 처리 (초고속 분석)" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="shrink-0 w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-slate-300 font-medium">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-12 border-l border-white/5 flex flex-col justify-center">
                                <div className="text-center mb-10">
                                    <div className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold mb-4 uppercase tracking-widest">가장 인기 있는 플랜</div>
                                    <div className="text-5xl font-black mb-2">₩39,000<span className="text-lg text-slate-500 font-medium">/월</span></div>
                                    <p className="text-slate-400 font-medium">매월 정기 결제. 언제든 해지 가능.</p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handlePayment}
                                        className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl shadow-xl shadow-sky-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        토스페이먼츠로 결제하기
                                    </button>
                                    <p className="text-[10px] text-center text-slate-500 px-8 leading-relaxed">
                                        구독을 시작하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다. <br />
                                        토스페이먼츠를 통한 안전한 결제가 지원됩니다.
                                    </p>
                                </div>


                                <div className="mt-12 flex items-center justify-center gap-6 grayscale opacity-60">
                                    <img src="https://static.toss.im/assets/payments/brand-logotype-blue.png" alt="Toss Payments" className="h-4" />
                                    <div className="h-4 w-[1px] bg-white/10" />
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Secure Transaction</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SubscriptionModal;
