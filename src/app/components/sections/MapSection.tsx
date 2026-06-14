import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mapLocations } from '../../data';
import { MapPin, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

const geoCoords: Record<string, { lat: number; lng: number }> = {
  '1': { lat: 46, lng: 7 },     // Zermatt (Switzerland)
  '2': { lat: 35, lng: 139 },   // Shibuya (Japan)
  '3': { lat: -51, lng: -73 },  // Torres del Paine (Chile)
  '4': { lat: -8, lng: 115 }    // Ubud (Indonesia)
};

const locationDescriptions: Record<string, string> = {
  '1': "Discover the iconic Matterhorn, where crisp alpine air meets majestic glacier views. A peaceful winter paradise offering endless adventure in the heart of Europe.",
  '2': "Neon-lit streets, towering skyscrapers, and the electrifying rush of the world's busiest crossing. Experience the high-energy cyberpunk heart of midnight Tokyo.",
  '3': "Windswept peaks, turquoise lakes, and colossal glaciers at the edge of the world. A raw, wild wilderness that challenges and inspires the soul of every traveler.",
  '4': "Tropical rainforest canopy, serene emerald rice terraces, and ancient sacred water temples. A peaceful sanctuary of natural beauty, culture, and tranquility in Bali."
};

const continents = [
  // North America
  [
    { lat: 72, lng: -168 }, { lat: 70, lng: -120 }, { lat: 60, lng: -100 },
    { lat: 65, lng: -80 }, { lat: 70, lng: -60 }, { lat: 50, lng: -50 },
    { lat: 45, lng: -65 }, { lat: 25, lng: -80 }, { lat: 15, lng: -90 },
    { lat: 8, lng: -77 }, { lat: 10, lng: -85 }, { lat: 20, lng: -105 },
    { lat: 30, lng: -115 }, { lat: 33, lng: -120 }, { lat: 45, lng: -125 },
    { lat: 60, lng: -140 }, { lat: 65, lng: -168 }
  ],
  // South America
  [
    { lat: 12, lng: -72 }, { lat: 10, lng: -50 }, { lat: -5, lng: -35 },
    { lat: -10, lng: -38 }, { lat: -23, lng: -43 }, { lat: -45, lng: -63 },
    { lat: -55, lng: -68 }, { lat: -50, lng: -75 }, { lat: -40, lng: -73 },
    { lat: -20, lng: -70 }, { lat: -5, lng: -80 }, { lat: 5, lng: -75 }
  ],
  // Africa
  [
    { lat: 35, lng: -6 }, { lat: 37, lng: 11 }, { lat: 31, lng: 32 },
    { lat: 28, lng: 34 }, { lat: 15, lng: 40 }, { lat: 12, lng: 43 },
    { lat: 10, lng: 51 }, { lat: -5, lng: 39 }, { lat: -30, lng: 31 },
    { lat: -34, lng: 19 }, { lat: -30, lng: 14 }, { lat: -10, lng: 12 },
    { lat: 5, lng: 9 }, { lat: 5, lng: -10 }, { lat: 15, lng: -17 },
    { lat: 32, lng: -13 }
  ],
  // Eurasia
  [
    { lat: 71, lng: -10 }, { lat: 72, lng: 25 }, { lat: 77, lng: 60 },
    { lat: 73, lng: 80 }, { lat: 76, lng: 110 }, { lat: 72, lng: 140 },
    { lat: 70, lng: 170 }, { lat: 60, lng: 170 }, { lat: 52, lng: 143 },
    { lat: 40, lng: 140 }, { lat: 35, lng: 140 }, { lat: 30, lng: 121 },
    { lat: 22, lng: 115 }, { lat: 20, lng: 108 }, { lat: 10, lng: 107 },
    { lat: 5, lng: 100 }, { lat: 10, lng: 95 }, { lat: 15, lng: 80 },
    { lat: 22, lng: 68 }, { lat: 25, lng: 60 }, { lat: 12, lng: 44 },
    { lat: 30, lng: 32 }, { lat: 40, lng: 26 }, { lat: 41, lng: 15 },
    { lat: 43, lng: -9 }, { lat: 50, lng: -5 }, { lat: 60, lng: 5 }
  ],
  // India
  [
    { lat: 25, lng: 68 }, { lat: 24, lng: 75 }, { lat: 28, lng: 77 },
    { lat: 22, lng: 88 }, { lat: 16, lng: 82 }, { lat: 8, lng: 78 },
    { lat: 13, lng: 75 }, { lat: 20, lng: 73 }
  ],
  // Australia
  [
    { lat: -11, lng: 131 }, { lat: -10, lng: 136 }, { lat: -15, lng: 142 },
    { lat: -25, lng: 153 }, { lat: -38, lng: 148 }, { lat: -37, lng: 140 },
    { lat: -35, lng: 115 }, { lat: -22, lng: 114 }, { lat: -20, lng: 120 }
  ],
  // Greenland
  [
    { lat: 80, lng: -60 }, { lat: 83, lng: -30 }, { lat: 70, lng: -20 },
    { lat: 60, lng: -40 }, { lat: 65, lng: -55 }, { lat: 75, lng: -70 }
  ],
  // Japan
  [
    { lat: 45, lng: 142 }, { lat: 40, lng: 140 }, { lat: 35, lng: 135 },
    { lat: 31, lng: 130 }, { lat: 33, lng: 133 }, { lat: 38, lng: 138 }
  ],
  // United Kingdom
  [
    { lat: 58, lng: -6 }, { lat: 58, lng: -2 }, { lat: 55, lng: -2 },
    { lat: 50, lng: -5 }, { lat: 51, lng: 1 }, { lat: 54, lng: -1 }
  ]
];

// Rich vector map color scheme
const continentColors = [
  '#f25c54', // North America (Coral Orange)
  '#ffd166', // South America (Warm Yellow)
  '#dfb28e', // Africa (Sand Beige)
  '#81b29a', // Eurasia (Teal/Green)
  '#e76f51', // India (Terracotta Orange)
  '#ffd166', // Australia (Warm Yellow)
  '#f4f1de', // Greenland (Cream White)
  '#f25c54', // Japan (Coral Orange)
  '#ffd166'  // United Kingdom (Warm Yellow)
];

const continentStrokes = [
  '#d6453d', // North America
  '#e0b743', // South America
  '#c69c78', // Africa
  '#6a9981', // Eurasia
  '#c75a3c', // India
  '#e0b743', // Australia
  '#dbd8c5', // Greenland
  '#d6453d', // Japan
  '#e0b743'  // UK
];

export function MapSection() {
  const [activeLocation, setActiveLocation] = useState(mapLocations[0].id);
  const [rotation, setRotation] = useState({ x: -0.2, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<typeof mapLocations[0] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  const requestRef = useRef<number | null>(null);
  const rotationRef = useRef({ x: -0.2, y: 0 });
  const isAnimatingRef = useRef(true);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);

  // Static space background stars generator
  const starsRef = useRef<Array<{ x: number; y: number; size: number; opacity: number }>>([]);
  if (starsRef.current.length === 0) {
    for (let i = 0; i < 90; i++) {
      starsRef.current.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
  }

  // Resize listener
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const rect = entry.contentRect;
        const size = Math.max(320, Math.min(rect.width, rect.height || 500));
        setDimensions({
          width: size,
          height: size,
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Smooth rotation animation loop
  useEffect(() => {
    const animate = () => {
      if (isAnimatingRef.current) {
        rotationRef.current.y += 0.002; // Slow idle spin
        setRotation({ ...rotationRef.current });
      } else if (targetRotationRef.current) {
        const dx = targetRotationRef.current.x - rotationRef.current.x;
        const dy = targetRotationRef.current.y - rotationRef.current.y;
        
        const ease = 0.06; // Smooth easing
        rotationRef.current.x += dx * ease;
        rotationRef.current.y += dy * ease;

        setRotation({ ...rotationRef.current });

        if (Math.abs(dx) < 0.002 && Math.abs(dy) < 0.002) {
          targetRotationRef.current = null;
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Math transition to focus pin
  const rotateTo = (lat: number, lng: number) => {
    isAnimatingRef.current = false;
    const targetX = (-lat * Math.PI) / 180;
    const targetY = (-lng * Math.PI) / 180;

    const currentY = rotationRef.current.y;
    const twoPi = 2 * Math.PI;
    let diff = (targetY - currentY) % twoPi;
    if (diff < -Math.PI) diff += twoPi;
    if (diff > Math.PI) diff -= twoPi;

    targetRotationRef.current = {
      x: targetX,
      y: currentY + diff
    };
  };

  const handleLocationSelect = (id: string) => {
    setActiveLocation(id);
    const loc = mapLocations.find(l => l.id === id);
    if (loc) {
      const coords = geoCoords[id];
      if (coords) rotateTo(coords.lat, coords.lng);
    }
  };

  const handlePinClick = (loc: typeof mapLocations[0]) => {
    setActiveLocation(loc.id);
    const coords = geoCoords[loc.id];
    if (coords) {
      rotateTo(coords.lat, coords.lng);
      setSelectedLoc(loc);
      setTimeout(() => {
        setIsZoomed(true);
      }, 350); // Small delay for rotation to align first
    }
  };

  // Canvas render logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const w = dimensions.width;
    const h = dimensions.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.35;

    ctx.clearRect(0, 0, w, h);

    // Draw Space Stars Background onto Canvas
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x * w, star.y * h, star.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.55})`;
      ctx.fill();
    });

    // 1. Atmosphere radial gradient glow
    const glow = ctx.createRadialGradient(cx, cy, R - 10, cx, cy, R + 35);
    glow.addColorStop(0, 'rgba(81, 140, 175, 0.22)');
    glow.addColorStop(0.3, 'rgba(81, 140, 175, 0.12)');
    glow.addColorStop(0.7, 'rgba(36, 55, 70, 0.03)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R + 35, 0, 2 * Math.PI);
    ctx.fillStyle = glow;
    ctx.fill();

    // 2. Base Ocean Sphere Fill (Matching the exact slate blue background of the illustrative reference map)
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fillStyle = '#243746'; // Slate Blue Ocean from vector reference map
    ctx.fill();
    
    // Internal shadow/glow inside sphere to look 3D and volumetric
    const innerGlow = ctx.createRadialGradient(cx - R/4, cy - R/4, R * 0.75, cx, cy, R);
    innerGlow.addColorStop(0, 'rgba(0,0,0,0)');
    innerGlow.addColorStop(1, 'rgba(15, 23, 42, 0.35)'); // Soft dark edge shadow
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fillStyle = innerGlow;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const rx = rotation.x;
    const ry = rotation.y;

    // Projection calculation
    const project = (lat: number, lng: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = (lng * Math.PI) / 180;

      const x0 = Math.cos(phi) * Math.sin(theta);
      const y0 = -Math.sin(phi);
      const z0 = Math.cos(phi) * Math.cos(theta);

      // Rotate Y (yaw)
      const x1 = x0 * Math.cos(ry) - z0 * Math.sin(ry);
      const z1 = x0 * Math.sin(ry) + z0 * Math.cos(ry);
      const y1 = y0;

      // Rotate X (pitch)
      const x2 = x1;
      const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);

      return {
        x: cx + x2 * R,
        y: cy + y2 * R,
        z: z2
      };
    };

    // 3. Grid lines (Latitude Parallels) - Subtle on the ocean
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 0.5;

    const parallels = [-60, -30, 0, 30, 60];
    parallels.forEach((lat) => {
      ctx.beginPath();
      let first = true;
      for (let lng = -180; lng <= 180; lng += 5) {
        const pt = project(lat, lng);
        if (pt.z > 0) {
          if (first) {
            ctx.moveTo(pt.x, pt.y);
            first = false;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();
    });

    // 4. Draw continents in illustrative colors (smoothed with Bezier/quadratic curves)
    continents.forEach((poly, idx) => {
      const fillColor = continentColors[idx] || '#81b29a';
      const strokeColor = continentStrokes[idx] || '#6a9981';

      const projectedPoints = poly.map(p => project(p.lat, p.lng));
      let segments: Array<Array<{x: number; y: number}>> = [];
      let currentSegment: Array<{x: number; y: number}> = [];

      projectedPoints.forEach((pt) => {
        if (pt.z > 0) {
          currentSegment.push({ x: pt.x, y: pt.y });
        } else {
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = [];
          }
        }
      });
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      segments.forEach((seg) => {
        if (seg.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(seg[0].x, seg[0].y);
        
        for (let i = 0; i < seg.length - 1; i++) {
          const xc = (seg[i].x + seg[i + 1].x) / 2;
          const yc = (seg[i].y + seg[i + 1].y) / 2;
          ctx.quadraticCurveTo(seg[i].x, seg[i].y, xc, yc);
        }
        
        ctx.lineTo(seg[seg.length - 1].x, seg[seg.length - 1].y);
        ctx.closePath();
        
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    // 5. 3D Volumetric Sphere Shadow (Overlay layer on top of all land/ocean)
    const shadowGlow = ctx.createRadialGradient(cx - R/4, cy - R/4, R * 0.75, cx, cy, R);
    shadowGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGlow.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
    shadowGlow.addColorStop(1, 'rgba(18, 28, 36, 0.85)'); // Blends with outer background
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fillStyle = shadowGlow;
    ctx.fill();

    // 6. Atmosphere boundary stroke
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(81, 140, 175, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [dimensions, rotation]);

  // Project HTML Overlay Pins
  const rx = rotation.x;
  const ry = rotation.y;
  const w = dimensions.width;
  const h = dimensions.height;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.35;

  const pins = mapLocations.map((loc) => {
    const coords = geoCoords[loc.id];
    if (!coords) return null;

    const phi = (coords.lat * Math.PI) / 180;
    const theta = (coords.lng * Math.PI) / 180;

    const x0 = Math.cos(phi) * Math.sin(theta);
    const y0 = -Math.sin(phi);
    const z0 = Math.cos(phi) * Math.cos(theta);

    const x1 = x0 * Math.cos(ry) - z0 * Math.sin(ry);
    const z1 = x0 * Math.sin(ry) + z0 * Math.cos(ry);
    const y1 = y0;

    const x2 = x1;
    const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
    const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);

    return {
      ...loc,
      sx: cx + x2 * R,
      sy: cy + y2 * R,
      visible: z2 > 0
    };
  });

  return (
    <section id="map" className="py-24 bg-white dark:bg-black w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">Pin Drops</h2>
          <p className="text-black/60 dark:text-white/60 text-lg max-w-2xl">A geographical journal of my wanderings.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch h-auto lg:h-[600px]">
          
          {/* Location List */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto gap-4 pb-4 lg:pb-0 lg:pr-4 lg:w-80 shrink-0 scrollbar-hide snap-x snap-mandatory">
            {mapLocations.map((loc) => (
              <div 
                key={loc.id} 
                onClick={() => handleLocationSelect(loc.id)}
                className={`snap-center shrink-0 w-[260px] lg:w-full flex gap-4 p-3 lg:p-4 rounded-2xl cursor-pointer transition-all duration-300 items-center ${
                  activeLocation === loc.id 
                    ? 'bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/20' 
                    : 'bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 shadow-md">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-base lg:text-lg text-black dark:text-white">{loc.name}</h4>
                  <p className="text-xs lg:text-sm text-black/50 dark:text-white/50 uppercase tracking-wider">{loc.region}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Globe Canvas Container */}
          <div 
            ref={containerRef}
            className="flex-1 min-h-[400px] sm:min-h-[480px] lg:h-full rounded-3xl relative overflow-hidden shadow-inner border border-black/5 dark:border-white/5 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at center, rgba(81, 140, 175, 0.16) 0%, rgba(36, 55, 70, 0.12) 40%, #121c24 100%)'
            }}
          >
            {/* Rotating 3D Canvas Globe */}
            <canvas 
              ref={canvasRef} 
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transform: isZoomed ? 'scale(3.2) rotate(12deg)' : 'scale(1) rotate(0deg)',
                filter: isZoomed ? 'blur(8px) contrast(1.1)' : 'none',
                opacity: isZoomed ? 0 : 1,
                transition: 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className="z-0 pointer-events-none"
            />

            {/* Overlay Interactive Pins */}
            <div 
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transform: isZoomed ? 'scale(3.2) rotate(12deg)' : 'scale(1) rotate(0deg)',
                opacity: isZoomed ? 0 : 1,
                transition: 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className="absolute z-10 pointer-events-none"
            >
              {pins.map((pin) => {
                if (!pin || !pin.visible) return null;
                const isActive = activeLocation === pin.id;

                return (
                  <div
                    key={pin.id}
                    onClick={() => handlePinClick(pin)}
                    onMouseEnter={() => setActiveLocation(pin.id)}
                    style={{
                      left: `${pin.sx}px`,
                      top: `${pin.sy}px`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: isZoomed ? 'none' : 'auto'
                    }}
                    className="absolute z-10 cursor-pointer group/pin"
                  >
                    {/* Glowing Radar Pulse Wave */}
                    <span className={`absolute inset-0 w-8 h-8 -translate-x-[25%] -translate-y-[25%] rounded-full border-2 border-sky-400 dark:border-sky-300 animate-ping opacity-60 pointer-events-none duration-1000 ${
                      isActive ? 'scale-125' : 'scale-100'
                    }`} />
                    
                    {/* Secondary Inner Glow Ring */}
                    <span className="absolute inset-0 w-6 h-6 -translate-x-[12.5%] -translate-y-[12.5%] rounded-full bg-sky-400/20 dark:bg-sky-300/20 animate-pulse pointer-events-none" />

                    {/* Central Glow Dot */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shadow-md border-2 border-white dark:border-black ${
                      isActive 
                        ? 'bg-sky-500 scale-125' 
                        : 'bg-neutral-800 dark:bg-white group-hover/pin:bg-sky-400'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                    </div>
                    
                    {/* Tooltip & Name Tag (Floating label) */}
                    <div className={`absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-xl pointer-events-none ${
                      isActive 
                        ? 'bg-black/95 dark:bg-white/95 text-white dark:text-black border-white/20 dark:border-black/10 scale-100 translate-x-0 opacity-100' 
                        : 'bg-black/75 dark:bg-white/75 text-white/90 dark:text-black/90 border-white/10 dark:border-black/5 scale-90 -translate-x-2 opacity-0 group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:translate-x-0'
                    }`}>
                      <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400 dark:text-sky-600 font-bold' : 'text-white dark:text-black'}`} />
                      <span className="text-[11px] font-extrabold whitespace-nowrap uppercase tracking-wider">{pin.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zoomed Immersive Detail View */}
            <AnimatePresence>
              {isZoomed && selectedLoc && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 z-20 bg-black overflow-hidden flex flex-col justify-end p-6 md:p-10"
                >
                  {/* Slow panning high-res image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                      src={selectedLoc.image}
                      alt={selectedLoc.name}
                      initial={{ scale: 1.25, x: -25 }}
                      animate={{ scale: 1.05, x: 0 }}
                      exit={{ scale: 1.25, x: 25 }}
                      transition={{ duration: 16, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                      className="w-full h-full object-cover brightness-[0.45] saturate-[1.15]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
                  </div>

                  {/* Back Button */}
                  <div className="absolute top-6 left-6 z-30">
                    <button
                      onClick={() => {
                        setIsZoomed(false);
                        isAnimatingRef.current = true;
                      }}
                      className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg text-xs md:text-sm font-semibold uppercase tracking-wider hover:scale-105 active:scale-95 duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Globe</span>
                    </button>
                  </div>

                  {/* Glassmorphic Info Card */}
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                    className="relative z-30 max-w-xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-4 text-white self-start"
                  >
                    <div>
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-400/20">
                        {selectedLoc.region}
                      </span>
                      <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-white">
                        {selectedLoc.name}
                      </h3>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed text-sm md:text-base font-light">
                      {locationDescriptions[selectedLoc.id]}
                    </p>

                    <div className="w-full h-px bg-white/10 my-1" />

                    <Link
                      to={`/story/${selectedLoc.id}`}
                      className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold tracking-wider uppercase px-6 py-3 md:py-3.5 rounded-2xl w-full sm:w-fit transition-all shadow-lg hover:shadow-sky-500/20"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}
