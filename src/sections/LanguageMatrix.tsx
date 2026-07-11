import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const languages = [
  'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese',
  'Russian', 'Korean', 'Italian', 'Dutch', 'Turkish', 'Hindi', 'Vietnamese',
  'Polish', 'Thai', 'Swedish', 'Greek', 'Hebrew', 'Czech', 'Romanian',
  'Indonesian', 'Danish', 'Finnish', 'Norwegian', 'Hungarian', 'Ukrainian',
  'Malay', 'Persian', 'Bengali', 'Birth Certificate', 'Marriage License',
  'Legal Contract', 'Academic Transcript', 'Medical Record', 'Immigration',
  'Business Agreement', 'Patent Document', 'Court Order', 'Death Certificate',
  'Adoption Papers', 'Passport', 'Visa Application', 'Driver License',
  'Diploma', 'Resume', 'Tax Document', 'Insurance Policy', 'Affidavit',
];

function TreadmillItem({ position, color }: { position: [number, number, number]; text: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const speed = 0.15;
    const boundsY = 12;

    let y = ((position[1] + t * speed) % boundsY);
    if (y < -boundsY / 2) y += boundsY;

    meshRef.current.position.y = y - (boundsY / 2);
    meshRef.current.position.x = position[0];
    meshRef.current.position.z = position[2] + Math.sin(meshRef.current.position.x * 10 + t * 6) * 0.004;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[2.2, 0.5]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

function TreadmillScene() {
  const items = useMemo(() => {
    const cols = 8;
    const rows = 7;
    const result: { position: [number, number, number]; text: string; color: string }[] = [];

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const idx = (col * rows + row) % languages.length;
        const isGold = Math.random() > 0.85;
        result.push({
          position: [(col - cols / 2) * 2.5, (row - rows / 2) * 0.8, 0],
          text: languages[idx],
          color: isGold ? '#D4A05A' : '#387C7E',
        });
      }
    }
    return result;
  }, []);

  return (
    <>
      {items.map((item, i) => (
        <TreadmillItem key={i} position={item.position} text={item.text} color={item.color} />
      ))}
    </>
  );
}

function DOMTextOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const texts = containerRef.current.querySelectorAll('.treadmill-text');
    const cols = 8;
    const rows = 7;

    texts.forEach((text, i) => {
      const el = text as HTMLElement;
      const col = Math.floor(i / rows);
      const row = i % rows;
      el.style.left = `${(col / cols) * 100}%`;
      el.style.top = `${(row / rows) * 100}%`;
      el.style.width = `${100 / cols}%`;
    });
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 56 }).map((_, i) => {
        const idx = i % languages.length;
        const isGold = i % 7 === 0;
        return (
          <div
            key={i}
            className="treadmill-text absolute flex items-center justify-center"
            style={{ height: `${100 / 7}%` }}
          >
            <span
              className={`text-xs md:text-sm font-medium tracking-wider whitespace-nowrap ${
                isGold ? 'text-[#D4A05A]' : 'text-[#387C7E]'
              }`}
              style={{ opacity: 0.6 }}
            >
              {languages[idx]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function LanguageMatrix() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="languages"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#1E3240] overflow-hidden section-padding"
    >
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <TreadmillScene />
        </Canvas>
      </div>

      <DOMTextOverlay />

      <div className="relative z-10 container-luxury flex items-center justify-center min-h-[60vh]">
        <div className="glass-card rounded-2xl p-10 md:p-16 max-w-2xl text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#387C7E]/20 text-[#387C7E] text-xs tracking-[0.15em] uppercase font-medium mb-6">
            Global Reach
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-[#F9F5E9] mb-6">
            100+ Languages
            <br />
            <span className="text-[#D4A05A]">& Industries</span>
          </h2>
          <p className="text-[#F9F5E9]/70 text-lg leading-relaxed mb-8">
            From legal contracts to medical records, academic transcripts to immigration documents.
            Our certified translators cover every major language pair and specialized domain with
            native-level precision.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {['Legal', 'Medical', 'Academic', 'Business', 'Immigration', 'Technical', 'Financial', 'Personal'].map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-2 text-[#F9F5E9]/60 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#387C7E]" />
                {industry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
