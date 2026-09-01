import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProfileEligibility } from './pages/ProfileEligibility';
import { Recommendations } from './pages/Recommendations';
import { Calculator } from './pages/Calculator';
import { PartnerLocator } from './pages/PartnerLocator';
import { DocumentChecklist } from './pages/DocumentChecklist';
import { ApplicationTracker } from './pages/ApplicationTracker';
import { AiAssistant } from './components/AiAssistant';
import { Building2, Award, ShieldCheck, Heart } from 'lucide-react';

const MainContent = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-950 font-sans">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && <Home />}
        {activeTab === 'profile' && <ProfileEligibility />}
        {activeTab === 'recommendation' && <Recommendations />}
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'partners' && <PartnerLocator />}
        {activeTab === 'documents' && <DocumentChecklist />}
        {activeTab === 'tracking' && <ApplicationTracker />}
      </main>

      <AiAssistant />

      {/* GovTech Professional Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1 */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Award className="w-5 h-5 text-amber-400" />
                <span>UdyamSetu</span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                Connecting eligible citizens with the right government schemes, financial options, and channel partners. Empowering Scheduled Castes, OBCs, and marginalized entrepreneurs across India with intelligent credit scheme matching, transparent financial calculations, and direct Channel Partner routing.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">
                Smart India Hackathon 2026 • Problem Statement ID: SIH26092
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Apex Corporations</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• NSFDC (National SC Finance & Dev Corp)</li>
                <li>• NBCFDC (Backward Classes Finance Corp)</li>
                <li>• NSKFDC (Safai Karamcharis Finance Corp)</li>
                <li>• State Channelizing Agencies (SCAs)</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Navigation</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <button onClick={() => setActiveTab('home')} className="text-left text-slate-400 hover:text-white cursor-pointer">Home</button>
                <button onClick={() => setActiveTab('profile')} className="text-left text-slate-400 hover:text-white cursor-pointer">Eligibility</button>
                <button onClick={() => setActiveTab('calculator')} className="text-left text-slate-400 hover:text-white cursor-pointer">EMI Calculator</button>
                <button onClick={() => setActiveTab('partners')} className="text-left text-slate-400 hover:text-white cursor-pointer">Partner Map</button>
                <button onClick={() => setActiveTab('documents')} className="text-left text-slate-400 hover:text-white cursor-pointer">Checklist</button>
                <button onClick={() => setActiveTab('tracking')} className="text-left text-slate-400 hover:text-white cursor-pointer">Tracking</button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 UdyamSetu — AI-Powered Scheme Matching & Financial Access Platform. SIH 2026 Prototype.
            </div>
            <div className="flex items-center gap-2">
              <span>Smart Automation Theme</span>
              <span>•</span>
              <span>GovTech Software Solution</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
