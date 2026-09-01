import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Calculator, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  FileCheck2, 
  CheckCircle2, 
  HelpCircle,
  Building,
  TrendingUp,
  Landmark,
  Sparkles
} from 'lucide-react';

export const Home = () => {
  const { setActiveTab, t, triggerJudgeDemo } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Official GovTech Aesthetic */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-900/80 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-inner">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Smart India Hackathon 2026 • Problem ID: SIH26092</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.home.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            {t.home.description}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3.5 pt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              {t.home.btnCheck}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('recommendation')}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold px-5 py-3 rounded-xl shadow transition-all text-sm cursor-pointer"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              {t.home.btnSchemes}
            </button>

            <button
              onClick={() => setActiveTab('partners')}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold px-5 py-3 rounded-xl shadow transition-all text-sm cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              {t.home.btnPartners}
            </button>
          </div>

          {/* 1-Click Judge Presentation Shortcut Banner */}
          <div className="pt-2">
            <button
              onClick={triggerJudgeDemo}
              className="inline-flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>SIH Evaluators: Click to run <strong>5-Minute Demo Flow</strong> (SC Dairy Beneficiary)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-800 mb-2">
            {t.home.tagline}
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.home.featuresTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Scheme Recommender */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-blue-800" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                {t.home.feat1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.home.feat1Desc}
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-blue-800 group-hover:translate-x-1 transition-transform">
              <span>Test Eligibility Engine</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 2: Financial Calculator */}
          <div 
            onClick={() => setActiveTab('calculator')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-6 h-6 text-amber-800" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                {t.home.feat2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.home.feat2Desc}
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
              <span>Calculate Loan EMI</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 3: Geo-Spatial Partner Locator */}
          <div 
            onClick={() => setActiveTab('partners')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6 text-emerald-800" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                {t.home.feat3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.home.feat3Desc}
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
              <span>Open Leaflet Map</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured MoSJE Schemes Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                UdyamSetu — Concessional Credit Schemes
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Apex Corporation Supported Credit Avenues
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('recommendation')}
              className="text-xs font-bold text-blue-300 hover:text-blue-200 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Scheme Parameters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scheme 1 */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700">
                  NSFDC-MFS-01
                </span>
                <span className="text-amber-400 text-xs font-bold">4.0% p.a.</span>
              </div>
              <h3 className="font-bold text-white text-base">Micro Finance Scheme</h3>
              <p className="text-xs text-slate-300">
                Tailored for small income-generating micro-units like dairy, grocery shops, and artisan trades up to ₹2 Lakhs.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700 flex justify-between">
                <span>Max Funding: <strong>95%</strong></span>
                <span>Tenure: <strong>36 Mos</strong></span>
              </div>
            </div>

            {/* Scheme 2 */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-700">
                  NSFDC-TLS-02
                </span>
                <span className="text-amber-400 text-xs font-bold">6.5% p.a.</span>
              </div>
              <h3 className="font-bold text-white text-base">Term Loan Scheme</h3>
              <p className="text-xs text-slate-300">
                Financing for scalable commercial, manufacturing, transport, and service enterprises up to ₹20 Lakhs.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700 flex justify-between">
                <span>Max Funding: <strong>90%</strong></span>
                <span>Tenure: <strong>Up to 10 Yrs</strong></span>
              </div>
            </div>

            {/* Scheme 3 */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-700">
                  NSFDC-ELS-03
                </span>
                <span className="text-amber-400 text-xs font-bold">4.0% p.a.</span>
              </div>
              <h3 className="font-bold text-white text-base">Educational Loan Scheme</h3>
              <p className="text-xs text-slate-300">
                Concessional credit for technical & professional higher education in India (up to ₹10L) and abroad (up to ₹20L).
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700 flex justify-between">
                <span>Moratorium: <strong>Course + 1 Yr</strong></span>
                <span>Tenure: <strong>Up to 10 Yrs</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Prototype Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
          <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900">
            <p className="font-bold">{t.home.disclaimer}</p>
            <p className="text-amber-800 leading-relaxed">
              This digital platform demonstrates deterministic eligibility rule evaluation, exact mathematical financial calculations, Leaflet OpenStreetMap geo-routing, and RAG AI assistance. Final loan approval is exclusively granted following physical document appraisal by authorized State Channelizing Agencies (SCAs) and Public Sector Banks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
