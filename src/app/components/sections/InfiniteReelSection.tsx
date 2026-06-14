import { galleryImages } from '../../data';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export function InfiniteReelSection() {
  // Duplicate array to ensure smooth looping
  const duplicatedImages = [...galleryImages, ...galleryImages];

  return (
    <section className="py-32 bg-black w-full overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-4 group">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex gap-4 shrink-0"
        >
          {duplicatedImages.map((src, idx) => (
            <div 
              key={idx} 
              className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] shrink-0 rounded-2xl overflow-hidden relative cursor-pointer"
            >
              <img 
                src={src} 
                alt="Reel frame" 
                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
