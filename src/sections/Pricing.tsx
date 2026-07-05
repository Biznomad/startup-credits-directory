import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const pricingPlans = [
  {
    id: 'standard',
    name: 'Standard',
    price: '$49',
    per: 'per page',
    turnaround: '3-5 business days',
    features: [
      'Certified translation',
      'Digital certificate',
      'Notarization available',
      'Email delivery',
      '1 round of revisions',
    ],
    bestFor: 'Personal documents, birth certificates',
    color: '#387C7E',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$89',
    per: 'per page',
    turnaround: '1-2 business days',
    features: [
      'Everything in Standard',
      'Priority processing',
      'Hard copy + mailing',
      'Apostille service',
      'Unlimited revisions',
      'Dedicated project manager',
    ],
    bestFor: 'Legal contracts, business agreements',
    color: '#1E3240',
    popular: true,
  },
  {
    id: 'priority',
    name: 'Priority',
    price: '$149',
    per: 'per page',
    turnaround: 'Same day delivery',
    features: [
      'Everything in Business',
      'Same-day turnaround',
      'Expedited notarization',
      'Express mail included',
      '24/7 support hotline',
      'Video consultation',
    ],
    bestFor: 'Urgent immigration, court deadlines',
    color: '#D4A05A',
  },
];

export default function Pricing() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll('.pricing-card');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );
    });
  }, []);

  const toggleCard = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative w-full bg-[#F9F5E9] section-padding overflow-hidden"
    >
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-32">
            <span className="text-[#387C7E] text-xs tracking-[0.2em] uppercase font-medium">
              Pricing
            </span>
            <h2 className="font-display text-4xl md:text-6xl mt-4 mb-6">
              Transparent
              <br />
              <span className="text-[#387C7E]">Pricing</span>
            </h2>
            <p className="text-[#4A4A4A] text-lg leading-relaxed max-w-md mb-8">
              No hidden fees. No surprises. Every quote includes certification,
              notarization, and guaranteed acceptance. Volume discounts available
              for projects over 50 pages.
            </p>
            <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
              <img
                src="/images/portfolio.jpg"
                alt="Premium service"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3240]/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/80 text-sm">
                  Enterprise clients receive dedicated account management
                  and custom SLA agreements.
                </p>
              </div>
            </div>
          </div>

          <div ref={cardsRef} className="space-y-4">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`pricing-card rounded-xl overflow-hidden transition-all duration-500 ${
                  plan.popular ? 'ring-2 ring-[#D4A05A]' : ''
                }`}
                style={{
                  backgroundColor: openIndex === index ? plan.color : '#FFFFFF',
                }}
              >
                <button
                  onClick={() => toggleCard(index)}
                  className="w-full p-6 md:p-8 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.popular ? '#D4A05A' : plan.color }}
                    />
                    <div>
                      <h3
                        className="font-display text-2xl md:text-3xl transition-colors duration-300"
                        style={{ color: openIndex === index ? '#FFFFFF' : '#1E3240' }}
                      >
                        {plan.name}
                      </h3>
                      {plan.popular && (
                        <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#D4A05A] text-white text-[10px] tracking-wider uppercase font-medium">
                          Most Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-display text-3xl md:text-4xl transition-colors duration-300"
                      style={{ color: openIndex === index ? '#FFFFFF' : '#1E3240' }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="block text-xs transition-colors duration-300"
                      style={{ color: openIndex === index ? 'rgba(255,255,255,0.7)' : '#4A4A4A' }}
                    >
                      {plan.per}
                    </span>
                  </div>
                </button>

                <div
                  className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    maxHeight: openIndex === index ? '500px' : '0px',
                    opacity: openIndex === index ? 1 : 0,
                  }}
                >
                  <div className="px-6 md:px-8 pb-8">
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-[#D4A05A]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white/90 text-sm">
                          Turnaround: {plan.turnaround}
                        </span>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                            <svg className="w-4 h-4 text-[#D4A05A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <p className="text-white/60 text-xs mb-6">
                        <span className="text-[#D4A05A]">Best for:</span> {plan.bestFor}
                      </p>

                      <button className="w-full py-3 px-6 rounded-full bg-white text-[#1E3240] text-sm font-medium tracking-wider uppercase hover:bg-[#F9F5E9] transition-colors duration-300">
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 p-6 rounded-xl bg-[#1E3240] text-center">
              <p className="text-white/70 text-sm mb-3">
                Need a custom solution for your organization?
              </p>
              <button className="text-[#D4A05A] text-sm font-medium tracking-wider uppercase hover:text-white transition-colors duration-300">
                Contact for Enterprise Pricing →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
