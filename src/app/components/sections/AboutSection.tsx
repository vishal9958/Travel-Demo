import { motion } from 'motion/react';
import { images } from '../../data';
import { Mail } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-neutral-50 dark:bg-neutral-950 w-full relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        
        <div className="relative aspect-[3/4] md:aspect-square w-full max-w-md mx-auto">
          <div className="absolute inset-4 border border-black/20 dark:border-white/20 translate-x-4 translate-y-4 rounded-3xl" />
          <img 
            src={images.profile} 
            alt="Traveler Profile" 
            className="w-full h-full object-cover rounded-3xl shadow-2xl grayscale-[30%] relative z-10"
          />
        </div>

        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black dark:text-white">
              The Storyteller
            </h2>
            <p className="text-xl text-black/60 dark:text-white/60 leading-relaxed font-light">
              I'm Alex. A cinematic visual storyteller traveling the globe to capture light, shadow, and the quiet moments between the chaos. 
            </p>
            <p className="text-lg text-black/80 dark:text-white/80 leading-relaxed">
              Every photograph is a portal. Every video is a memory suspended in time. My goal is to transport you to the edge of cliffs, the heart of neon cities, and the depths of ancient forests. Let's explore the unseen corners of the Earth together.
            </p>

            <div className="mt-8 flex gap-4 items-center">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-black dark:text-white">45+</span>
                <span className="text-sm tracking-widest uppercase text-black/50 dark:text-white/50">Countries</span>
              </div>
              <div className="w-px h-12 bg-black/20 dark:bg-white/20 mx-4" />
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-black dark:text-white">8</span>
                <span className="text-sm tracking-widest uppercase text-black/50 dark:text-white/50">Years</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter Integrated at bottom of about */}
      <div className="max-w-3xl mx-auto mt-32 px-6 text-center">
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-12 backdrop-blur-xl">
          <Mail className="w-12 h-12 mx-auto mb-6 text-black/50 dark:text-white/50" />
          <h3 className="text-3xl font-bold text-black dark:text-white mb-4">Join the Expedition</h3>
          <p className="text-black/60 dark:text-white/60 mb-8">Receive cinematic travel guides, behind-the-scenes stories, and editing tutorials.</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-black dark:text-white placeholder-black/40 dark:placeholder-white/40"
            />
            <button className="bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider uppercase px-8 py-4 rounded-full hover:bg-black/80 dark:hover:bg-white/80 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
