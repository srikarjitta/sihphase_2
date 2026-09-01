import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Languages,
  Compass,
  Calculator,
  MapPin,
  FileText,
  Clock,
  Menu,
  X,
  ShieldCheck,
  Award
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Building2 },
    { id: 'profile', label: t.nav.eligibility, icon: ShieldCheck },
    { id: 'recommendation', label: t.nav.schemes, icon: Compass },
    { id: 'calculator', label: t.nav.calculator, icon: Calculator },
    { id: 'partners', label: t.nav.partners, icon: MapPin },
    { id: 'documents', label: t.nav.documents, icon: FileText },
    { id: 'tracking', label: t.nav.tracking, icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Tricolor Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Ministry Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-md border-2 border-amber-400">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base md:text-lg tracking-tight leading-tight flex items-center gap-2">
                <span>{t.nav.title}</span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  US
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t.nav.ministry}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? 'bg-blue-50 text-blue-900 border-b-2 border-blue-800 font-bold'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-800' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Language Selector & Login */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Languages className="w-4 h-4 text-slate-500 ml-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 pr-2 py-0.5 focus:outline-none cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Simple Beneficiary Login Modal Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {t.nav.login}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-100 text-xs font-bold text-slate-700 px-2 py-1 rounded border border-slate-300"
            >
              <option value="en">EN</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${isActive
                    ? 'bg-blue-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}

        </div>
      )}

      {/* Simple Prototype Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                Beneficiary Prototype Login
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600">
                For this SIH hackathon demonstration, you can log in using Aadhaar Mock OTP or proceed directly in Guest Demo Mode.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar Number (Simulated)</label>
                <input
                  type="text"
                  defaultValue="XXXX-XXXX-8821"
                  className="w-full text-xs p-2.5 rounded border border-slate-300 bg-slate-50 font-mono"
                />
              </div>
              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded text-xs text-blue-900">
                <strong>Demo Mode Active:</strong> All scheme matching and calculator features are fully accessible without registration.
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow cursor-pointer"
              >
                Continue as Verified Beneficiary
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
