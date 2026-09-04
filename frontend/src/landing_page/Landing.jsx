import FinancialBackground from './components/FinancialBackground';
import LandingHeader from './components/LandingHeader';
import HeroSection from './components/HeroSection';
import MetricsTicker from './components/MetricsTicker';
import EnsembleSection from './components/EnsembleSection';
import CopilotSection from './components/CopilotSection';
import SimulatorSection from './components/SimulatorSection';
import SecuritySection from './components/SecuritySection';
import ComparisonSection from './components/ComparisonSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import LandingFooter from './components/LandingFooter';

const Landing = () => {
    return (
        <div className="min-h-screen text-slate-100 selection:bg-accent selection:text-black overflow-x-hidden font-body relative">
            {/* Rich Financial & Money Analytics Background with Indian Rupee (₹) Glyphs */}
            <FinancialBackground />

            {/* 1. Header */}
            <LandingHeader />

            {/* 2. Hero Section */}
            <HeroSection />

            {/* 3. Metrics Ticker */}
            <MetricsTicker />

            {/* 4. Spending Forecast Layers */}
            <EnsembleSection />

            {/* 5. AI Money Coach Assistant Demo */}
            <CopilotSection />

            {/* 6. Interactive Savings & Trajectory Calculator */}
            <SimulatorSection />

            {/* 7. Safety & Privacy First */}
            <SecuritySection />

            {/* 8. Comparison Matrix */}
            <ComparisonSection />

            {/* 9. Testimonials & Social Proof */}
            <TestimonialsSection />

            {/* 10. FAQ Accordion */}
            <FAQSection />

            {/* 11. Call to Action Banner */}
            <CTASection />

            {/* 12. Footer */}
            <LandingFooter />
        </div>
    );
};

export default Landing;
