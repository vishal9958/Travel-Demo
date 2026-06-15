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

// Earth's axis tilt angle in radians (~8.5 degrees for aesthetic tilt)
const TILT = -0.15;

export function MapSection() {
  const [activeLocation, setActiveLocation] = useState(mapLocations[0].id);
  const [rotation, setRotation] = useState({ x: -0.1, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<typeof mapLocations[0] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });

  const textureRef = useRef<HTMLImageElement | null>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);

  const requestRef = useRef<number | null>(null);
  const rotationRef = useRef({ x: -0.1, y: 0 });
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

  // Load Earth texture
  useEffect(() => {
    const img = new Image();
    img.src = '/earth_satellite.png';
    img.onload = () => {
      textureRef.current = img;
      setTextureLoaded(true);
    };
  }, []);

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
        rotationRef.current.y += 0.0015; // Slow idle spin
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

    // 1. Atmosphere outer blue radial gradient glow
    const glow = ctx.createRadialGradient(cx, cy, R - 10, cx, cy, R + 35);
    glow.addColorStop(0, 'rgba(147, 197, 253, 0.28)'); // Soft blue glow
    glow.addColorStop(0.3, 'rgba(147, 197, 253, 0.15)');
    glow.addColorStop(0.7, 'rgba(56, 189, 248, 0.04)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R + 35, 0, 2 * Math.PI);
    ctx.fillStyle = glow;
    ctx.fill();

    // Save context to apply Earth's axis tilt
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(TILT);
    ctx.translate(-cx, -cy);

    // 2. Base Ocean Sphere Backup Fill (Realistic deep blue)
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fillStyle = '#102a43'; // Deep ocean backup color
    ctx.fill();

    // 3. Render Texture Slices for 3D Sphere mapping
    if (textureRef.current && textureLoaded) {
      const img = textureRef.current;
      const imgW = img.width;
      const imgH = img.height;

      const rot = (rotation.y / (2 * Math.PI)) % 1;
      const rotOffset = rot < 0 ? rot + 1 : rot;

      // Slice the globe horizontally into 1.5px tall segments
      const step = 1.5;
      for (let y = -R; y < R; y += step) {
        const dy = y / R;
        const r = R * Math.sqrt(1 - dy * dy); // Half-width of sphere slice
        
        if (r <= 0.5) continue;

        // Calculate source Y in flat map image
        const textureY = Math.floor(((dy + 1) / 2) * imgH);
        
        // Sphere shows 180 degrees of longitude (half map width)
        const visibleSrcWidth = imgW / 2;
        
        // Offset left coordinate based on rotation
        let srcX = (rotOffset - 0.25) * imgW;

        const destX = cx - r;
        const destY = cy + y;
        const destWidth = 2 * r;
        const destHeight = step + 0.5; // Overlay slightly to avoid scanlines

        // Handle horizontal wrap-around
        if (srcX < 0) {
          const firstPartSrcX = srcX + imgW;
          const firstPartSrcWidth = imgW - firstPartSrcX;
          const firstPartDestWidth = (firstPartSrcWidth / visibleSrcWidth) * destWidth;

          ctx.drawImage(
            img,
            firstPartSrcX, textureY, firstPartSrcWidth, 1,
            destX, destY, firstPartDestWidth, destHeight
          );

          ctx.drawImage(
            img,
            0, textureY, visibleSrcWidth - firstPartSrcWidth, 1,
            destX + firstPartDestWidth, destY, destWidth - firstPartDestWidth, destHeight
          );
        }
        else if (srcX + visibleSrcWidth > imgW) {
          const firstPartSrcWidth = imgW - srcX;
          const firstPartDestWidth = (firstPartSrcWidth / visibleSrcWidth) * destWidth;

          ctx.drawImage(
            img,
            srcX, textureY, firstPartSrcWidth, 1,
            destX, destY, firstPartDestWidth, destHeight
          );

          ctx.drawImage(
            img,
            0, textureY, visibleSrcWidth - firstPartSrcWidth, 1,
            destX + firstPartDestWidth, destY, destWidth - firstPartDestWidth, destHeight
          );
        }
        else {
          ctx.drawImage(
            img,
            srcX, textureY, visibleSrcWidth, 1,
            destX, destY, destWidth, destHeight
          );
        }
      }
    }

    // 4. Volumetric 3D Sphere Shadow (Dark side overlay)
    const shadowGlow = ctx.createRadialGradient(cx - R/4, cy - R/4, R * 0.75, cx, cy, R);
    shadowGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGlow.addColorStop(0.6, 'rgba(0, 0, 0, 0.45)');
    shadowGlow.addColorStop(1, 'rgba(10, 15, 30, 0.96)'); // Realistic planetary shadow
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fillStyle = shadowGlow;
    ctx.fill();

    // 5. Atmosphere glow overlay rim
    const rimGlow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R);
    rimGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rimGlow.addColorStop(0.8, 'rgba(147, 197, 253, 0.08)');
    rimGlow.addColorStop(1, 'rgba(147, 197, 253, 0.35)');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.fillStyle = rimGlow;
    ctx.fill();

    // Restore tilt transformation
    ctx.restore();

  }, [dimensions, rotation, textureLoaded]);

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

    // Rotate Y (yaw)
    const x1 = x0 * Math.cos(ry) - z0 * Math.sin(ry);
    const z1 = x0 * Math.sin(ry) + z0 * Math.cos(ry);
    const y1 = y0;

    // Rotate X (pitch)
    const x2 = x1;
    const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
    const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);

    // Get un-tilted coordinates
    const sx0 = cx + x2 * R;
    const sy0 = cy + y2 * R;

    // Apply 2D Tilt rotation to match canvas axis rotation
    const dx = sx0 - cx;
    const dy = sy0 - cy;
    const sx = cx + dx * Math.cos(TILT) - dy * Math.sin(TILT);
    const sy = cy + dx * Math.sin(TILT) + dy * Math.cos(TILT);

    return {
      ...loc,
      sx,
      sy,
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
            className="flex-1 min-h-[400px] sm:min-h-[480px] lg:h-full rounded-3xl relative overflow-hidden shadow-inner border border-black/5 dark:border-white/5 flex items-center justify-center bg-[#070b15]"
            style={{
              background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.8) 0%, #030712 100%)'
            }}
          >
            {/* Rotating 3D Canvas Globe */}
            <canvas 
              ref={canvasRef} 
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transform: isZoomed ? 'scale(3.2) rotate(12deg)' : 'scale(1) rotate(0deg)',
                filter: isZoomed ? 'blur(8px) contrast(1.15)' : 'none',
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
