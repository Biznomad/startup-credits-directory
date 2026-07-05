# Certified Translations — 3D Cinematic Website

A premium, immersive 3D animated website for certified translation services. Built with React 19, Three.js, @react-three/fiber, GSAP, and Lenis smooth scroll.

## Live Demo

[View Deployed Site](https://j2j5frojhpvfg.kimi.page)

## Features

### 1. Kinetic Ink Typography (Hero)
- Fullscreen WebGL fluid simulation using ping-pong render targets
- FBM noise-driven ink physics with mouse interaction
- Custom GLSL shaders for fluid advection, diffusion, and display composition
- "CERTIFIED" title with transparent stroke revealing ink through letterforms

### 2. 3D Cylindrical Scroll Gallery (Precision Process)
- Scroll-driven Three.js cylinder rotation via GSAP ScrollTrigger
- Images arranged on a virtual cylinder that rotates as user scrolls
- Pinned section with 300vh scroll distance
- Synchronized text transitions for each slide

### 3. Quantum Treadmill Belt (Language Matrix)
- Infinite looping 3D text grid using @react-three/fiber
- 56 animated language/industry labels in teal and gold
- Glassmorphism info card overlay with backdrop-filter blur

### 4. Radial Card Ripple (Testimonials)
- 8 testimonial cards arranged in a circular flower pattern
- GSAP-powered entrance animations
- Click-to-expand with detail view showing quotes and ratings

### 5. Elasto-Card Accordion (Pricing)
- 3-tier pricing with spring-physics expansion
- Chromatic color transitions on expand
- Sticky sidebar with editorial imagery

### 6. Borealis Skybox (Footer)
- WebGL aurora borealis shader with noise displacement
- 4-color gradient mixing with radial wave patterns
- Transparent overlay on deep navy footer

## Tech Stack

- **React 19** + TypeScript + Vite
- **Three.js** + @react-three/fiber + @react-three/drei
- **GSAP** with ScrollTrigger
- **Lenis** smooth scroll
- **Tailwind CSS 3.4**

## Design System

| Token | Value |
|-------|-------|
| Deep Navy | `#1E3240` |
| Light Cream | `#F9F5E9` |
| Teal Accent | `#387C7E` |
| Warm Gold | `#D4A05A` |
| Display Font | Playfair Display |
| Body Font | Inter |

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── sections/
│   ├── Navigation.tsx    # Sticky nav with scroll transition
│   ├── Hero.tsx          # WebGL ink simulation hero
│   ├── PrecisionProcess.tsx  # 3D scroll gallery
│   ├── LanguageMatrix.tsx    # Animated text treadmill
│   ├── Testimonials.tsx      # Radial card layout
│   ├── Pricing.tsx       # Elastic accordion
│   └── Footer.tsx        # Borealis aurora effect
├── hooks/
│   ├── useLenis.ts       # Smooth scroll hook
│   └── useScrollProgress.ts
└── App.tsx               # Root component
```

## Performance Notes

- Ink simulation runs at 0.5x resolution for performance
- Three.js instances are disposed on unmount
- Lenis smooth scroll with 0.1 lerp for fluid feel
- All scroll listeners use `{ passive: true }`

## License

Proprietary — Built for Certified Translations.
