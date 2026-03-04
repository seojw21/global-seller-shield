import React from 'react';
import { ArrowRight, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const insightPosts = [
    {
        title: "미국 식품 수출 시 90%가 놓치는 3가지 실수",
        category: "Food & Beverage",
        readTime: "5 min",
        image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=400",
        excerpt: "FDA 등록만으로는 부족합니다. 라벨링 규정과 성분 분석표의 함정을 피하는 법."
    },
    {
        title: "EU 배터리 규제 변경: 리튬이온 배터리 셀러 필독",
        category: "Electronics",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=400",
        excerpt: "2024년부터 강화되는 CE 인증 및 에코 디자인 지침에 대비하는 전략."
    },
    {
        title: "동남아시아 이커머스: 통관 지연을 줄이는 서류 최적화",
        category: "Logistics",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=400",
        excerpt: "Shopee, Lazada 셀러를 위한 현지 관세청 대응 매뉴얼 및 인보이스 작성 팁."
    }
];

const ComplianceInsight: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h2 className="text-3xl font-bold mb-2">셀러 컴플라이언스 인사이트</h2>
                    <p className="text-slate-400">전문가가 제안하는 최신 글로벌 통관 트렌드와 리스크 관리 노하우</p>
                </div>
                <button className="hidden md:flex items-center gap-2 text-sky-400 font-semibold hover:text-sky-300 transition-colors">
                    전체 포스트 보기
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {insightPosts.map((post, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-sky-500 text-[10px] font-black uppercase tracking-tighter rounded-full">
                                {post.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> 프리미엄</span>
                            </div>
                            <h3 className="text-lg font-bold mb-3 group-hover:text-sky-400 transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-slate-400 mb-6 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center gap-2 text-sky-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                아티클 읽기
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ComplianceInsight;
