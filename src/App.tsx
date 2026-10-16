import { SiteFooter } from './components/layout/SiteFooter';
import { SiteHeader } from './components/layout/SiteHeader';
import { SkipLink } from './components/layout/SkipLink';

export default function App() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none" />
      <SiteFooter />
    </>
  );
}
