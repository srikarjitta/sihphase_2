import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

// Backend API base URL — set VITE_API_BASE_URL in .env for cross-origin deploys
// e.g. VITE_API_BASE_URL=https://your-backend.railway.app
// Leave empty to use relative paths (same-origin or Vite dev proxy)
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'profile', 'recommendation', 'calculator', 'partners', 'documents', 'tracking', 'schemes'
  const [language, setLanguage] = useState('en'); // 'en', 'te', 'hi', 'ta'

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    annual_family_income: '',
    is_sc_eligible: true,
    project_type: 'Dairy',
    estimated_project_cost: 140000,
    education_status: 'Working',
    gender: 'Female',
    state: 'Telangana',
    district: 'Hyderabad',
    pincode: '500001',
    latitude: 17.3850,
    longitude: 78.4867
  });

  // Recommendation
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Financial Calculator
  const [calcParams, setCalcParams] = useState({
    loan_amount: 140000,
    interest_rate_pct: 4.0,
    tenure_months: 36,
    moratorium_months: 6
  });
  const [calcResult, setCalcResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Channel Partners
  const [partnerFilters, setPartnerFilters] = useState({
    scheme_id: '',
    partner_type: 'All',
    max_radius_km: 50
  });
  const [partnerList, setPartnerList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Documents
  const [documentsState, setDocumentsState] = useState([]);
  const [docProgress, setDocProgress] = useState(0);

  // Application Tracking
  const [trackAppId, setTrackAppId] = useState('SIH-2026-MOSJE-8821');
  const [trackingData, setTrackingData] = useState(null);

  // AI Assistant Drawer / Floating state
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Helper translation getter
  const t = translations[language] || translations.en;

  // Run Calculator whenever calcParams change
  const executeCalculation = async (params = calcParams) => {
    setIsCalculating(true);
    try {
      const response = await fetch(`${API_BASE}/api/calculator/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loan_amount: Number(params.loan_amount) || 10000,
          interest_rate_pct: Number(params.interest_rate_pct) || 4.0,
          tenure_months: Number(params.tenure_months) || 12,
          moratorium_months: Number(params.moratorium_months) || 0
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCalcResult(data);
      }
    } catch (err) {
      console.error("Calculator API error:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Run Eligibility Evaluation
  const checkEligibility = async (profileData = userProfile) => {
    setIsEvaluating(true);
    try {
      const response = await fetch(`${API_BASE}/api/eligibility/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name || 'Beneficiary',
          annual_family_income: Number(profileData.annual_family_income) || 120000,
          is_sc_eligible: Boolean(profileData.is_sc_eligible),
          project_type: profileData.project_type,
          estimated_project_cost: Number(profileData.estimated_project_cost) || 140000,
          education_status: profileData.education_status,
          gender: profileData.gender || 'All',
          state: profileData.state,
          district: profileData.district,
          pincode: profileData.pincode,
          latitude: Number(profileData.latitude) || 17.3850,
          longitude: Number(profileData.longitude) || 78.4867
        })
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendationResult(data);

        if (data.recommended_scheme) {
          setSelectedScheme(data.recommended_scheme);
          // Sync calculator
          const newParams = {
            loan_amount: Math.round(Number(profileData.estimated_project_cost) * (data.recommended_scheme.max_loan_percentage / 100)),
            interest_rate_pct: data.recommended_scheme.interest_rate_pct,
            tenure_months: data.recommended_scheme.max_tenure_months,
            moratorium_months: data.recommended_scheme.moratorium_months_min
          };
          setCalcParams(newParams);
          executeCalculation(newParams);
          // Sync documents
          fetchDocuments(data.recommended_scheme.id);
        }
        setActiveTab('recommendation');
      }
    } catch (err) {
      console.error("Eligibility check error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Fetch Documents
  const fetchDocuments = async (schemeId = 'mosje_micro_finance') => {
    try {
      const response = await fetch(`${API_BASE}/api/documents/checklist/${schemeId}`);
      if (response.ok) {
        const data = await response.json();
        setDocumentsState(data.documents);
        setDocProgress(data.completion_percentage);
      }
    } catch (err) {
      console.error("Documents fetch error:", err);
    }
  };

  // Toggle/Upload Document
  const handleUploadDocument = (docId) => {
    setDocumentsState(prev => {
      const updated = prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: doc.status === 'Verified' ? 'Verified' : 'Uploaded',
            verification_notes: 'Document uploaded successfully. Ready for SCA appraisal.'
          };
        }
        return doc;
      });
      const completed = updated.filter(d => d.status === 'Uploaded' || d.status === 'Verified').length;
      setDocProgress(Math.round((completed / updated.length) * 100));
      return updated;
    });
  };

  // Fetch Tracking
  const fetchTracking = async (appId = trackAppId) => {
    try {
      const response = await fetch(`${API_BASE}/api/applications/track/${encodeURIComponent(appId)}`);
      if (response.ok) {
        const data = await response.json();
        setTrackingData(data);
      }
    } catch (err) {
      console.error("Tracking error:", err);
    }
  };

  // Fetch Partners
  const fetchPartners = async (filters = partnerFilters) => {
    try {
      const response = await fetch(`${API_BASE}/api/partners/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheme_id: filters.scheme_id || (selectedScheme ? selectedScheme.id : null),
          partner_type: filters.partner_type,
          user_latitude: userProfile.latitude,
          user_longitude: userProfile.longitude,
          max_radius_km: filters.max_radius_km
        })
      });
      if (response.ok) {
        const data = await response.json();
        setPartnerList(data.partners);
        if (data.partners.length > 0) {
          setSelectedPartner(data.partners[0]);
        }
      }
    } catch (err) {
      console.error("Partners fetch error:", err);
    }
  };

  // 1-Click SIH Judge Demo Preset
  const triggerJudgeDemo = () => {
    const demoProfile = {
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
    setUserProfile(demoProfile);
    checkEligibility(demoProfile);
  };

  // Initial loads
  useEffect(() => {
    executeCalculation();
    fetchDocuments('mosje_micro_finance');
    fetchTracking('SIH-2026-MOSJE-8821');
    fetchPartners();
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        userProfile,
        setUserProfile,
        recommendationResult,
        isEvaluating,
        checkEligibility,
        selectedScheme,
        setSelectedScheme,
        calcParams,
        setCalcParams,
        calcResult,
        isCalculating,
        executeCalculation,
        partnerFilters,
        setPartnerFilters,
        partnerList,
        selectedPartner,
        setSelectedPartner,
        fetchPartners,
        documentsState,
        docProgress,
        handleUploadDocument,
        fetchDocuments,
        trackAppId,
        setTrackAppId,
        trackingData,
        fetchTracking,
        isAiOpen,
        setIsAiOpen,
        triggerJudgeDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
