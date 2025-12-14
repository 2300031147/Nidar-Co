import { useEffect, useState } from 'react';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      title: 'AUTONOMOUS FLIGHT',
      description: 'Plan and execute complex autonomous missions with pre-defined waypoints and flight paths. Our system ensures safe and efficient drone operations.',
      icon: '🚁',
      color: 'bg-neo-yellow',
    },
    {
      title: 'REAL-TIME MONITORING',
      description: 'Track your drone\'s position, altitude, speed, battery, and other critical telemetry data in real-time with 1-second update intervals.',
      icon: '📡',
      color: 'bg-neo-pink',
    },
    {
      title: 'SURVEILLANCE OPERATIONS',
      description: 'Conduct comprehensive land surveillance with automated geofencing, camera control, and GPS-based area coverage for security and monitoring.',
      icon: '👁️',
      color: 'bg-neo-blue',
    },
    {
      title: 'MISSION PLANNING',
      description: 'Design detailed flight missions with our intuitive interface. Set waypoints, define geofences, configure camera angles, and optimize flight paths.',
      icon: '🗺️',
      color: 'bg-neo-green',
    },
    {
      title: 'MAVLINK INTEGRATION',
      description: 'Seamless integration with ArduPilot and QGroundControl via MAVProxy. Full compatibility with industry-standard protocols and tools.',
      icon: '🔗',
      color: 'bg-neo-orange',
    },
    {
      title: 'MISSION IMPORT/EXPORT',
      description: 'Import mission files in XML format and export your planned missions. Compatible with standard drone mission planning formats.',
      icon: '📤',
      color: 'bg-neo-purple',
    },
  ];

  return (
    <section className="min-h-[calc(100vh-88px)] bg-neo-black py-20 overflow-y-auto">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-6xl md:text-7xl font-black text-neo-white mb-4">
            SERVICES
          </h2>
          <div className="neo-border inline-block px-8 py-3 bg-neo-yellow shadow-brutal">
            <p className="text-xl font-bold text-neo-black">
              Comprehensive Drone Mission Solutions
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`neo-card ${service.color} transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-black text-neo-black mb-4">{service.title}</h3>
              <p className="text-neo-black text-lg leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className={`mt-20 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-4xl font-black text-neo-white text-center mb-12">HOW IT WORKS</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'CONNECT', desc: 'Link your drone via MAVProxy' },
              { step: '02', title: 'PLAN', desc: 'Design your mission with waypoints' },
              { step: '03', title: 'DEPLOY', desc: 'Upload mission to flight controller' },
              { step: '04', title: 'MONITOR', desc: 'Track real-time telemetry data' },
            ].map((item, index) => (
              <div
                key={item.step}
                className="neo-card bg-neo-white text-center"
                style={{ transitionDelay: `${700 + index * 100}ms` }}
              >
                <div className="text-5xl font-black text-neo-pink mb-3">{item.step}</div>
                <h4 className="text-2xl font-black text-neo-black mb-2">{item.title}</h4>
                <p className="text-neo-black font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
