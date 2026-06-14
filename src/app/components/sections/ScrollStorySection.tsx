import { motion } from 'motion/react';
import { featuredStories } from '../../data';

export function ScrollStorySection() {
  return (
    <section className="py-24 bg-white dark:bg-black w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 flex flex-col gap-32">
        {featuredStories.map((story, idx) => (
          <motion.div 
            key={story.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
          >
            <div className="flex-1 w-full aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden">
              <img 
                src={story.image} 
                alt={story.title}
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center max-w-lg">
              <span className="text-sm tracking-widest uppercase text-black/50 dark:text-white/50 mb-4">{story.location}</span>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-black dark:text-white leading-tight">
                {story.title}
              </h3>
              <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed mb-8">
                {story.excerpt} A journey that reveals the true scale of our world, pushing boundaries and finding serenity in the unknown.
              </p>
              
              <motion.button 
                whileHover={{ x: 10 }}
                className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase border-b-2 border-black dark:border-white pb-1 w-fit"
              >
                Read Chapter
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
