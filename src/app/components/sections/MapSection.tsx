import { motion } from 'motion/react';
import { mapLocations } from '../../data';
import { useState } from 'react';
import { MapPin } from 'lucide-react';

export function MapSection() {
  const [activeLocation, setActiveLocation] = useState(mapLocations[0].id);

  return (
    <section id="map" className="py-24 bg-white dark:bg-black w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">Pin Drops</h2>
          <p className="text-black/60 dark:text-white/60 text-lg max-w-2xl">A geographical journal of my wanderings.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch h-[600px]">
          
          {/* Location List */}
          <div className="flex-1 overflow-y-auto pr-4 flex flex-col gap-4 scrollbar-hide">
            {mapLocations.map((loc) => (
              <div 
                key={loc.id} 
                onMouseEnter={() => setActiveLocation(loc.id)}
                className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 items-center ${
                  activeLocation === loc.id ? 'bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/20' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-md">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-black dark:text-white">{loc.name}</h4>
                  <p className="text-sm text-black/50 dark:text-white/50 uppercase tracking-wider">{loc.region}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Visual (Mock) */}
          <div className="flex-[2] bg-neutral-100 dark:bg-neutral-900 rounded-3xl relative overflow-hidden shadow-inner border border-black/5 dark:border-white/5 flex items-center justify-center">
            {/* Simple abstract dots representing a map structure */}
            <div className="absolute inset-0 opacity-20 dark:opacity-40" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* Map Markers */}
            {mapLocations.map((loc) => (
              <motion.div
                key={loc.id}
                className="absolute flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
                onMouseEnter={() => setActiveLocation(loc.id)}
                animate={{ 
                  scale: activeLocation === loc.id ? 1.2 : 1,
                  zIndex: activeLocation === loc.id ? 20 : 10
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md transition-colors ${
                  activeLocation === loc.id ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white/50 dark:bg-black/50 text-black dark:text-white border border-black/10 dark:border-white/10'
                }`}>
                  <MapPin className="w-5 h-5" />
                </div>
                
                {/* Tooltip */}
                {activeLocation === loc.id && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-12 whitespace-nowrap bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-2xl z-50 pointer-events-none"
                  >
                    {loc.name}, {loc.region}
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Simulated connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-black/20 dark:stroke-white/20" strokeWidth="2" fill="none" strokeDasharray="5,5">
              <path d={`M ${mapLocations[0].coords.x}% ${mapLocations[0].coords.y}% L ${mapLocations[1].coords.x}% ${mapLocations[1].coords.y}% L ${mapLocations[3].coords.x}% ${mapLocations[3].coords.y}% L ${mapLocations[2].coords.x}% ${mapLocations[2].coords.y}%`} />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
