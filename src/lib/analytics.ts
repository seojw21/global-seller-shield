// Lightweight analytics tracker for conversion optimization
// Saves events to localStorage (client-side) + exposes weekly report generator

export interface AnalyticsEvent {
    event: string;
    category: string;
    label?: string;
    value?: number;
    timestamp: string;
    path: string;
}

const STORAGE_KEY = 'gss_analytics';

function getEvents(): AnalyticsEvent[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveEvents(events: AnalyticsEvent[]) {
    // Keep only last 30 days of events
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const filtered = events.filter(e => new Date(e.timestamp) > cutoff);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function trackEvent(event: string, category: string, label?: string, value?: number) {
    const events = getEvents();
    events.push({
        event,
        category,
        label,
        value,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
    });
    saveEvents(events);
}

// Pre-built tracking helpers
export const Analytics = {
    // Traffic Layer
    pageView: (page: string) => trackEvent('page_view', 'traffic', page),
    blogClick: () => trackEvent('blog_click', 'traffic', 'daily_blog'),
    cardNewsClick: () => trackEvent('card_news_click', 'traffic', 'card_news'),

    // Conversion Layer
    dashboardView: () => trackEvent('dashboard_view', 'conversion', 'risk_dashboard'),
    subscribeClick: (source: string) => trackEvent('subscribe_click', 'conversion', source),
    paymentStart: (method: string) => trackEvent('payment_start', 'conversion', method),
    paymentComplete: (method: string) => trackEvent('payment_complete', 'conversion', method),

    // Engagement
    riskScreening: (item: string, country: string) => trackEvent('risk_screening', 'engagement', `${item}_${country}`),
    countrySelect: (country: string) => trackEvent('country_select', 'engagement', country),
};

// Weekly report generator
export function generateWeeklyReport() {
    const events = getEvents();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekEvents = events.filter(e => new Date(e.timestamp) >= weekAgo);

    const metrics: Record<string, number> = {};
    weekEvents.forEach(e => {
        const key = `${e.category}:${e.event}`;
        metrics[key] = (metrics[key] || 0) + 1;
    });

    const totalTraffic = weekEvents.filter(e => e.category === 'traffic').length;
    const subscribeClicks = weekEvents.filter(e => e.event === 'subscribe_click').length;
    const payments = weekEvents.filter(e => e.event === 'payment_complete').length;
    const ctr = totalTraffic > 0 ? ((subscribeClicks / totalTraffic) * 100).toFixed(1) : '0';

    return {
        period: { start: weekAgo.toISOString(), end: now.toISOString() },
        totalEvents: weekEvents.length,
        trafficEvents: totalTraffic,
        subscribeClicks,
        paymentCompletions: payments,
        conversionRate: `${ctr}%`,
        topSources: Object.entries(metrics)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([key, count]) => ({ event: key, count })),
    };
}
