import { featuredStories } from '../../data';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router';

export function BlogCarouselSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);
  const dragDistance = useRef(0);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = dir === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftVal.current = scrollRef.current.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag speed multiplier
    dragDistance.current = Math.abs(walk);
    scrollRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (dragDistance.current > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-black w-full">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">Recent Entries</h2>
            <p className="text-black/60 dark:text-white/60 text-lg">Short dispatches from the road.</p>
          </div>
        </div>

        {/* Carousel Wrapper with hover group */}
        <div className="relative group/carousel">
          {/* Left Overlay Button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-[112px] md:top-[150px] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/85 dark:bg-black/85 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg text-black dark:text-white hidden md:flex md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 cursor-grab active:cursor-grabbing select-none"
          >
            {featuredStories.map((story) => (
              <Link 
                to={`/story/${story.id}`}
                key={story.id} 
                onClick={handleClick}
                className="snap-start w-[300px] md:w-[400px] shrink-0 group flex flex-col gap-6"
              >
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black relative pointer-events-none">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>
                <div className="pointer-events-none">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-black/50 dark:text-white/50 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>5 Min Read</span>
                    <span className="mx-2">•</span>
                    <span>{story.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2 leading-snug group-hover:text-black/70 dark:group-hover:text-white/70 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-black/60 dark:text-white/60 line-clamp-2 leading-relaxed">
                    {story.excerpt} A deeper look into what makes this destination unforgettable.
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Overlay Button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-[112px] md:top-[150px] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/85 dark:bg-black/85 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg text-black dark:text-white hidden md:flex md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  );
}


