import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="h-[calc(100vh-88px)] flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #9370DB, #FF1493, #FF8C00)' }}>
      <div className="container mx-auto px-4 py-20">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-neo-white mb-4 text-stroke">
              DRONE
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-neo-yellow mb-4 text-stroke -mt-8">
              MISSION
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-neo-green text-stroke -mt-8">
              CONTROL
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <p className="text-2xl md:text-3xl text-neo-white font-bold neo-border inline-block px-8 py-4 bg-neo-black shadow-brutal-lg">
              Advanced Autonomous Surveillance Platform
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/about"
              className="neo-border px-10 py-5 bg-neo-yellow text-neo-black text-xl font-black hover:bg-neo-green hover:-translate-y-2 shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
            >
              LEARN MORE
            </Link>
            <Link
              to="/dashboard"
              className="neo-border px-10 py-5 bg-neo-blue text-neo-black text-xl font-black hover:bg-neo-pink hover:-translate-y-2 shadow-brutal hover:shadow-brutal-lg transition-all duration-300"
            >
              LAUNCH DASHBOARD
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-16 flex flex-wrap gap-4 justify-center">
            {['Real-time Telemetry', 'Autonomous Flight', 'Mission Planning', 'MAVLink Integration'].map((feature, index) => (
              <div
                key={feature}
                className={`neo-border px-6 py-3 bg-neo-white shadow-brutal-sm transform transition-all duration-500 delay-${index * 100}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-neo-black font-bold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
