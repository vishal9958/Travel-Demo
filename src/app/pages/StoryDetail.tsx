import { useParams, Link } from 'react-router';
import { storyDetail, featuredStories } from '../data';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { AnimatedGallerySection } from '../components/sections/AnimatedGallerySection';
import { useEffect } from 'react';

export function StoryDetail() {
  const { id } = useParams();
  
  // Simulated fetch based on ID - using mock data directly
  const story = storyDetail;
  const match = featuredStories.find(s => s.id === id);
  const heroImage = match ? match.image : story.heroVideo;

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!story) {
    return <div className="min-h-screen flex items-center justify-center text-white">Story not found.</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-950 text-black dark:text-white min-h-screen pb-24 relative z-0">
      
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt={story.title} 
            className="w-full h-[120vh] object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 z-10" />
        
        <div className="absolute top-24 left-6 md:left-12 z-20">
          <Link to="/#stories" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium tracking-widest uppercase">Back to Stories</span>
          </Link>
        </div>

        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 flex flex-col justify-end items-center text-center pb-32 px-6 z-20"
        >
          <div className="flex items-center gap-6 text-white/70 mb-6 text-sm font-medium tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{story.location}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{story.date}</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-tight">
            {story.title}
          </h1>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 py-24 relative z-30 bg-white dark:bg-neutral-950 -mt-10 rounded-t-[3rem] sm:rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Story Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {story.content.map((block, idx) => {
            if (block.type === 'paragraph') {
              return <p key={idx} className="text-xl leading-relaxed text-black/80 dark:text-white/80 font-light mb-8">{block.text}</p>;
            }
            if (block.type === 'day') {
              return (
                <div key={idx} className="mt-16 mb-8">
                  <h2 className="text-3xl font-bold mb-6 text-black dark:text-white tracking-tight">{block.title}</h2>
                  <p className="text-lg leading-relaxed text-black/70 dark:text-white/70">{block.text}</p>
                </div>
              );
            }
            if (block.type === 'image') {
              return (
                <figure key={idx} className="my-16 -mx-6 md:-mx-24 rounded-3xl overflow-hidden shadow-2xl">
                  <img src={block.url} alt="Story visual" className="w-full h-auto object-cover grayscale-[20%]" />
                </figure>
              );
            }
            return null;
          })}
        </div>

        {/* Budget Breakdown */}
        <div className="mt-24 bg-neutral-100 dark:bg-neutral-900 rounded-3xl p-8 md:p-12 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Budget Breakdown</h3>
          </div>
          <div className="space-y-4">
            {story.budget.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-4 border-b border-black/10 dark:border-white/10 last:border-0">
                <span className="text-black/80 dark:text-white/80 font-medium">{item.item}</span>
                <span className="text-black dark:text-white font-bold">{item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-neutral-50 dark:bg-black p-8 rounded-3xl border border-black/5 dark:border-white/5">
            <h4 className="flex items-center gap-2 text-xl font-bold text-black dark:text-white mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Highlights
            </h4>
            <ul className="space-y-4">
              {story.prosCons.pros.map((pro, idx) => (
                <li key={idx} className="text-black/70 dark:text-white/70 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-50 dark:bg-black p-8 rounded-3xl border border-black/5 dark:border-white/5">
            <h4 className="flex items-center gap-2 text-xl font-bold text-black dark:text-white mb-6">
              <XCircle className="w-6 h-6 text-red-500" />
              Challenges
            </h4>
            <ul className="space-y-4">
              {story.prosCons.cons.map((con, idx) => (
                <li key={idx} className="text-black/70 dark:text-white/70 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold mb-12 text-black dark:text-white text-center">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {story.faq.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-white/5">
                <h4 className="text-lg font-bold text-black dark:text-white mb-3">{faq.q}</h4>
                <p className="text-black/70 dark:text-white/70 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <AnimatedGallerySection />
    </div>
  );
}
