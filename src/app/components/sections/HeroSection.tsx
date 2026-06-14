import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { destinations } from '../../data';
import { ChevronRight, MapPin } from 'lucide-react';
import { Link } from 'react-router';

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 forward, -1 backward

  // Autoplay or manual swipe could be added here.
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % destinations.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const activeDestination = destinations[activeIndex];

  return (
    <section className="relative w-full min-h-screen md:h-screen overflow-hidden bg-black flex items-center md:items-end pt-28 pb-16 md:py-0 md:pb-24 justify-center">
      {/* Background Images with crossfade */}
      <AnimatePresence initial={false}>
        <motion.img
          key={activeIndex}
          src={activeDestination.image}
          alt={activeDestination.name}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </AnimatePresence>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col md:flex-row justify-between items-stretch md:items-end gap-10 md:gap-12 mt-auto">
        {/* Text Info */}
        <div className="flex-1 max-w-xl">
          <motion.div
            key={activeDestination.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium tracking-widest uppercase">{activeDestination.location}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              {activeDestination.name}
            </h1>
            <Link to={`/story/${activeDestination.id}`} className="inline-flex items-center gap-2 text-white/90 hover:text-white mt-4 border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full w-fit hover:bg-white/20 transition-all">
              <span className="font-medium">Explore Journey</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Card Slider */}
        <div className="flex gap-4 md:w-auto w-full overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide shrink-0">
          {destinations.map((dest, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={dest.id}
                onClick={() => handleCardClick(idx)}
                layout
                className={`relative rounded-2xl overflow-hidden shrink-0 transition-all duration-500 snap-center cursor-pointer ${
                  isActive ? "w-48 h-64 md:w-56 md:h-80 shadow-2xl shadow-black/50 ring-2 ring-white/50" : "w-32 h-48 md:w-40 md:h-64 opacity-50 hover:opacity-80 scale-95"
                }`}
              >
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  {isActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <p className="text-white font-semibold text-lg leading-tight">{dest.name}</p>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
