import { Link } from 'react-router';
import { useTheme } from '../ThemeContext';
import { Moon, Sun, Menu, Camera } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/10 dark:bg-black/40 border-b border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Camera className="w-6 h-6 text-black dark:text-white group-hover:scale-110 transition-transform" />
          <span className="text-xl font-semibold tracking-wider text-black dark:text-white uppercase">Nomad</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">Home</Link>
          <Link to="/#stories" className="text-sm font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">Stories</Link>
          <Link to="/#gallery" className="text-sm font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">Gallery</Link>
          <Link to="/#map" className="text-sm font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">Map</Link>
          <Link to="/#about" className="text-sm font-medium text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors">About</Link>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-black dark:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 p-6 flex flex-col gap-6">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-black dark:text-white">Home</Link>
          <Link to="/#stories" onClick={() => setIsOpen(false)} className="text-lg font-medium text-black dark:text-white">Stories</Link>
          <Link to="/#gallery" onClick={() => setIsOpen(false)} className="text-lg font-medium text-black dark:text-white">Gallery</Link>
          <Link to="/#map" onClick={() => setIsOpen(false)} className="text-lg font-medium text-black dark:text-white">Map</Link>
          <Link to="/#about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-black dark:text-white">About</Link>
        </div>
      )}
    </nav>
  );
}
