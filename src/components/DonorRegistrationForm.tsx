import React, { useState } from 'react';
import { BloodGroup, AvailabilityStatus, Donor } from '../types';
import { ALL_BLOOD_GROUPS } from '../utils/bloodCompatibility';
import { POPULAR_LOCATIONS } from '../utils/distance';
import { donorService } from '../services/donorService';

interface DonorRegistrationFormProps {
  onSuccess: (donor: Donor) => void;
  onCancel: () => void;
}

export const DonorRegistrationForm: React.FC<DonorRegistrationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  // Generate a preview ID
  const [generatedId] = useState(() => `BLD-${Math.floor(1000 + Math.random() * 9000)}`);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    age: '25',
    email: '',
    bloodGroup: 'O+' as BloodGroup,
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '600001',
    latitude: 13.0827,
    longitude: 80.2707,
    lastDonationDate: '',
    availabilityStatus: 'Available' as AvailabilityStatus,
    shareContactOnEmergency: true,
    shareAge: true,
    showDistance: true,
  });

  const [fileState, setFileState] = useState<{
    fileName: string;
    fileType: string;
    fileSizeMb: number;
    fileData?: string;
  } | null>(null);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset city selection
  const handleCitySelect = (cityName: string) => {
    const loc = POPULAR_LOCATIONS.find((l) => l.name === cityName);
    if (loc) {
      setFormData((prev) => ({
        ...prev,
        city: loc.name,
        state: loc.state,
        latitude: loc.lat,
        longitude: loc.lng,
      }));
    }
  };

  // HTML5 Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsStatus('Requesting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6)),
        }));
        setGpsLoading(false);
        setGpsStatus('✓ Location pinned successfully!');
      },
      (err) => {
        setGpsLoading(false);
        setGpsStatus(`Could not detect location: ${err.message}. Using default coordinates.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // File Upload Handler (PDF, JPG, PNG max 5MB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: 'Only PDF, JPG, and PNG documents are allowed.',
      }));
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 5) {
      setErrors((prev) => ({
        ...prev,
        file: 'File size must be 5MB or less.',
      }));
      return;
    }

    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.file;
      return rest;
    });

    const reader = new FileReader();
    reader.onload = () => {
      setFileState({
        fileName: file.name,
        fileType: file.type,
        fileSizeMb: Math.round(sizeMb * 100) / 100,
        fileData: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      age: '25',
      email: '',
      bloodGroup: 'O+',
      address: '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pinCode: '600001',
      latitude: 13.0827,
      longitude: 80.2707,
      lastDonationDate: '',
      availabilityStatus: 'Available',
      shareContactOnEmergency: true,
      shareAge: true,
      showDistance: true,
    });
    setFileState(null);
    setErrors({});
    setGpsStatus(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full legal name is required.';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
    if (!phoneRegex.test(formData.mobileNumber.trim())) {
      errs.mobileNumber = 'Please enter a valid phone number (e.g. +91 98401 22841).';
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      errs.age = 'Donors must be between 18 and 65 years of age according to blood donation guidelines.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.address.trim()) {
      errs.address = 'Street address or locality is required.';
    }

    if (!formData.city.trim()) {
      errs.city = 'City is required.';
    }

    if (!formData.pinCode.trim()) {
      errs.pinCode = 'Postal / PIN code is required.';
    }

    if (!formData.shareContactOnEmergency) {
      errs.consent = 'Consent to share relevant contact info with emergency seekers is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Save via donorService
    const newDonor = donorService.registerDonor({
      fullName: formData.fullName.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      age: parseInt(formData.age, 10),
      email: formData.email.trim(),
      bloodGroup: formData.bloodGroup,
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pinCode: formData.pinCode.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      lastDonationDate: formData.lastDonationDate || undefined,
      availabilityStatus: formData.availabilityStatus,
      medicalCertificate: {
        documentId: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
        fileName: fileState ? fileState.fileName : 'Awaiting_Document_Upload.pdf',
        fileType: fileState ? fileState.fileType : 'application/pdf',
        fileData: fileState?.fileData,
        uploadDate: new Date().toISOString().split('T')[0],
        verificationStatus: fileState ? 'Pending Review' : 'Pending Review',
        reviewNotes: fileState
          ? 'Medical clearance document submitted. Queued for administrative clinical review.'
          : 'Registration completed. Medical clearance certificate required before verified badge is granted.',
      },
      consent: {
        shareContactOnEmergency: formData.shareContactOnEmergency,
        shareAge: formData.shareAge,
        showDistance: formData.showDistance,
      },
    });

    setIsSubmitting(false);
    onSuccess(newDonor);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Lifesaver Enrollment
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Donor Registration Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Register your blood profile to be contacted during critical emergencies in your local community.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl shrink-0 text-right sm:text-center">
            <span className="text-[11px] text-slate-400 block font-medium">Assigned Donor ID</span>
            <span className="font-mono text-base font-extrabold text-rose-400">{generatedId}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Section 1: Personal & Medical Identification */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>01.</span> Personal & Clinical Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Priya Ramachandran"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group <span className="text-rose-600">*</span>
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
              >
                {ALL_BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} {bg === 'O-' ? '(Universal Donor)' : bg === 'AB+' ? '(Universal Recipient)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98401 22841"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.mobileNumber && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age (Years, 18–65) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.age && <p className="text-[11px] text-rose-600 mt-1">{errors.age}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Address, City, State, PIN & Coordinates */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 mb-4 gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>02.</span> Location & Distance Geometry
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Quick City:</span>
              <div className="flex gap-1 overflow-x-auto">
                {['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCitySelect(c)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Address */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Street Address / Locality <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 14 Gandhi Street, T. Nagar"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / Province <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* PIN Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Postal / PIN Code <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="PIN Code"
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              {errors.pinCode && <p className="text-[11px] text-rose-600 mt-1">{errors.pinCode}</p>}
            </div>

            {/* Coordinates / GPS Pin */}
            <div className="sm:col-span-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Geographic Coordinates</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Used strictly to calculate distance from emergency recipients. Exact coordinates are protected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={gpsLoading}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>📍</span>
                  <span>{gpsLoading ? 'Detecting GPS...' : 'Detect My GPS Location'}</span>
                </button>
              </div>

              {gpsStatus && (
                <p className="text-xs text-rose-600 font-medium mt-2">{gpsStatus}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="text-[11px] text-slate-500">Latitude:</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 font-mono bg-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Longitude:</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 font-mono bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Donation Date, Medical Certificate & Availability */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>03.</span> Medical Eligibility & Documentation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Last Donation Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Blood Donation Date (Optional)
              </label>
              <input
                type="date"
                value={formData.lastDonationDate}
                onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Leave blank if first-time donor. Standard recovery interval is 90 days.
              </p>
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Availability Status <span className="text-rose-600">*</span>
              </label>
              <select
                value={formData.availabilityStatus}
                onChange={(e) =>
                  setFormData({ ...formData, availabilityStatus: e.target.value as AvailabilityStatus })
                }
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
              >
                <option value="Available">Available (Ready for urgent callout)</option>
                <option value="Temporarily Unavailable">Temporarily Unavailable (Resting / Traveling)</option>
                <option value="Unverified">Unverified (Pending eligibility screening)</option>
              </select>
            </div>

            {/* Medical Certificate Upload */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medical Clearance Certificate or Health Card (PDF, JPG, PNG — Max 5MB)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
                <input
                  type="file"
                  id="certUpload"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="certUpload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-lg">
                    📄
                  </div>
                  <span className="text-xs font-semibold text-rose-600 hover:text-rose-700">
                    {fileState ? 'Replace Document' : 'Click to Upload Document'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Blood bank donor card, recent CBC panel, or physician fitness certificate
                  </span>
                </label>

                {fileState && (
                  <div className="mt-3 p-2.5 bg-white rounded-lg border border-slate-200 inline-flex items-center gap-2 text-xs text-slate-700">
                    <span className="font-semibold">{fileState.fileName}</span>
                    <span className="text-slate-400">({fileState.fileSizeMb} MB)</span>
                    <span className="text-emerald-600 font-bold">✓ Attached</span>
                  </div>
                )}
              </div>
              {errors.file && <p className="text-[11px] text-rose-600 mt-1">{errors.file}</p>}
              <p className="text-[11px] text-slate-500 mt-1.5">
                Note: Uploaded documents remain strictly private in admin verification storage. They are never published or downloadable on public listings.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Consent & Privacy Controls */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>04.</span> Privacy & Emergency Consent Checkboxes
          </h3>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.shareContactOnEmergency}
                onChange={(e) =>
                  setFormData({ ...formData, shareContactOnEmergency: e.target.checked })
                }
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="font-semibold text-slate-900">
                  Emergency Contact Sharing Authorization (Required)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  I give permission to store and securely share my contact information with authorized blood seekers during verified medical emergencies.
                </p>
              </div>
            </label>
            {errors.consent && <p className="text-[11px] text-rose-600 pl-6">{errors.consent}</p>}

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2 border-t border-slate-200/60">
              <input
                type="checkbox"
                checked={formData.shareAge}
                onChange={(e) => setFormData({ ...formData, shareAge: e.target.checked })}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="font-semibold text-slate-900">Share Donor Age on Listing</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Allows seekers and blood bank coordinators to see your age for medical suitability matching.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-2 border-t border-slate-200/60">
              <input
                type="checkbox"
                checked={formData.showDistance}
                onChange={(e) => setFormData({ ...formData, showDistance: e.target.checked })}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="font-semibold text-slate-900">Display Approximate Distance in Kilometers</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Enables rapid sorting of nearest donors without disclosing exact house or street coordinates.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Buttons: Submit, Reset, and Cancel */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🩸</span>
            <span>{isSubmitting ? 'Registering Donor...' : 'Submit Donor Registration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
