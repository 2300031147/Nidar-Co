import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Dashboard from './components/Dashboard';
import MultiDroneDashboard from './components/MultiDroneDashboard';
import GeofenceManager from './components/GeofenceManager';
import MissionReplay from './components/MissionReplay';

function App() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Dashboard />
      <MultiDroneDashboard />
      <GeofenceManager />
      <MissionReplay />
    </div>
  );
}

export default App;
