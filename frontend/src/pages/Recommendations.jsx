import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  MapPin, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Info, 
  Building2,
  Clock,
  Percent,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';

export const Recommendations = () => {
  const { 
    recommendationResult, 
    userProfile, 
    setActiveTab, 
    setSelectedScheme, 
    setCalcParams, 
    executeCalculation,
    fetchDocuments,
    t 
  } = useApp();

  if (!recommendationResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-2xl mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Active Recommendation</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please complete your profile details and check your eligibility to receive tailored scheme recommendations.
        </p>
        <button
          onClick={() => setActiveTab('profile')}
          className="inline-flex items-center gap-2 bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow cursor-pointer"
        >
          <span>Go to Profile & Eligibility</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const { is_eligible, recommended_scheme, alternative_schemes, match_reasons, disqualification_reasons, ai_explanation, disclaimer } = recommendationResult;

  const handleSelectScheme = (scheme) => {
    setSelectedScheme(scheme);
    const newParams = {
      loan_amount: Math.round(Number(userProfile.estimated_project_cost || scheme.max_project_cost) * (scheme.max_loan_percentage / 100)),
      interest_rate_pct: scheme.interest_rate_pct,
      tenure_months: scheme.max_tenure_months,
      moratorium_months: scheme.moratorium_months_min
    };
    setCalcParams(newParams);
    executeCalculation(newParams);
    fetchDocuments(scheme.id);
  };

  const navigateToCalculator = (scheme) => {
    handleSelectScheme(scheme);
    setActiveTab('calculator');
  };

  const navigateToPartners = (scheme) => {
    handleSelectScheme(scheme);
    setActiveTab('partners');
  };

  const navigateToDocuments = (scheme) => {
    handleSelectScheme(scheme);
    setActiveTab('documents');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
            <Award className="w-6 h-6 text-blue-800" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.recommendation.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.recommendation.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Scheme Card (If Eligible) */}
      {is_eligible && recommended_scheme ? (
        <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-md overflow-hidden">
          {/* Top Recommendation Ribbon */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-3 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded shadow">
                {t.recommendation.badgeRecommended}
              </span>
              <span className="text-xs font-semibold text-blue-100">
                Code: {recommended_scheme.code}
              </span>
            </div>
            <span className="text-xs text-amber-300 font-semibold">
              {recommended_scheme.corporation}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Scheme Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {recommended_scheme.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {recommended_scheme.description}
              </p>
            </div>

            {/* AI Natural Language Justification Box */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>{t.recommendation.whyRecommended}</span>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed">
                {ai_explanation}
              </p>
            </div>

            {/* Key Scheme Parameters Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {t.recommendation.financialOverview}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">{t.recommendation.maxLoan}</span>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-0.5">
                    <span>Up to {recommended_scheme.max_loan_percentage}%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    (Max ₹{recommended_scheme.max_project_cost.toLocaleString('en-IN')})
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">{t.recommendation.interestRate}</span>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-700">
                    {recommended_scheme.interest_rate_pct}% p.a.
                  </div>
                  <span className="text-[10px] text-emerald-800 font-medium block">
                    (0.5% rebate for women)
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">{t.recommendation.tenure}</span>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {recommended_scheme.max_tenure_months} Months
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    ({(recommended_scheme.max_tenure_months / 12).toFixed(1)} Years)
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-semibold">{t.recommendation.moratorium}</span>
                  <div className="text-sm sm:text-base font-extrabold text-amber-700">
                    {recommended_scheme.moratorium_months_min} - {recommended_scheme.moratorium_months_max} Months
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Repayment Grace Period
                  </span>
                </div>
              </div>
            </div>

            {/* Rule Match Criteria Checklist */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.recommendation.criteriaMatch}
              </h3>
              <div className="space-y-2">
                {match_reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
              <button
                onClick={() => navigateToCalculator(recommended_scheme)}
                className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl shadow text-xs cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-300" />
                <span>{t.recommendation.btnCalc}</span>
              </button>

              <button
                onClick={() => navigateToPartners(recommended_scheme)}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow text-xs cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>{t.recommendation.btnPartner}</span>
              </button>

              <button
                onClick={() => navigateToDocuments(recommended_scheme)}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold px-5 py-3 rounded-xl text-xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>{t.recommendation.btnDocs}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Disqualification / No Match Card */
        <div className="bg-white rounded-2xl border-2 border-red-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-red-900">
                {t.recommendation.disqualifiedTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {ai_explanation}
              </p>
            </div>
          </div>

          <div className="bg-red-50/70 border border-red-200 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
              {t.recommendation.disqualifiedDesc}
            </h3>
            <ul className="space-y-2">
              {disqualification_reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-red-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0"></span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-start">
            <button
              onClick={() => setActiveTab('profile')}
              className="inline-flex items-center gap-2 bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow cursor-pointer"
            >
              <span>Modify Applicant Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Alternative Schemes (If Any) */}
      {alternative_schemes && alternative_schemes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-800" />
            <span>{t.recommendation.badgeAlternative}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternative_schemes.map((scheme) => (
              <div 
                key={scheme.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {scheme.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {scheme.name}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {scheme.interest_rate_pct}% p.a.
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {scheme.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                  <div>Max Project: <strong>₹{scheme.max_project_cost.toLocaleString('en-IN')}</strong></div>
                  <div>Tenure: <strong>{scheme.max_tenure_months} Mos</strong></div>
                </div>

                <button
                  onClick={() => navigateToCalculator(scheme)}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-blue-50 text-blue-900 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <span>Select & Calculate EMI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Disclaimer Footer */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {disclaimer}
        </p>
      </div>
    </div>
  );
};
