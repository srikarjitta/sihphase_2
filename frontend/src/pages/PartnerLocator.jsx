import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  Filter, 
  Award, 
  Navigation, 
  Sparkles, 
  Info,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

// Custom SVG-based Pin Icon generator for Leaflet
const createCustomIcon = (partnerType, isRecommended) => {
  let color = '#2563eb'; // Blue for Bank
  if (partnerType.includes('State') || partnerType.includes('SCA')) {
    color = '#0a3871'; // Dark Navy for SCA
  } else if (partnerType.includes('Rural') || partnerType.includes('RRB')) {
    color = '#059669'; // Emerald for RRB
  } else if (partnerType.includes('MFI') || partnerType.includes('NBFC')) {
    color = '#d97706'; // Amber for MFI
  }

  const border = isRecommended ? 'border: 3px solid #f59e0b;' : 'border: 2px solid white;';

  const html = `
    <div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      ${border}
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    ">
      ${isRecommended ? '⭐' : '📍'}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// Component to dynamically re-center map when partner is selected
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export const PartnerLocator = () => {
  const { 
    partnerList, 
    selectedPartner, 
    setSelectedPartner, 
    partnerFilters, 
    setPartnerFilters, 
    fetchPartners, 
    userProfile, 
    selectedScheme,
    setActiveTab,
    t 
  } = useApp();

  const [mapCenter, setMapCenter] = useState([17.4012, 78.4738]);

  const partnerTypes = [
    'All',
    'State Channelizing Agency',
    'Public Sector Bank',
    'Regional Rural Bank',
    'NBFC-MFI'
  ];

  const handleFilterChange = (key, value) => {
    const updated = { ...partnerFilters, [key]: value };
    setPartnerFilters(updated);
    fetchPartners(updated);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      setMapCenter([selectedPartner.latitude, selectedPartner.longitude]);
    }
  }, [selectedPartner]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6 text-emerald-800" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.partners.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.partners.subtitle}
              </p>
            </div>
          </div>

          {/* User Location Badge */}
          <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200">
            <Navigation className="w-3.5 h-3.5 text-blue-700" />
            <span>Location: {userProfile.district}, {userProfile.state}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Filter className="w-4 h-4 text-blue-800" />
          <span>Filters:</span>
        </div>

        {/* Partner Type Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium">Type:</label>
          <select
            value={partnerFilters.partner_type}
            onChange={(e) => handleFilterChange('partner_type', e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {partnerTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt === 'All' ? t.partners.allTypes : pt}
              </option>
            ))}
          </select>
        </div>

        {/* Radius Filter */}
        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium">{t.partners.searchRadius}:</label>
          <select
            value={partnerFilters.max_radius_km}
            onChange={(e) => handleFilterChange('max_radius_km', Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
            <option value={50}>Within 50 km</option>
            <option value={500}>Statewide (500 km)</option>
          </select>
        </div>

        {/* Active Scheme Indicator */}
        {selectedScheme && (
          <div className="ml-auto bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5">
            <span>Filtered for:</span>
            <span className="text-blue-950 font-extrabold">{selectedScheme.short_name}</span>
          </div>
        )}
      </div>

      {/* Main Map & Partner List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Leaflet Map */}
        <div className="lg:col-span-7 h-[450px] lg:h-[600px] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <ChangeView center={mapCenter} zoom={13} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {partnerList.map((partner) => (
              <Marker
                key={partner.id}
                position={[partner.latitude, partner.longitude]}
                icon={createCustomIcon(partner.partner_type, partner.is_recommended)}
                eventHandlers={{
                  click: () => {
                    setSelectedPartner(partner);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-xs">
                    {partner.is_recommended && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded block">
                        ⭐ Recommended Apex Partner
                      </span>
                    )}
                    <h4 className="font-bold text-slate-900">{partner.name}</h4>
                    <p className="text-[11px] text-slate-600">{partner.address}</p>
                    <div className="font-mono text-emerald-800 font-bold text-[11px]">
                      Distance: ~{partner.distance_km} km
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend Floating Tag */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow text-[10px] space-y-1">
            <div className="font-bold text-slate-800">Map Legend:</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0a3871]"></span> State Agency (SCA)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span> Public Sector Bank (PSB)</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span> Regional Rural Bank (RRB)</div>
          </div>
        </div>

        {/* Partner Cards Column */}
        <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-1">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nearby Channel Partners ({partnerList.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Ranked by Proximity</span>
          </div>

          {partnerList.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-500">No channel partners found within this radius.</p>
              <button
                onClick={() => handleFilterChange('max_radius_km', 500)}
                className="text-xs font-bold text-blue-900 underline cursor-pointer"
              >
                Expand radius to Statewide
              </button>
            </div>
          ) : (
            partnerList.map((partner) => {
              const isSelected = selectedPartner?.id === partner.id;
              return (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 shadow-md ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {partner.partner_type}
                    </span>
                    <span className="text-xs font-extrabold text-blue-900 font-mono">
                      ~{partner.distance_km} km
                    </span>
                  </div>

                  {partner.is_recommended && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      {t.partners.recommendedBadge}
                    </span>
                  )}

                  {/* Partner Name & Address */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {partner.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{partner.address}</span>
                    </p>
                  </div>

                  {/* Manager & Timings */}
                  <div className="space-y-1 text-[11px] text-slate-600 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{partner.timings}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{partner.phone}</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-900 hover:text-blue-700 font-bold flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{t.partners.getDirections}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('documents');
                      }}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-3 py-1 rounded-lg text-[11px] cursor-pointer"
                    >
                      Prepare Documents
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mock Disclaimer Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.partners.mockNotice}
        </p>
      </div>
    </div>
  );
};
