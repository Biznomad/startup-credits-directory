import { useLenis } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import PrecisionProcess from './sections/PrecisionProcess';
import LanguageMatrix from './sections/LanguageMatrix';
import Testimonials from './sections/Testimonials';
import Pricing from './sections/Pricing';
import Footer from './sections/Footer';

function App() {
  useLenis();

  return (
    <div className="relative bg-[#F9F5E9]">
      <Navigation />
      <Hero />
      <PrecisionProcess />
      <LanguageMatrix />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App
