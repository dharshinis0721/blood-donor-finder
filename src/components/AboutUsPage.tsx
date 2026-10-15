import React from 'react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
          Humanitarian Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Blood Donor Finder
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Dedicated to eliminating avoidable delays in finding compatible blood during trauma, complex surgeries, pediatric anemia, and oncological therapies.
        </p>
      </div>

      {/* Core Principles Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
            🩸
          </span>
          <h3 className="text-base font-bold text-slate-900">Voluntary & Non-Commercial</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We adhere strictly to World Health Organization principles: blood donation must be voluntary, non-remunerated, and humanitarian.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            🛡️
          </span>
          <h3 className="text-base font-bold text-slate-900">Clinical Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We enable donors to submit certified health documents for administrative audit, reducing invalid callouts and protecting patient safety.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            📍
          </span>
          <h3 className="text-base font-bold text-slate-900">Privacy & Distance Math</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Precise distance calculation without revealing donors' exact private home coordinates publicly, balancing rapid response with safety.
          </p>
        </div>
      </div>

      {/* Medical Eligibility Criteria Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Clinical Guidelines
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            General Eligibility Guidelines for Donors
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please ensure you meet these standard criteria prior to registering as an active emergency donor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Who Can Donate Blood:</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Age between <strong>18 and 65 years</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Body weight minimum <strong>50 kg (110 lbs)</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Hemoglobin level minimum <strong>12.5 g/dL</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Blood pressure: Systolic 100-140 mmHg, Diastolic 60-90 mmHg.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>At least 90 days interval since last whole blood donation.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Temporary Deferral Conditions:</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Cold, flu, fever, or active antibiotic intake within 7 days.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Recent tattoos, ear/body piercings within the last 6 months.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Major surgery or blood transfusion within the last 12 months.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">✕</span>
                <span>Pregnancy or lactation within the last 12 months.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Myths vs Facts */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Common Blood Donation Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-rose-600 font-bold">Myth: Donating blood makes you physically weak.</span>
            <p className="text-slate-600 leading-relaxed">
              <strong>Fact:</strong> The human body produces around 4 to 5 liters of blood and completely replenishes the plasma volume within 24–48 hours, and red cells within a few weeks.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-rose-600 font-bold">Myth: You can contract diseases while donating.</span>
            <p className="text-slate-600 leading-relaxed">
              <strong>Fact:</strong> Licensed clinics and blood banks use brand-new, sterile, single-use disposable needles for each donor. There is zero risk of infection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
