import React, { useState, useEffect } from 'react';
import { Printer, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80' : 'bg-transparent'
    } backdrop-blur-md border-b border-white/5`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Printer size={24} className="text-purple-400" />
            <h1 className="text-2xl font-light text-white">
              Print<span className="font-normal bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">Master</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Products</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Services</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors font-light">Support</a>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-black/90 backdrop-blur-lg border-b border-white/5">
          <div className="px-4 py-4 space-y-4">
            <a href="#" className="block text-gray-400 hover:text-white transition-colors font-light">Products</a>
            <a href="#" className="block text-gray-400 hover:text-white transition-colors font-light">Services</a>
            <a href="#" className="block text-gray-400 hover:text-white transition-colors font-light">Support</a>
          </div>
        </div>
      )}
    </nav>
  );
}