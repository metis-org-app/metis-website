import { SiteFooter } from './components/layout/SiteFooter';
import { SiteHeader } from './components/layout/SiteHeader';
import { SkipLink } from './components/layout/SkipLink';
import { DemoProvider } from './features/guide/DemoProvider';
import { ConfigureSection } from './sections/configure/ConfigureSection';
import { CtaSection } from './sections/cta/CtaSection';
import { GuideSection } from './sections/guide/GuideSection';
import { HeroSection } from './sections/hero/HeroSection';
import { InsightsSection } from './sections/insights/InsightsSection';
import { ResultsSection } from './sections/results/ResultsSection';
import { SpecSection } from './sections/spec/SpecSection';
import { TickerStrip } from './sections/TickerStrip';

export default function App() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection />
        <TickerStrip />
        {/* The guide chat and the configurator share the guide rules. */}
        <DemoProvider>
          <GuideSection />
          <ConfigureSection />
        </DemoProvider>
        <ResultsSection />
        <InsightsSection />
        <SpecSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
