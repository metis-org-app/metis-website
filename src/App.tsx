import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ProductPreview from './components/ProductPreview';
import CanvasSection from './components/CanvasSection';
import Features from './components/Features';
import Steps from './components/Steps';
import Showcase from './components/Showcase';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <ProductPreview />
      <CanvasSection />
      <Features />
      <Steps />
      <Showcase />
      <CTA />
      <Footer />
    </>
  );
}
