import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Immigration Attorney',
    image: '/images/client-1.jpg',
    quote: 'The certified translations for my clients\' visa applications have been flawless. Every document was accepted by USCIS without a single question. Their attention to legal terminology is unmatched.',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'International Business Director',
    image: '/images/client-2.jpg',
    quote: 'We needed urgent translation of complex M&A documents across three languages. They delivered with 24 hours, maintaining perfect accuracy on financial and legal terminology.',
  },
  {
    id: 3,
    name: 'Elena Kowalski',
    role: 'University Registrar',
    image: '/images/client-3.jpg',
    quote: 'International student transcripts require precision. Certified Translations has been our trusted partner for five years, handling documents from 40+ countries with consistent quality.',
  },
  {
    id: 4,
    name: 'Prof. Arthur Pemberton',
    role: 'Research Fellow, Oxford',
    image: '/images/client-4.jpg',
    quote: 'Academic papers demand not just translation but deep subject matter expertise. Their team of specialized translators understood the nuances of my research and delivered exemplary work.',
  },
  {
    id: 5,
    name: 'Michael Chen',
    role: 'Patent Attorney',
    image: '/images/client-2.jpg',
    quote: 'Patent documents are some of the most challenging texts to translate. The technical precision and legal accuracy they provide has been essential for our international filings.',
  },
  {
    id: 6,
    name: 'Isabella Romano',
    role: 'Medical Director',
    image: '/images/client-1.jpg',
    quote: 'Medical records translation requires both linguistic skill and deep domain knowledge. Their HIPAA-compliant process and certified medical translators give us complete confidence.',
  },
  {
    id: 7,
    name: 'David Park',
    role: 'Real Estate Developer',
    image: '/images/client-3.jpg',
    quote: 'Cross-border property deals involve complex documentation. They handled our entire portfolio of contracts, deeds, and permits with remarkable speed and accuracy.',
  },
  {
    id: 8,
    name: 'Amara Osei',
    role: 'NGO Program Director',
    image: '/images/client-4.jpg',
    quote: 'Working in 12 countries means constant translation needs. Their consistent quality, fair pricing, and understanding of our mission make them an invaluable partner.',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll('.testimonial-card');

    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    });
  }, []);

  const getCardStyle = (index: number): React.CSSProperties => {
    const total = testimonials.length;
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = Math.min(400, window.innerWidth * 0.25);

    if (activeIndex !== null) {
      if (index === activeIndex) {
        return {
          transform: 'translate(-50%, -50%) scale(1.15)',
          left: '30%',
          top: '50%',
          zIndex: 50,
          opacity: 1,
        };
      } else {
        const offset = index < activeIndex ? index : index - 1;
        return {
          transform: `translate(-50%, -50%) scale(0.7)`,
          left: '75%',
          top: `${15 + (offset % 4) * 22}%`,
          zIndex: 10,
          opacity: 0.6,
        };
      }
    }

    return {
      transform: `translate(-50%, -50%)`,
      left: `50%`,
      top: `50%`,
      marginLeft: `${Math.cos(angle) * radius}px`,
      marginTop: `${Math.sin(angle) * radius}px`,
      zIndex: 20,
    };
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F9F5E9] section-padding overflow-hidden"
    >
      <div className="container-luxury mb-16">
        <span className="text-[#387C7E] text-xs tracking-[0.2em] uppercase font-medium">
          Client Stories
        </span>
        <h2 className="font-display text-4xl md:text-6xl mt-4">
          Trusted Worldwide
        </h2>
      </div>

      <div
        ref={cardsRef}
        className="relative w-full h-[70vh] md:h-[80vh]"
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="testimonial-card absolute transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
            style={{
              ...getCardStyle(index),
              width: 'clamp(180px, 22vw, 260px)',
            }}
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-display text-lg text-[#1E3240]">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-[#4A4A4A]/70 mt-1">
                  {testimonial.role}
                </p>
              </div>
            </div>

            {activeIndex === index && (
              <div className="absolute left-full ml-6 top-0 w-80 md:w-96 glass-card bg-white/90 rounded-xl p-6 shadow-2xl z-50">
                <svg className="w-8 h-8 text-[#D4A05A] mb-4 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-[#4A4A4A] leading-relaxed text-sm">
                  {testimonial.quote}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-4 h-4 text-[#D4A05A]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-[#4A4A4A]/50">Verified Client</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <button
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-0 bg-transparent"
          aria-label="Close testimonial"
        />
      )}
    </section>
  );
}
