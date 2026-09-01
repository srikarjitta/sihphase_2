import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calculator as CalcIcon, 
  IndianRupee, 
  Percent, 
  Clock, 
  Calendar, 
  HelpCircle, 
  ArrowRight,
  TrendingDown,
  PieChart,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const Calculator = () => {
  const { calcParams, setCalcParams, calcResult, isCalculating, executeCalculation, setActiveTab, t } = useApp();
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Live recalculation on change
  const handleChange = (field, value) => {
    const updated = {
      ...calcParams,
      [field]: Number(value)
    };
    setCalcParams(updated);
    executeCalculation(updated);
  };

  useEffect(() => {
    if (!calcResult) {
      executeCalculation();
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <CalcIcon className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t.calculator.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.calculator.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Inputs (Sliders & Numbers) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Loan & Repayment Parameters
          </h2>

          {/* 1. Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">{t.calculator.loanAmount}</label>
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 font-mono font-bold text-blue-900">
                <span>₹</span>
                <input
                  type="number"
                  value={calcParams.loan_amount}
                  onChange={(e) => handleChange('loan_amount', e.target.value)}
                  min="10000"
                  max="2000000"
                  step="5000"
                  className="w-24 bg-transparent text-right focus:outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="5000"
              value={calcParams.loan_amount}
              onChange={(e) => handleChange('loan_amount', e.target.value)}
              className="w-full accent-blue-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹10,000</span>
              <span>₹10,00,000</span>
              <span>₹20,00,000</span>
            </div>
          </div>

          {/* 2. Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">{t.calculator.interestRate}</label>
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 font-mono font-bold text-emerald-800">
                <input
                  type="number"
                  value={calcParams.interest_rate_pct}
                  onChange={(e) => handleChange('interest_rate_pct', e.target.value)}
                  min="2"
                  max="18"
                  step="0.1"
                  className="w-14 bg-transparent text-right focus:outline-none"
                />
                <span>%</span>
              </div>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={calcParams.interest_rate_pct}
              onChange={(e) => handleChange('interest_rate_pct', e.target.value)}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>3.5% (Women Concession)</span>
              <span>4.0% (Micro Finance)</span>
              <span>6.5% (Term Loan)</span>
            </div>
          </div>

          {/* 3. Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">{t.calculator.tenure}</label>
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 font-mono font-bold text-slate-900">
                <input
                  type="number"
                  value={calcParams.tenure_months}
                  onChange={(e) => handleChange('tenure_months', e.target.value)}
                  min="6"
                  max="120"
                  step="6"
                  className="w-14 bg-transparent text-right focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-sans">Mos ({(calcParams.tenure_months / 12).toFixed(1)} Yrs)</span>
              </div>
            </div>
            <input
              type="range"
              min="6"
              max="120"
              step="6"
              value={calcParams.tenure_months}
              onChange={(e) => handleChange('tenure_months', e.target.value)}
              className="w-full accent-blue-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>12 Months</span>
              <span>36 Months (3 Yrs)</span>
              <span>120 Months (10 Yrs)</span>
            </div>
          </div>

          {/* 4. Moratorium Period */}
          <div className="space-y-2 bg-amber-50/70 p-4 rounded-xl border border-amber-200">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>{t.calculator.moratorium}</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-amber-300 font-mono font-bold text-amber-900">
                <input
                  type="number"
                  value={calcParams.moratorium_months}
                  onChange={(e) => handleChange('moratorium_months', e.target.value)}
                  min="0"
                  max="48"
                  step="1"
                  className="w-10 bg-transparent text-right focus:outline-none"
                />
                <span className="text-[11px] text-amber-700 font-sans">Months</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="1"
              value={calcParams.moratorium_months}
              onChange={(e) => handleChange('moratorium_months', e.target.value)}
              className="w-full accent-amber-600 h-2 bg-amber-200 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-amber-800">
              💡 {t.calculator.moratoriumHelp} (Only interest serviced; ₹0 principal payment).
            </p>
          </div>
        </div>

        {/* Right Column: Calculated Results & Visual Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Result Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {t.calculator.estimatedEmi}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  ₹{calcResult ? calcResult.effective_emi.toLocaleString('en-IN') : '...'}
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 font-mono">
                Estimated Indicative
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400">{t.calculator.totalInterest}</span>
                <div className="text-base sm:text-lg font-bold text-amber-400">
                  ₹{calcResult ? calcResult.total_interest.toLocaleString('en-IN') : '...'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">{t.calculator.totalRepayment}</span>
                <div className="text-base sm:text-lg font-bold text-emerald-400">
                  ₹{calcResult ? calcResult.total_repayment.toLocaleString('en-IN') : '...'}
                </div>
              </div>
            </div>

            {/* Visual Breakdown Bar */}
            {calcResult && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    Principal: {calcResult.principal_percentage}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Interest: {calcResult.interest_percentage}%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${calcResult.principal_percentage}%` }}
                    className="bg-blue-500 transition-all duration-300"
                    title={`Principal: ${calcResult.principal_percentage}%`}
                  ></div>
                  <div
                    style={{ width: `${calcResult.interest_percentage}%` }}
                    className="bg-amber-500 transition-all duration-300"
                    title={`Interest: ${calcResult.interest_percentage}%`}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action to Partner Locator */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1 text-xs text-emerald-950">
              <span className="font-bold block text-emerald-900">Ready to locate your nearest Channel Partner?</span>
              <span>Find approved State Channelizing Agencies and Banks with matching loan funds.</span>
            </div>
            <button
              onClick={() => setActiveTab('partners')}
              className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow shrink-0 cursor-pointer"
            >
              <span>Find Partners</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {calcResult && calcResult.amortization_schedule && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.calculator.scheduleTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Showing month-by-month repayment breakdown and moratorium impact.
              </p>
            </div>
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 cursor-pointer"
            >
              <span>{showFullSchedule ? "Show Less" : `View Full (${calcResult.amortization_schedule.length} Months)`}</span>
              {showFullSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{t.calculator.month}</th>
                  <th className="py-2.5 px-3">{t.calculator.type}</th>
                  <th className="py-2.5 px-3 text-right">{t.calculator.principal}</th>
                  <th className="py-2.5 px-3 text-right">{t.calculator.interest}</th>
                  <th className="py-2.5 px-3 text-right">{t.calculator.totalInstallment}</th>
                  <th className="py-2.5 px-3 text-right">{t.calculator.balance}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {(showFullSchedule 
                  ? calcResult.amortization_schedule 
                  : calcResult.amortization_schedule.slice(0, 12)
                ).map((row) => (
                  <tr 
                    key={row.month}
                    className={row.is_moratorium ? 'bg-amber-50/50' : 'hover:bg-slate-50'}
                  >
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                      M{row.month}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      {row.is_moratorium ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          {t.calculator.moratoriumTag}
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-900 text-[10px] font-medium px-2 py-0.5 rounded">
                          {t.calculator.repaymentTag}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      ₹{row.principal_payment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-700">
                      ₹{row.interest_payment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ₹{row.total_installment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹{row.remaining_balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
