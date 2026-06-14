import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-black/10 dark:border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="text-2xl font-bold tracking-widest uppercase text-black dark:text-white">
            Nomad
          </Link>
          <p className="text-black/60 dark:text-white/60 text-sm max-w-xs text-center md:text-left">
            A cinematic journey through the world's most breathtaking landscapes and unseen corners.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white">
            <Youtube className="w-5 h-5" />
          </a>
          <a href="#" className="p-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white">
            <Mail className="w-5 h-5" />
          </a>
        </div>

      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-black/10 dark:border-white/10 text-center">
        <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Nomad Travel Stories. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
