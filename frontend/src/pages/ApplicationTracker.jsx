import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar, 
  FileText, 
  User, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';

export const ApplicationTracker = () => {
  const { 
    trackAppId, 
    setTrackAppId, 
    trackingData, 
    fetchTracking, 
    t 
  } = useApp();

  const [inputAppId, setInputAppId] = useState(trackAppId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputAppId.trim()) {
      setTrackAppId(inputAppId.trim());
      fetchTracking(inputAppId.trim());
    }
  };

  const handleQuickApp = (id) => {
    setInputAppId(id);
    setTrackAppId(id);
    fetchTracking(id);
  };

  useEffect(() => {
    if (!trackingData) {
      fetchTracking(trackAppId);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6 text-blue-800" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.tracker.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.tracker.subtitle}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={inputAppId}
              onChange={(e) => setInputAppId(e.target.value)}
              placeholder="e.g. SIH-2026-MOSJE-8821"
              className="w-full text-xs font-mono font-bold pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow cursor-pointer"
          >
            {t.tracker.btnSearch}
          </button>
        </form>

        {/* Quick Sample IDs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500 font-bold">Try Sample Applications:</span>
          <button
            type="button"
            onClick={() => handleQuickApp('SIH-2026-MOSJE-8821')}
            className="text-[11px] font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded hover:bg-blue-100 cursor-pointer"
          >
            SIH-2026-MOSJE-8821 (Under Processing)
          </button>
          <button
            type="button"
            onClick={() => handleQuickApp('SIH-2026-MOSJE-9042')}
            className="text-[11px] font-mono bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded hover:bg-emerald-100 cursor-pointer"
          >
            SIH-2026-MOSJE-9042 (Sanctioned)
          </button>
        </div>
      </div>

      {trackingData && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Reference</span>
                <h2 className="text-xl font-extrabold text-blue-900 font-mono mt-0.5">
                  {trackingData.application_id}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Status:</span>
                <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 border border-blue-300 text-xs font-extrabold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  {trackingData.current_status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500">{t.tracker.applicant}</span>
                <p className="font-bold text-slate-900">{trackingData.applicant_name}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500">{t.tracker.scheme}</span>
                <p className="font-bold text-slate-900 truncate" title={trackingData.scheme_name}>
                  {trackingData.scheme_name}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500">{t.tracker.channelPartner}</span>
                <p className="font-bold text-slate-900 truncate" title={trackingData.channel_partner_name}>
                  {trackingData.channel_partner_name}
                </p>
              </div>
            </div>

            {/* 5-Stage Visual Journey Progress */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t.tracker.stageJourney}
              </h3>

              <div className="relative pl-6 sm:pl-0 space-y-6 sm:space-y-0 sm:grid sm:grid-cols-5 gap-2">
                {trackingData.stages.map((stage, idx) => {
                  const isCompleted = stage.status === 'Completed';
                  const isInProgress = stage.status === 'In Progress';
                  const isPending = stage.status === 'Pending';

                  return (
                    <div key={stage.stage_number} className="relative sm:text-center space-y-2">
                      {/* Step Indicator Dot */}
                      <div className="flex items-center sm:justify-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white shadow-md'
                              : isInProgress
                              ? 'bg-blue-900 text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isCompleted ? '✓' : stage.stage_number}
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className={`text-xs font-bold ${isInProgress ? 'text-blue-900' : 'text-slate-800'}`}>
                          {stage.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug hidden sm:block">
                          {stage.description}
                        </p>
                        <span
                          className={`text-[9px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800'
                              : isInProgress
                              ? 'bg-blue-50 text-blue-900'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {stage.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Remarks */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-bold text-blue-900 block">
                {t.tracker.remarks}:
              </span>
              <p className="text-xs text-blue-950 leading-relaxed">
                {trackingData.remarks}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
