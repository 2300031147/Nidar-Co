import { useEffect, useRef, useState } from 'react';

const Portfolio = () => {
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

  const projects = [
    {
      title: 'BORDER SURVEILLANCE',
      description: 'Automated perimeter monitoring with 24/7 coverage. Deployed across 50km border area with real-time alerts.',
      stats: ['50km Coverage', '99.9% Uptime', '4 Drones'],
      color: 'bg-neo-yellow',
    },
    {
      title: 'AGRICULTURAL MAPPING',
      description: 'Precision agriculture monitoring with thermal imaging. Covered 1000+ acres with detailed crop health analysis.',
      stats: ['1000+ Acres', 'Thermal Imaging', '2 Week Project'],
      color: 'bg-neo-green',
    },
    {
      title: 'DISASTER RESPONSE',
      description: 'Emergency search and rescue operations. Rapid deployment for area assessment and survivor location.',
      stats: ['5 Missions', '100+ Hours', 'Lives Saved'],
      color: 'bg-neo-orange',
    },
    {
      title: 'INFRASTRUCTURE INSPECTION',
      description: 'Power line and pipeline monitoring. Automated defect detection with AI-powered image analysis.',
      stats: ['200km Inspected', 'AI Detection', '95% Accuracy'],
      color: 'bg-neo-blue',
    },
    {
      title: 'WILDLIFE MONITORING',
      description: 'Non-invasive wildlife tracking and habitat surveillance. Contributed to conservation research data.',
      stats: ['500+ Animals', '3 Months', '5 Species'],
      color: 'bg-neo-pink',
    },
    {
      title: 'URBAN PLANNING',
      description: '3D city mapping and traffic flow analysis. High-resolution aerial photography for city development.',
      stats: ['3 Cities', '4K Resolution', '1TB+ Data'],
      color: 'bg-neo-purple',
    },
  ];

  return (
    <section ref={sectionRef} id="portfolio" className="min-h-screen bg-neo-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-6xl md:text-7xl font-black text-neo-black mb-4">
            PORTFOLIO
          </h2>
          <div className="neo-border inline-block px-8 py-3 bg-neo-pink shadow-brutal">
            <p className="text-xl font-bold text-neo-black">
              Our Success Stories & Deployments
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`neo-card ${project.color} transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-2xl font-black text-neo-black mb-4">{project.title}</h3>
              <p className="text-neo-black text-lg leading-relaxed mb-6">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.stats.map((stat) => (
                  <div key={stat} className="neo-border px-3 py-1 bg-neo-white shadow-brutal-sm">
                    <span className="text-neo-black font-bold text-sm">{stat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`neo-card bg-neo-black transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-4xl font-black text-neo-white text-center mb-12">BY THE NUMBERS</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Missions Completed', color: 'bg-neo-yellow' },
              { number: '10K+', label: 'Flight Hours', color: 'bg-neo-green' },
              { number: '50+', label: 'Happy Clients', color: 'bg-neo-blue' },
              { number: '99.8%', label: 'Success Rate', color: 'bg-neo-pink' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`neo-border p-6 ${stat.color} shadow-brutal text-center`}
                style={{ transitionDelay: `${700 + index * 100}ms` }}
              >
                <div className="text-5xl font-black text-neo-black mb-2">{stat.number}</div>
                <div className="text-lg font-bold text-neo-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className={`mt-12 neo-card bg-neo-orange transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <p className="text-2xl text-neo-black font-bold italic mb-4">
              "Nidar Co's platform revolutionized our surveillance operations. The real-time telemetry and intuitive mission planning saved us countless hours."
            </p>
            <div className="neo-border inline-block px-6 py-2 bg-neo-white shadow-brutal-sm">
              <p className="text-neo-black font-black">— Security Operations Director</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
