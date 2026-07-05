import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F9F5E9]/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container-luxury flex items-center justify-between h-20">
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
          className="font-display text-xl md:text-2xl tracking-tight text-[#1E3240]"
        >
          Certified<span className="text-[#387C7E]">.</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Home', id: 'hero' },
            { label: 'Services', id: 'process' },
            { label: 'About', id: 'languages' },
            { label: 'FAQ', id: 'pricing' },
            { label: 'Contact', id: 'footer' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-xs font-medium tracking-[0.05em] uppercase text-[#1E3240]/70 hover:text-[#1E3240] transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo('pricing')}
          className="btn-primary text-xs py-2.5 px-6"
        >
          Get a Quote
        </button>
      </div>
    </nav>
  );
}
