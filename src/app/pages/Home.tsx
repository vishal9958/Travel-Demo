import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedStoriesSection } from '../components/sections/FeaturedStoriesSection';
import { ScrollStorySection } from '../components/sections/ScrollStorySection';
import { BlogCarouselSection } from '../components/sections/BlogCarouselSection';
import { AnimatedGallerySection } from '../components/sections/AnimatedGallerySection';
import { InfiniteReelSection } from '../components/sections/InfiniteReelSection';
import { MapSection } from '../components/sections/MapSection';
import { AboutSection } from '../components/sections/AboutSection';

export function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedStoriesSection />
      <ScrollStorySection />
      <InfiniteReelSection />
      <BlogCarouselSection />
      <AnimatedGallerySection />
      <MapSection />
      <AboutSection />
    </>
  );
}
