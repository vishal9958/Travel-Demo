import { motion } from 'motion/react';
import { featuredStories } from '../../data';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

export function FeaturedStoriesSection() {
  return (
    <section id="stories" className="py-24 bg-neutral-50 dark:bg-neutral-950 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">Featured Journeys</h2>
          <p className="text-black/60 dark:text-white/60 text-lg max-w-2xl">Dive deep into the most breathtaking locations. Hand-picked stories full of adventures, tips, and mesmerizing photography.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredStories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/story/${story.id}`} className="block relative overflow-hidden rounded-3xl aspect-[4/3] md:aspect-[16/10] bg-black">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex justify-between items-end w-full">
                    <div>
                      <p className="text-white/70 text-sm tracking-widest uppercase mb-2 font-medium">{story.location}</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{story.title}</h3>
                      <p className="text-white/80 line-clamp-2 max-w-md">{story.excerpt}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white text-white group-hover:text-black transition-colors">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
