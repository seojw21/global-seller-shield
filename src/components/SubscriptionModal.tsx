import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, Zap, BarChart3, Globe2, CreditCard } from 'lucide-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const paypalButtonRendered = useRef(false);

    const handleTossPayment = async () => {
        try {
            if (typeof window.TossPayments !== 'undefined') {
                const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5yaZDRar011111111111111';
                const tossPayments = window.TossPayments(clientKey);

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
            console.error('Toss Payment Error:', error);
        }
    };

    useEffect(() => {
        if (isOpen && paypalRef.current && !paypalButtonRendered.current) {
            if (window.paypal) {
                window.paypal.Buttons({
                    createOrder: (_data: any, actions: any) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '29.00',
                                    currency_code: 'USD'
                                },
                                description: 'Global Seller Shield Premium (1 Month)'
                            }]
                        });
                    },
                    onApprove: async (_data: any, actions: any) => {
                        const details = await actions.order.capture();
                        console.log('PayPal Payment Success:', details);
                        window.location.href = '/payment-success';
                    },
                    onError: (err: any) => {
                        console.error('PayPal Error:', err);
                    }
                }).render(paypalRef.current);
                paypalButtonRendered.current = true;
            }
        }
    }, [isOpen]);

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
                        className="relative w-full max-w-5xl glass-card rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(56,189,248,0.1)]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="grid md:grid-cols-2">
                            {/* Left Side: Features */}
                            <div className="p-10 md:p-12 bg-sky-500/5">
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/40">
                                        <Zap className="text-white w-6 h-6 fill-current" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-white">Premium Shield</span>
                                </div>

                                <h2 className="text-3xl font-black mb-6 leading-tight text-white">
                                    글로벌 셀러를 위한 <br />
                                    <span className="text-sky-400">심층 분석 워크플로우</span>
                                </h2>

                                <ul className="space-y-5 mb-10">
                                    {[
                                        { icon: ShieldCheck, text: "HS CODE 기반 국가별 정밀 리포트" },
                                        { icon: BarChart3, text: "실시간 글로벌 규제 변동 알림" },
                                        { icon: Globe2, text: "Gemini 2.0 Flash 기반 무제한 진단" },
                                        { icon: Zap, text: "수출입 금지 품목 실시간 데이터 분석" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <div className="shrink-0 w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <span className="text-slate-300 font-medium text-sm leading-relaxed">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        "이 서비스 덕분에 매달 수백만 원의 통관 리스크 비용을 절감할 수 있었습니다." <br />
                                        <span className="font-bold text-slate-400 not-italic">- 글로벌 셀러 A님</span>
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Payment Options */}
                            <div className="p-10 md:p-12 border-l border-white/5 flex flex-col justify-center bg-slate-900/40">
                                <div className="text-center mb-8">
                                    <div className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold mb-4 uppercase tracking-widest border border-sky-500/20">All Access Pass</div>
                                    <div className="flex items-baseline justify-center gap-1 mb-2">
                                        <span className="text-5xl font-black text-white">₩39,000</span>
                                        <span className="text-slate-500 font-medium whitespace-nowrap">/ 1개월</span>
                                    </div>
                                    <p className="text-slate-400 text-xs">글로벌 서비스가: $29.00 USD</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Toss Button */}
                                    <button
                                        onClick={handleTossPayment}
                                        className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl shadow-xl shadow-sky-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        토스페이먼츠 (국내 결제)
                                    </button>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-slate-900 px-3 text-slate-500">또는</span></div>
                                    </div>

                                    {/* PayPal Container */}
                                    <div className="space-y-3">
                                        <div ref={paypalRef} className="min-h-[150px]" />
                                    </div>

                                    <p className="text-[10px] text-center text-slate-500 px-4 leading-relaxed mt-4">
                                        결제 완료 즉시 모든 유료 기능을 사용할 수 있습니다. <br />
                                        정기 구독 상품이며, 언제든 마이페이지에서 해지 가능합니다.
                                    </p>
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
