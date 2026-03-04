import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ComplianceInsight from './components/ComplianceInsight';
import Footer from './components/Footer';
import SubscriptionModal from './components/SubscriptionModal';

const App: React.FC = () => {
    const [isSubModalOpen, setSubModalOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col selection:bg-sky-500/30">
            <Header onOpenSubscription={() => setSubModalOpen(true)} />

            <main className="flex-grow">
                <Hero />

                <section className="py-20 bg-slate-950/50">
                    <ComplianceInsight />
                </section>
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
