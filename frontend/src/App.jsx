import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/multidrone" element={<MultiDroneDashboard />} />
            <Route path="/geofence" element={<GeofenceManager />} />
            <Route path="/replay" element={<MissionReplay />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
