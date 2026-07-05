import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    image: '/images/document-seal.jpg',
    title: 'INTAKE.',
    subtitle: 'Document Submission',
    description: 'Upload your documents securely through our encrypted portal. We accept all major formats including PDF, DOCX, and scanned images.',
  },
  {
    image: '/images/translator-hands.jpg',
    title: 'EXPERTISE.',
    subtitle: 'Expert Translation',
    description: 'Our certified linguists with domain expertise meticulously translate your documents, preserving every nuance and technical detail.',
  },
  {
    image: '/images/certificate.jpg',
    title: 'CERTIFIED.',
    subtitle: 'Certified Delivery',
    description: 'Receive your notarized, certified translation with guaranteed acceptance by USCIS, courts, universities, and government agencies worldwide.',
  },
];

export default function PrecisionProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!canvasContainerRef.current || !sectionRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    const textureLoader = new THREE.TextureLoader();
    const group = new THREE.Group();
    scene.add(group);

    const cylinderRadius = 3;
    const imageWidth = 2.2;
    const imageHeight = 1.5;
    const angleStep = (Math.PI * 2) / slides.length;

    slides.forEach((slide, i) => {
      const tex = textureLoader.load(slide.image);
      tex.minFilter = THREE.LinearFilter;
      const geo = new THREE.PlaneGeometry(imageWidth, imageHeight);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = i * angleStep;
      mesh.position.x = Math.sin(angle) * cylinderRadius;
      mesh.position.z = Math.cos(angle) * cylinderRadius;
      mesh.rotation.y = angle + Math.PI;
      group.add(mesh);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const targetRotation = progressRef.current * Math.PI * 2;
      group.rotation.y += (targetRotation - group.rotation.y) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const slideIndex = Math.min(2, Math.floor(self.progress * 3));

        if (textContainerRef.current) {
          const texts = textContainerRef.current.querySelectorAll('.process-slide');
          texts.forEach((text, i) => {
            const el = text as HTMLElement;
            if (i === slideIndex) {
              gsap.to(el, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
            } else {
              gsap.to(el, { opacity: 0, y: 40, duration: 0.3, overwrite: true });
            }
          });
        }
      },
    });

    const handleResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      st.kill();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#1E3240] overflow-hidden"
    >
      <div className="absolute inset-0 flex">
        <div
          ref={canvasContainerRef}
          className="w-full md:w-1/2 h-full relative"
        />
        <div
          ref={textContainerRef}
          className="hidden md:flex w-1/2 h-full items-center justify-center relative"
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="process-slide absolute inset-0 flex flex-col justify-center px-12 lg:px-20"
              style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateY(0)' : 'translateY(40px)' }}
            >
              <span className="text-[#D4A05A] text-xs tracking-[0.2em] uppercase font-medium mb-4">
                {slide.subtitle}
              </span>
              <h2
                className="font-display text-5xl lg:text-7xl text-[#F9F5E9] mb-6"
                style={{ textShadow: '0 0 60px rgba(56, 124, 126, 0.4)' }}
              >
                {slide.title}
              </h2>
              <p className="text-[#F9F5E9]/70 text-lg leading-relaxed max-w-md">
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden absolute bottom-12 left-0 right-0 px-6">
        <div className="glass-card rounded-lg p-6">
          <span className="text-[#D4A05A] text-xs tracking-[0.2em] uppercase font-medium">
            Scroll to explore
          </span>
          <h3 className="font-display text-2xl text-[#F9F5E9] mt-2">
            The Precision Process
          </h3>
        </div>
      </div>
    </section>
  );
}
