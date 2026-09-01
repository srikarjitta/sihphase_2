import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  Briefcase, 
  GraduationCap, 
  User, 
  AlertCircle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const ProfileEligibility = () => {
  const { userProfile, setUserProfile, checkEligibility, isEvaluating, t } = useApp();
  const [errors, setErrors] = useState({});

  const projectTypes = [
    'Dairy',
    'Agriculture',
    'Retail / Shop',
    'Manufacturing',
    'Service',
    'Education',
    'Other'
  ];

  const educationLevels = [
    'Student',
    'Graduate',
    'Working',
    'Other'
  ];

  const validate = () => {
    const errs = {};
    if (!userProfile.name || userProfile.name.trim().length === 0) {
      errs.name = "Applicant name is required.";
    }
    if (userProfile.annual_family_income === '' || Number(userProfile.annual_family_income) < 0) {
      errs.income = "Please enter valid annual family income.";
    }
    if (!userProfile.estimated_project_cost || Number(userProfile.estimated_project_cost) <= 0) {
      errs.cost = "Estimated project cost must be greater than 0.";
    }
    if (!userProfile.pincode || userProfile.pincode.length < 6) {
      errs.pincode = "Enter a valid 6-digit Pincode.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      checkEligibility(userProfile);
    }
  };

  const handleQuickFill = (type = 'dairy') => {
    if (type === 'dairy') {
      const p = {
        name: "Smt. K. Lakshmi",
        annual_family_income: 120000,
        is_sc_eligible: true,
        project_type: "Dairy",
        estimated_project_cost: 140000,
        education_status: "Working",
        gender: "Female",
        state: "Telangana",
        district: "Hyderabad",
        pincode: "500028",
        latitude: 17.4012,
        longitude: 78.4738
      };
      setUserProfile(p);
      setErrors({});
    } else if (type === 'manufacturing') {
      const p = {
        name: "Shri Rajesh Kumar",
        annual_family_income: 220000,
        is_sc_eligible: true,
        project_type: "Manufacturing",
        estimated_project_cost: 850000,
        education_status: "Graduate",
        gender: "Male",
        state: "Telangana",
        district: "Rangareddy",
        pincode: "500081",
        latitude: 17.4435,
        longitude: 78.3840
      };
      setUserProfile(p);
      setErrors({});
    } else if (type === 'education') {
      const p = {
        name: "Kum. Kavita Reddy",
        annual_family_income: 180000,
        is_sc_eligible: true,
        project_type: "Education",
        estimated_project_cost: 500000,
        education_status: "Student",
        gender: "Female",
        state: "Telangana",
        district: "Hyderabad",
        pincode: "500001",
        latitude: 17.3850,
        longitude: 78.4867
      };
      setUserProfile(p);
      setErrors({});
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.profile.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.profile.subtitle}
              </p>
            </div>
          </div>

          {/* Quick preset scenario buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Quick Test Profiles:</span>
            <button
              type="button"
              onClick={() => handleQuickFill('dairy')}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              🐄 Micro Dairy (₹1.4L)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('manufacturing')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              ⚙️ Term Loan Mfg (₹8.5L)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('education')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              🎓 Student Loan (₹5L)
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              {t.profile.nameLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                placeholder={t.profile.namePlaceholder}
                className={`w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border ${
                  errors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-blue-600'
                } focus:outline-none`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-600 font-semibold">{errors.name}</p>}
          </div>

          {/* 2. Annual Family Income */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-800">
                {t.profile.incomeLabel} <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-500">Ceiling: ₹3,00,000 p.a.</span>
            </div>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                value={userProfile.annual_family_income}
                onChange={(e) => setUserProfile({ ...userProfile, annual_family_income: e.target.value })}
                placeholder="e.g. 120000"
                min="0"
                step="5000"
                className={`w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border ${
                  errors.income ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-blue-600'
                } focus:outline-none`}
              />
            </div>
            {errors.income ? (
              <p className="text-[11px] text-red-600 font-semibold">{errors.income}</p>
            ) : (
              <p className="text-[10px] text-slate-500">{t.profile.incomeHelp}</p>
            )}
          </div>

          {/* 3. SC Eligibility / Category */}
          <div className="space-y-1.5 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              {t.profile.scLabel} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                  userProfile.is_sc_eligible 
                    ? 'bg-blue-900 text-white border-blue-900 shadow' 
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="sc_eligibility"
                  checked={userProfile.is_sc_eligible === true}
                  onChange={() => setUserProfile({ ...userProfile, is_sc_eligible: true })}
                  className="hidden"
                />
                <CheckCircle2 className={`w-4 h-4 ${userProfile.is_sc_eligible ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{t.profile.scYes}</span>
              </label>

              <label 
                className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                  !userProfile.is_sc_eligible 
                    ? 'bg-blue-900 text-white border-blue-900 shadow' 
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="sc_eligibility"
                  checked={userProfile.is_sc_eligible === false}
                  onChange={() => setUserProfile({ ...userProfile, is_sc_eligible: false })}
                  className="hidden"
                />
                <AlertCircle className={`w-4 h-4 ${!userProfile.is_sc_eligible ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{t.profile.scNo}</span>
              </label>
            </div>
          </div>

          {/* 4. Project Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              {t.profile.projectTypeLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={userProfile.project_type}
                onChange={(e) => setUserProfile({ ...userProfile, project_type: e.target.value })}
                className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none bg-white cursor-pointer"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Education Status */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              {t.profile.educationLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={userProfile.education_status}
                onChange={(e) => setUserProfile({ ...userProfile, education_status: e.target.value })}
                className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none bg-white cursor-pointer"
              >
                {educationLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Estimated Project Cost with Interactive Quick Presets */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-800">
                {t.profile.costLabel} <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-extrabold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                ₹{Number(userProfile.estimated_project_cost || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                value={userProfile.estimated_project_cost}
                onChange={(e) => setUserProfile({ ...userProfile, estimated_project_cost: e.target.value })}
                min="10000"
                max="2000000"
                step="10000"
                className={`w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border ${
                  errors.cost ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-blue-600'
                } focus:outline-none`}
              />
            </div>
            {/* Quick Cost Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <span className="text-[10px] text-slate-500 font-bold">Quick Ranges:</span>
              {[50000, 140000, 200000, 500000, 850000, 1500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setUserProfile({ ...userProfile, estimated_project_cost: amt })}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    Number(userProfile.estimated_project_cost) === amt
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  ₹{(amt / 100000).toFixed(1)} Lakh
                </button>
              ))}
            </div>
            {errors.cost && <p className="text-[11px] text-red-600 font-semibold">{errors.cost}</p>}
          </div>

          {/* 7. Location Inputs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">{t.profile.stateLabel}</label>
            <input
              type="text"
              value={userProfile.state}
              onChange={(e) => setUserProfile({ ...userProfile, state: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">{t.profile.districtLabel}</label>
            <input
              type="text"
              value={userProfile.district}
              onChange={(e) => setUserProfile({ ...userProfile, district: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">{t.profile.pincodeLabel}</label>
            <input
              type="text"
              value={userProfile.pincode}
              onChange={(e) => setUserProfile({ ...userProfile, pincode: e.target.value })}
              placeholder="e.g. 500028"
              maxLength={6}
              className={`w-full text-xs font-medium px-3 py-2.5 rounded-lg border ${
                errors.pincode ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-blue-600'
              } focus:outline-none font-mono`}
            />
            {errors.pincode && <p className="text-[11px] text-red-600 font-semibold">{errors.pincode}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">Gender (For Concessional Rebates)</label>
            <select
              value={userProfile.gender}
              onChange={(e) => setUserProfile({ ...userProfile, gender: e.target.value })}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none bg-white cursor-pointer"
            >
              <option value="Female">Female (0.5% - 1% Rebate Applicable)</option>
              <option value="Male">Male</option>
              <option value="Transgender">Transgender</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{t.profile.validating}</span>
              </>
            ) : (
              <>
                <span>{t.profile.btnSubmit}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
