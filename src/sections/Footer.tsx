import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BOREALIS_VERTEX = `
uniform float time;
uniform vec2 mouse;
uniform sampler2D noiseTexture;
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 noiseTex = texture2D(noiseTexture, uv * vec2(1.0, 0.05) + vec2(0.0, time * 0.05));
  float noiseVal = noiseTex.r;
  vec3 newPos = position + normal * noiseVal * 0.8;
  vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vViewPosition = -mvPosition.xyz;
}
`;

const BOREALIS_FRAGMENT = `
precision mediump float;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float time;
varying vec2 vUv;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.y += time * 0.1;
  float a = atan(p.y, p.x);
  float r = length(p) * 2.0 + sin(a * 3.0 + time * 0.2) * 0.1;

  vec3 colorA = mix(color1, color2, sin(a + time * 0.3) * 0.5 + 0.5);
  vec3 colorB = mix(color3, color4, sin(a * 2.0 - time * 0.4) * 0.5 + 0.5);
  vec3 color = mix(colorA, colorB, sin(r + time * 0.5) * 0.5 + 0.5);

  float alpha = smoothstep(0.0, 0.5, 1.0 - r) * 0.8;
  gl_FragColor = vec4(color, alpha);
}
`;

function generateNoiseTexture(): THREE.DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size * 4; i += 4) {
    const val = Math.random() * 255;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  return texture;
}

function BorealisCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.offsetWidth;
    const height = 400;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    const noiseTexture = generateNoiseTexture();

    const geo = new THREE.PlaneGeometry(2, 2, 32, 32);
    const mat = new THREE.ShaderMaterial({
      vertexShader: BOREALIS_VERTEX,
      fragmentShader: BOREALIS_FRAGMENT,
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0, 0) },
        noiseTexture: { value: noiseTexture },
        color1: { value: new THREE.Color('#1E3240') },
        color2: { value: new THREE.Color('#387C7E') },
        color3: { value: new THREE.Color('#0a1628') },
        color4: { value: new THREE.Color('#D4A05A') },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const startTime = Date.now();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      mat.uniforms.time.value = (Date.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = parent.offsetWidth;
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      noiseTexture.dispose();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '400px',
        zIndex: 1,
      }}
    />
  );
}

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative w-full bg-[#1E3240]">
      <div className="relative" style={{ height: '400px' }}>
        <BorealisCanvas />
      </div>

      <div className="relative z-10 pt-16 pb-8">
        <div className="container-luxury">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
                <h3 className="font-display text-3xl text-[#F9F5E9] mb-4">
                  Certified<span className="text-[#387C7E]">.</span>
                </h3>
              </a>
              <p className="text-[#F9F5E9]/60 leading-relaxed max-w-md mb-6">
                Premium certified translation services trusted by law firms,
                universities, government agencies, and businesses worldwide.
                Every document. Every language. Guaranteed acceptance.
              </p>
              <div className="flex items-center gap-4">
                {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#F9F5E9]/10 flex items-center justify-center text-[#F9F5E9]/60 hover:bg-[#387C7E] hover:text-white transition-all duration-300"
                  >
                    <span className="text-xs font-medium">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.15em] uppercase text-[#D4A05A] font-medium mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Legal Translation', id: 'process' },
                  { label: 'Medical Translation', id: 'languages' },
                  { label: 'Academic Translation', id: 'languages' },
                  { label: 'Business Translation', id: 'process' },
                  { label: 'Certified Documents', id: 'pricing' },
                  { label: 'Apostille Services', id: 'pricing' },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className="text-[#F9F5E9]/60 hover:text-[#F9F5E9] transition-colors duration-300 text-sm"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.15em] uppercase text-[#D4A05A] font-medium mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', id: 'languages' },
                  { label: 'Our Process', id: 'process' },
                  { label: 'Testimonials', id: 'testimonials' },
                  { label: 'Pricing', id: 'pricing' },
                  { label: 'Contact', id: 'footer' },
                  { label: 'Careers', id: 'footer' },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className="text-[#F9F5E9]/60 hover:text-[#F9F5E9] transition-colors duration-300 text-sm"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#F9F5E9]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#F9F5E9]/40 text-xs">
              © 2025 Certified Translations. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[#F9F5E9]/40 hover:text-[#F9F5E9]/70 text-xs transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
