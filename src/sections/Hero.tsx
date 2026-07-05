import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const SIMULATION_VERTEX = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SIMULATION_FRAGMENT = `
precision mediump float;
uniform sampler2D u_prevState;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float uBrushSize;
uniform float uBrushStrength;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;

varying vec2 v_uv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 3.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    p *= 2.03;
    amplitude *= 0.49;
    frequency *= 1.99;
  }
  return value;
}

vec3 fluidSample(sampler2D tex, vec2 uv) {
  vec3 raw = texture2D(tex, uv).rgb;
  return (raw - 0.5) * 0.8;
}

void main() {
  vec2 pixel = v_uv * u_resolution;
  vec2 texel = 1.0 / u_resolution;

  vec3 prev = fluidSample(u_prevState, v_uv);
  vec2 vel = prev.rg;
  float ink = prev.b;

  vec3 left = fluidSample(u_prevState, v_uv + vec2(-texel.x, 0.0));
  vec3 right = fluidSample(u_prevState, v_uv + vec2(texel.x, 0.0));
  vec3 up = fluidSample(u_prevState, v_uv + vec2(0.0, texel.y));
  vec3 down = fluidSample(u_prevState, v_uv + vec2(0.0, -texel.y));

  vel += uFluidDecay * (left.rg + right.rg + up.rg + down.rg - 4.0 * vel);
  ink += uFluidDecay * (left.b + right.b + up.b + down.b - 4.0 * ink);

  vec2 advUV = v_uv - vel * texel;
  vec3 advected = fluidSample(u_prevState, advUV);
  vel = mix(vel, advected.rg, uTrailLength);
  ink = mix(ink, advected.b, uTrailLength);

  float angle = fbm(v_uv * 2.5 + u_time * 0.08) * 6.2831;
  vec2 force = vec2(cos(angle), sin(angle)) * 0.003;
  vel += force;
  ink += force.x * 0.5;

  if (u_mouse.x > 0.0) {
    vec2 mDir = (u_mouse - pixel);
    float mDist = length(mDir);
    if (mDist < 20.0) {
      vec2 norm = mDir / mDist;
      vel += norm * 0.015 * uBrushStrength;
      ink += 0.018 * uBrushStrength;
    } else if (mDist < 150.0) {
      float falloff = (1.0 - mDist / 150.0) * uBrushStrength * 0.02;
      vec2 norm = mDir / max(mDist, 0.001);
      vel += vec2(cos(falloff * 10.0 + u_time), sin(falloff * 10.0 - u_time)) * falloff * 0.5;
      vel += norm * falloff * 0.1;
      ink += falloff * 0.1;
    }
  }

  vel *= uStopDecay;
  ink *= uStopDecay;

  vel = clamp(vel, vec2(-0.4), vec2(0.4));
  ink = clamp(ink, -0.4, 0.4);
  vec3 state = vec3(vel, ink);

  gl_FragColor = vec4(state / 0.8 + 0.5, 1.0);
}
`;

const DISPLAY_VERTEX = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const DISPLAY_FRAGMENT = `
precision mediump float;
uniform sampler2D u_ink;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  vec3 inkRaw = texture2D(u_ink, uv).rgb;
  vec3 state = (inkRaw - 0.5) * 0.8;
  float ink = state.b;
  float velMag = length(state.rg);

  vec3 deepNavy = vec3(30.0, 50.0, 64.0) / 255.0;
  vec3 teal = vec3(56.0, 124.0, 126.0) / 255.0;
  vec3 gold = vec3(212.0, 160.0, 90.0) / 255.0;

  vec3 color = mix(deepNavy, teal, smoothstep(0.0, 0.08, ink));
  color = mix(color, gold, smoothstep(0.05, 0.2, velMag));

  float velGlow = exp(-velMag * velMag * 400.0);
  color += gold * velGlow * 0.3;

  vec2 tx = 1.0 / u_resolution;
  float t1 = (texture2D(u_ink, uv + vec2(-tx.x, -tx.y)).rgb - 0.5).b * 0.8;
  float t2 = (texture2D(u_ink, uv + vec2(0.0, -tx.y)).rgb - 0.5).b * 0.8;
  float t3 = (texture2D(u_ink, uv + vec2(tx.x, -tx.y)).rgb - 0.5).b * 0.8;
  float t4 = (texture2D(u_ink, uv + vec2(-tx.x, 0.0)).rgb - 0.5).b * 0.8;
  float t6 = (texture2D(u_ink, uv + vec2(tx.x, 0.0)).rgb - 0.5).b * 0.8;
  float t7 = (texture2D(u_ink, uv + vec2(-tx.x, tx.y)).rgb - 0.5).b * 0.8;
  float t8 = (texture2D(u_ink, uv + vec2(0.0, tx.y)).rgb - 0.5).b * 0.8;
  float t9 = (texture2D(u_ink, uv + vec2(tx.x, tx.y)).rgb - 0.5).b * 0.8;

  float sobelX = -t1 - 2.0*t4 - t7 + t3 + 2.0*t6 + t9;
  float sobelY = -t1 - 2.0*t2 - t3 + t7 + 2.0*t8 + t9;
  float edge = length(vec2(sobelX, sobelY));
  color += gold * smoothstep(0.5, 1.5, edge) * 0.15;

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const simScene = new THREE.Scene();
    const displayScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const simRes = { x: Math.floor(width * 0.5), y: Math.floor(height * 0.5) };
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    };
    let rtA = new THREE.WebGLRenderTarget(simRes.x, simRes.y, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(simRes.x, simRes.y, rtOptions);

    const simUniforms = {
      u_prevState: { value: rtA.texture },
      u_resolution: { value: new THREE.Vector2(simRes.x, simRes.y) },
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(-1, -1) },
      uBrushSize: { value: 20.0 },
      uBrushStrength: { value: 1.0 },
      uFluidDecay: { value: 0.15 },
      uTrailLength: { value: 0.85 },
      uStopDecay: { value: 0.995 },
    };

    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: SIMULATION_VERTEX,
      fragmentShader: SIMULATION_FRAGMENT,
      uniforms: simUniforms,
    });

    const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    simScene.add(simQuad);

    const displayUniforms = {
      u_ink: { value: rtB.texture },
      u_resolution: { value: new THREE.Vector2(simRes.x, simRes.y) },
      u_time: { value: 0 },
    };

    const displayMaterial = new THREE.ShaderMaterial({
      vertexShader: DISPLAY_VERTEX,
      fragmentShader: DISPLAY_FRAGMENT,
      uniforms: displayUniforms,
    });

    const displayQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), displayMaterial);
    displayScene.add(displayQuad);

    const startTime = Date.now();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (Date.now() - startTime) / 1000;

      simUniforms.u_time.value = elapsed;
      simUniforms.u_prevState.value = rtA.texture;
      simUniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);

      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);

      displayUniforms.u_ink.value = rtB.texture;
      displayUniforms.u_time.value = elapsed;

      renderer.setRenderTarget(null);
      renderer.render(displayScene, camera);

      const temp = rtA;
      rtA = rtB;
      rtB = temp;
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = simRes.x / rect.width;
      const scaleY = simRes.y / rect.height;
      mouseRef.current.x = (e.clientX - rect.left) * scaleX;
      mouseRef.current.y = (rect.height - (e.clientY - rect.top)) * scaleY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      renderer.setSize(w, h);
      const newSimX = Math.floor(w * 0.5);
      const newSimY = Math.floor(h * 0.5);
      simUniforms.u_resolution.value.set(newSimX, newSimY);
      displayUniforms.u_resolution.value.set(newSimX, newSimY);
      rtA.setSize(newSimX, newSimY);
      rtB.setSize(newSimX, newSimY);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      rtA.dispose();
      rtB.dispose();
      simMaterial.dispose();
      displayMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.3 }
      );
    }
    if (captionRef.current) {
      gsap.fromTo(captionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.2 }
      );
    }
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <h1
          ref={textRef}
          className="font-display text-[clamp(3rem,12vw,10rem)] leading-none tracking-[-0.02em] text-center opacity-0"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px rgba(249, 245, 233, 0.6)',
            textShadow: '0 0 80px rgba(56, 124, 126, 0.3)',
          }}
        >
          CERTIFIED
        </h1>

        <div ref={captionRef} className="mt-8 text-center opacity-0 pointer-events-auto">
          <p className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-[#F9F5E9]/80 mb-6">
            Global Documents. Local Precision. Guaranteed Acceptance.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('process');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase text-[#D4A05A] hover:text-[#F9F5E9] transition-colors duration-300 group"
          >
            Learn More
            <svg
              className="w-4 h-4 transform group-hover:translate-y-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
