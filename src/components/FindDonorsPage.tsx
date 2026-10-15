import React, { useState, useMemo } from 'react';
import { Donor, SearchFilters, BloodGroup } from '../types';
import { ALL_BLOOD_GROUPS } from '../utils/bloodCompatibility';
import { POPULAR_LOCATIONS } from '../utils/distance';
import { donorService } from '../services/donorService';
import { DonorMap } from './DonorMap';

interface FindDonorsPageProps {
  onSelectDonorDetails: (donor: Donor) => void;
  onContactDonor: (donor: Donor) => void;
  initialBloodGroup?: BloodGroup | 'ALL';
}

export const FindDonorsPage: React.FC<FindDonorsPageProps> = ({
  onSelectDonorDetails,
  onContactDonor,
  initialBloodGroup = 'ALL',
}) => {
  // Recipient Origin Location for distance calculations
  const [recipientLocation, setRecipientLocation] = useState({
    name: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    bloodGroup: initialBloodGroup,
    includeCompatible: true,
    cityOrPin: '',
    maxDistanceKm: 50, // default 50 km
    minAge: 18,
    availabilityOnly: false,
    verifiedOnly: false,
  });

  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [selectedMapDonorId, setSelectedMapDonorId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');

  // Query donors using donorService
  const matchingDonors = useMemo(() => {
    return donorService.searchDonors(filters, {
      lat: recipientLocation.lat,
      lng: recipientLocation.lng,
    });
  }, [filters, recipientLocation]);

  const handleCityPresetChange = (cityName: string) => {
    const loc = POPULAR_LOCATIONS.find((l) => l.name === cityName);
    if (loc) {
      setRecipientLocation({
        name: loc.name,
        lat: loc.lat,
        lng: loc.lng,
      });
      setGpsStatus(`Search location set to ${loc.name}, ${loc.state}`);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by your browser.');
      return;
    }
    setGpsStatus('Locating your GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        setRecipientLocation({
          name: 'Your Current GPS Location',
          lat,
          lng,
        });
        setGpsStatus('✓ Using your current GPS location for distance calculations.');
      },
      (err) => {
        setGpsStatus(`Location error: ${err.message}. Using default city.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClearFilters = () => {
    setFilters({
      bloodGroup: 'ALL',
      includeCompatible: true,
      cityOrPin: '',
      maxDistanceKm: 0,
      minAge: 18,
      availabilityOnly: false,
      verifiedOnly: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Emergency Matching Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Find Compatible Blood Donors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search by blood compatibility, maximum road distance, city, and verified medical documentation.
            </p>
          </div>

          {/* Quick GPS Origin Picker */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Recipient Location:
              </span>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>📍</span>
                <span>Use My GPS</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={recipientLocation.name}
                onChange={(e) => handleCityPresetChange(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </select>
              <span className="text-xs font-mono text-slate-600">
                {recipientLocation.lat.toFixed(2)}°, {recipientLocation.lng.toFixed(2)}°
              </span>
            </div>

            {gpsStatus && (
              <p className="text-[11px] text-slate-600 leading-tight">{gpsStatus}</p>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Required Blood Group
            </label>
            <select
              value={filters.bloodGroup}
              onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
              className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 font-mono text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="ALL">All Blood Groups</option>
              {ALL_BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg} {bg === 'O-' ? '(Universal Donor)' : ''}
                </option>
              ))}
            </select>
            {filters.bloodGroup !== 'ALL' && (
              <label className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.includeCompatible}
                  onChange={(e) => setFilters({ ...filters, includeCompatible: e.target.checked })}
                  className="rounded text-rose-600"
                />
                <span>Include all compatible donor types (e.g. O-)</span>
              </label>
            )}
          </div>

          {/* City or PIN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Search City / Area / PIN
            </label>
            <input
              type="text"
              placeholder="e.g. Adyar, 600020, Indiranagar"
              value={filters.cityOrPin}
              onChange={(e) => setFilters({ ...filters, cityOrPin: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          {/* Maximum Distance */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Max Distance Radius
            </label>
            <select
              value={filters.maxDistanceKm}
              onChange={(e) =>
                setFilters({ ...filters, maxDistanceKm: parseInt(e.target.value, 10) })
              }
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="5">Within 5 km (Immediate local)</option>
              <option value="10">Within 10 km (City district)</option>
              <option value="25">Within 25 km (Metro area)</option>
              <option value="50">Within 50 km (Greater region)</option>
              <option value="100">Within 100 km (Inter-city)</option>
              <option value="0">Any Distance / Nationwide</option>
            </select>
          </div>

          {/* Minimum Donor Age & Toggles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Donor Status Filters:</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.availabilityOnly}
                  onChange={(e) =>
                    setFilters({ ...filters, availabilityOnly: e.target.checked })
                  }
                  className="rounded text-rose-600"
                />
                <span>Available donors only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                  className="rounded text-rose-600"
                />
                <span>Verified medical certificate only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Filter Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-bold text-slate-900">{matchingDonors.length}</span>
            <span>compatible donors found sorted by nearest distance</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('both')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Split Map & Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Map View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Cards Only
              </button>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Display: Interactive Map and Matching Donors */}
      <div className="space-y-6">
        {/* Map View */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>📍 Live Radius Map</span>
                <span className="text-slate-500 font-normal">
                  (Showing donors within {filters.maxDistanceKm ? `${filters.maxDistanceKm} km` : 'all ranges'})
                </span>
              </h3>
            </div>
            <DonorMap
              recipientCoords={{ lat: recipientLocation.lat, lng: recipientLocation.lng }}
              recipientLabel={recipientLocation.name}
              donors={matchingDonors}
              selectedDonorId={selectedMapDonorId}
              onSelectDonor={(id) => {
                setSelectedMapDonorId(id);
                const match = matchingDonors.find((d) => d.donorId === id);
                if (match) onSelectDonorDetails(match);
              }}
              maxDistanceKm={filters.maxDistanceKm}
            />
          </div>
        )}

        {/* Donors Cards Grid */}
        {(viewMode === 'both' || viewMode === 'list') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Matching Lifesavers ({matchingDonors.length})
              </h3>
              <span className="text-xs text-slate-500">
                Sorted by nearest estimated road distance
              </span>
            </div>

            {matchingDonors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  🩸
                </div>
                <h4 className="text-lg font-bold text-slate-900">No Matching Donors in Selected Range</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try broadening your distance filter (e.g. 50 km or 100 km), selecting "Include compatible donor types", or resetting the city filter.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                >
                  Reset All Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchingDonors.map((donor) => {
                  const isVerified =
                    donor.medicalCertificate?.verificationStatus === 'Verified';
                  const privacyDisplayName = donor.consent.shareAge
                    ? donor.fullName
                    : `${donor.fullName.split(' ')[0]} ${donor.fullName.split(' ')[1]?.charAt(0) || ''}.`;

                  return (
                    <div
                      key={donor.donorId}
                      className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Badge Strip */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-lg font-black text-white bg-rose-600 px-2.5 py-1 rounded-lg shadow-xs">
                              {donor.bloodGroup}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                {privacyDisplayName}
                              </h4>
                              <p className="text-[11px] font-mono text-slate-500">
                                ID: {donor.donorId}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              donor.availabilityStatus === 'Available'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            ● {donor.availabilityStatus}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Distance:</span>
                            <span className="font-mono font-bold text-rose-600">
                              {donor.distanceKm !== undefined
                                ? `${donor.distanceKm} km (est. road)`
                                : 'Nearby'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Location:</span>
                            <span className="font-medium text-slate-800">
                              {donor.city}, {donor.state}
                            </span>
                          </div>
                          {donor.consent.shareAge && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Donor Age:</span>
                              <span className="font-medium text-slate-800">{donor.age} yrs</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                            <span className="text-slate-500">Medical Certificate:</span>
                            <span
                              className={`font-semibold ${
                                isVerified ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {isVerified ? '✓ Verified' : '⏳ Review Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectDonorDetails(donor)}
                          className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onContactDonor(donor)}
                          className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>📞</span>
                          <span>Contact</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
