import { useEffect, useRef, useState } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="min-h-screen bg-neo-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-6xl md:text-7xl font-black text-neo-black mb-4">
            ABOUT US
          </h2>
          <div className="neo-border inline-block px-8 py-3 bg-neo-yellow shadow-brutal">
            <p className="text-xl font-bold text-neo-black">
              Pioneering the Future of Autonomous Drone Operations
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Company Info */}
          <div className={`neo-card bg-neo-blue transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-3xl font-black text-neo-black mb-4">WHO WE ARE</h3>
            <p className="text-lg text-neo-black leading-relaxed mb-4">
              Nidar Co is a cutting-edge technology company specializing in autonomous drone mission planning and real-time surveillance systems. We bridge the gap between advanced flight controllers and intuitive web interfaces.
            </p>
            <p className="text-lg text-neo-black leading-relaxed">
              Our platform integrates seamlessly with industry-standard mission planners like ArduPilot and QGroundControl, providing operators with unprecedented control and visibility.
            </p>
          </div>

          {/* Mission */}
          <div className={`neo-card bg-neo-pink transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="text-3xl font-black text-neo-black mb-4">OUR MISSION</h3>
            <p className="text-lg text-neo-black leading-relaxed mb-4">
              To democratize autonomous drone operations by providing powerful, user-friendly tools that enable anyone to plan, execute, and monitor complex surveillance missions.
            </p>
            <p className="text-lg text-neo-black leading-relaxed">
              We believe in making advanced drone technology accessible while maintaining the highest standards of safety and reliability.
            </p>
          </div>
        </div>

        {/* Features/Capabilities */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-4xl font-black text-neo-black text-center mb-12">KEY CAPABILITIES</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'MAVLink Protocol',
                description: 'Direct communication with flight controllers via MAVProxy',
                color: 'bg-neo-yellow',
              },
              {
                title: 'Mission Planning',
                description: 'Intuitive waypoint and geofence management',
                color: 'bg-neo-green',
              },
              {
                title: 'Real-time Data',
                description: '1-second telemetry updates for live monitoring',
                color: 'bg-neo-orange',
              },
              {
                title: 'XML Import',
                description: 'Upload and parse mission files seamlessly',
                color: 'bg-neo-purple',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`neo-card ${item.color} transform hover:scale-105`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h4 className="text-2xl font-black text-neo-black mb-3">{item.title}</h4>
                <p className="text-neo-black font-semibold">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className={`mt-16 neo-card bg-neo-white transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-3xl font-black text-neo-black text-center mb-8">TECHNOLOGY STACK</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {['React', 'Spring Boot', 'MySQL', 'Docker', 'MAVLink', 'WebSockets', 'ArduPilot', 'Tailwind CSS'].map((tech) => (
              <div key={tech} className="neo-border px-6 py-3 bg-neo-blue shadow-brutal-sm hover:shadow-brutal transition-all duration-300">
                <span className="text-neo-black font-black text-lg">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
