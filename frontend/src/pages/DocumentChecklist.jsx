import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  UploadCloud, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const DocumentChecklist = () => {
  const { 
    documentsState, 
    docProgress, 
    handleUploadDocument, 
    selectedScheme, 
    setActiveTab, 
    t 
  } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.documents.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.documents.schemeFor} <strong>{selectedScheme ? selectedScheme.name : "Micro Finance Scheme"}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tracking')}
            className="inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow cursor-pointer"
          >
            <span>Proceed to Application Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Readiness Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700">{t.documents.readiness}</span>
            <span className="text-blue-900 font-mono text-sm">{docProgress}% Complete</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              style={{ width: `${docProgress}%` }}
              className="h-full bg-gradient-to-r from-blue-700 to-emerald-600 transition-all duration-300 rounded-full"
            ></div>
          </div>
        </div>
      </div>

      {/* Document Items List */}
      <div className="space-y-4">
        {documentsState.map((doc) => {
          const isVerified = doc.status === 'Verified';
          const isUploaded = doc.status === 'Uploaded';
          const isPending = doc.status === 'Not Uploaded';

          return (
            <div
              key={doc.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                isVerified
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : isUploaded
                  ? 'bg-blue-50/40 border-blue-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {doc.title}
                    </h3>
                    {doc.mandatory && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="shrink-0">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      {t.documents.statusVerified}
                    </span>
                  ) : isUploaded ? (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-blue-700" />
                      {t.documents.statusUploaded}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-300 text-xs font-medium px-3 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                      {t.documents.statusPending}
                    </span>
                  )}
                </div>
              </div>

              {/* Upload & Verification Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3 text-xs">
                <div>
                  {doc.verification_notes && (
                    <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      {doc.verification_notes}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => handleUploadDocument(doc.id)}
                      className="inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{t.documents.btnUpload}</span>
                    </button>
                  )}
                  {isUploaded && (
                    <span className="text-[11px] text-blue-800 font-medium">
                      ✓ Scanned copy attached
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Prototype Notice: Digital document uploads are simulated for evaluation. During formal application processing, original certificates will be verified physically at the designated Channel Partner or authenticated via DigiLocker.
        </p>
      </div>
    </div>
  );
};
