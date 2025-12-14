import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Multi-Drone', path: '/multidrone' },
    { name: 'Geofence', path: '/geofence' },
    { name: 'Replay', path: '/replay' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-neo-yellow neo-border border-t-0 border-l-0 border-r-0 shadow-brutal-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-neo-black">
            <span className="neo-border px-4 py-2 bg-neo-pink shadow-brutal-sm hover:shadow-brutal transition-all duration-300">
              NIDAR.CO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`neo-border px-6 py-2 text-neo-black font-bold hover:bg-neo-green hover:-translate-y-1 shadow-brutal-sm hover:shadow-brutal transition-all duration-300 ${
                  isActive(item.path) ? 'bg-neo-green' : 'bg-neo-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden neo-border px-4 py-2 bg-neo-orange shadow-brutal-sm"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`bg-neo-black h-1 w-full transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`bg-neo-black h-1 w-full ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`bg-neo-black h-1 w-full transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`w-full neo-border px-6 py-3 text-neo-black font-bold hover:bg-neo-green shadow-brutal-sm block ${
                  isActive(item.path) ? 'bg-neo-green' : 'bg-neo-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
