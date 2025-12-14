import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neo-yellow neo-border border-t-0 border-l-0 border-r-0 shadow-brutal-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-3xl font-bold text-neo-black cursor-pointer" onClick={() => scrollToSection('hero')}>
            <span className="neo-border px-4 py-2 bg-neo-pink shadow-brutal-sm hover:shadow-brutal transition-all duration-300">
              NIDAR.CO
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {['About', 'Services', 'Portfolio', 'Dashboard', 'Multi-Drone', 'Geofence', 'Replay'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace('-', ''))}
                className="neo-border px-6 py-2 bg-neo-blue text-neo-black font-bold hover:bg-neo-green hover:-translate-y-1 shadow-brutal-sm hover:shadow-brutal transition-all duration-300"
              >
                {item}
              </button>
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
            {['About', 'Services', 'Portfolio', 'Dashboard', 'Multi-Drone', 'Geofence', 'Replay'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace('-', ''))}
                className="w-full neo-border px-6 py-3 bg-neo-blue text-neo-black font-bold hover:bg-neo-green shadow-brutal-sm block"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
