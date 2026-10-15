import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Donor } from '../types';

interface DonorMapProps {
  recipientCoords: { lat: number; lng: number };
  recipientLabel?: string;
  donors: Donor[];
  selectedDonorId?: string | null;
  onSelectDonor?: (donorId: string) => void;
  maxDistanceKm?: number;
}

export const DonorMap: React.FC<DonorMapProps> = ({
  recipientCoords,
  recipientLabel = 'Search Center',
  donors,
  selectedDonorId,
  onSelectDonor,
  maxDistanceKm = 0,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [recipientCoords.lat, recipientCoords.lng],
        zoom: 12,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when coordinates, donors, or selectedDonor changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Recipient Marker (Blue cross pin)
    const recipientIconHtml = `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(37, 99, 235, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 30px; height: 30px; border-radius: 9999px; background: #1d4ed8; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">
          📍
        </div>
      </div>
    `;

    const recipientIcon = L.divIcon({
      html: recipientIconHtml,
      className: 'custom-recipient-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

    const recipientMarker = L.marker([recipientCoords.lat, recipientCoords.lng], {
      icon: recipientIcon,
      zIndexOffset: 1000,
    }).bindPopup(`
      <div style="padding: 12px; font-family: inherit;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #2563eb; letter-spacing: 0.05em;">Recipient / Request Point</span>
        <h4 style="font-size: 14px; font-weight: 700; margin: 4px 0 2px; color: #0f172a;">${recipientLabel}</h4>
        <p style="font-size: 12px; color: #64748b; margin: 0;">Origin for dynamic distance calculations.</p>
      </div>
    `);

    markersLayerRef.current.addLayer(recipientMarker);

    // Optional Search Radius Circle
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
      circleLayerRef.current = null;
    }

    if (maxDistanceKm > 0) {
      circleLayerRef.current = L.circle([recipientCoords.lat, recipientCoords.lng], {
        radius: maxDistanceKm * 1000,
        color: '#e11d48',
        weight: 1.5,
        fillColor: '#f43f5e',
        fillOpacity: 0.06,
        dashArray: '6, 6',
      }).addTo(map);
    }

    // 2. Donor Markers (Red droplet pins with Blood Group label)
    const bounds = L.latLngBounds([L.latLng(recipientCoords.lat, recipientCoords.lng)]);

    donors.forEach((donor) => {
      // Do not expose exact micro-coordinate if privacy requires, slight jitter or approximate coordinate
      const donorLat = donor.latitude;
      const donorLng = donor.longitude;
      bounds.extend([donorLat, donorLng]);

      const isSelected = selectedDonorId === donor.donorId;
      const isVerified = donor.medicalCertificate?.verificationStatus === 'Verified';

      const donorIconHtml = `
        <div style="position: relative; width: 34px; height: 34px; cursor: pointer;">
          <div style="
            width: 34px;
            height: 34px;
            border-radius: 9999px 9999px 9999px 0;
            transform: rotate(-45deg);
            background: ${isSelected ? '#9f1239' : '#e11d48'};
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(225, 29, 72, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s ease;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-weight: 800;
              font-size: 11px;
              font-family: 'JetBrains Mono', monospace;
            ">${donor.bloodGroup}</span>
          </div>
          ${
            isVerified
              ? `<div style="position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; border-radius: 9999px; background: #10b981; border: 2px solid white;"></div>`
              : ''
          }
        </div>
      `;

      const donorIcon = L.divIcon({
        html: donorIconHtml,
        className: 'custom-donor-marker',
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
      });

      const privacyName = donor.consent?.shareAge
        ? `${donor.fullName.split(' ')[0]} ${donor.fullName.split(' ')[1]?.charAt(0) || ''}.`
        : 'Registered Donor';

      const marker = L.marker([donorLat, donorLng], { icon: donorIcon }).bindPopup(`
        <div style="padding: 12px 14px; min-width: 190px; font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="display: inline-block; background: #ffe4e6; color: #be123c; font-weight: 800; font-size: 11px; padding: 2px 6px; border-radius: 4px;">
              ${donor.bloodGroup} Blood Group
            </span>
            <span style="font-size: 11px; color: ${donor.availabilityStatus === 'Available' ? '#059669' : '#d97706'}; font-weight: 600;">
              ${donor.availabilityStatus}
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px;">${privacyName}</h4>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 6px;">
            ${donor.city} · ${donor.distanceKm !== undefined ? `${donor.distanceKm} km away` : 'Nearby'}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 6px; margin-top: 4px; font-size: 11px; color: #475569;">
            <span>${isVerified ? '✓ Verified Certificate' : 'Pending Verification'}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectDonor) {
          onSelectDonor(donor.donorId);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Fit bounds smoothly if donors exist
    if (donors.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView([recipientCoords.lat, recipientCoords.lng], 12);
    }
  }, [recipientCoords, donors, selectedDonorId, maxDistanceKm, recipientLabel]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([recipientCoords.lat, recipientCoords.lng], 13);
    }
  };

  return (
    <div className="relative w-full h-[380px] lg:h-[460px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Legend & Control */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-slate-200 text-xs flex flex-col gap-1.5 pointer-events-auto max-w-[240px]">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-white shrink-0"></div>
          <span className="text-slate-700 font-medium">Recipient / Origin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white shrink-0"></div>
          <span className="text-slate-700 font-medium">Compatible Donors (Red)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
          <span className="text-slate-500">Green dot = Medically Verified</span>
        </div>
      </div>

      <button
        onClick={handleRecenter}
        type="button"
        className="absolute top-3 right-3 z-[400] bg-white text-slate-800 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <span>🎯</span>
        <span>Center on Origin</span>
      </button>
    </div>
  );
};
