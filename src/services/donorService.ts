import { Donor, BloodRequest, SearchFilters, BloodGroup, DocumentVerificationStatus, AvailabilityStatus } from '../types';
import { INITIAL_DONORS, INITIAL_REQUESTS } from '../data/seedDonors';
import { isDonorCompatible } from '../utils/bloodCompatibility';
import { calculateEstimatedRoadDistance } from '../utils/distance';

const STORAGE_KEYS = {
  DONORS: 'bdf_donors_v1',
  REQUESTS: 'bdf_requests_v1',
  AUTH: 'bdf_auth_v1',
};

// Initialize or retrieve from localStorage
function getStoredDonors(): Donor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
      return INITIAL_DONORS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DONORS;
  }
}

function saveDonors(donors: Donor[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  } catch (err) {
    console.error('Failed to save donors to local storage', err);
  }
}

function getStoredRequests(): BloodRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REQUESTS;
  }
}

function saveRequests(requests: BloodRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save requests', err);
  }
}

export const donorService = {
  getAllDonors(): Donor[] {
    return getStoredDonors();
  },

  getDonorById(id: string): Donor | undefined {
    return getStoredDonors().find((d) => d.donorId === id);
  },

  searchDonors(
    filters: SearchFilters,
    recipientCoords?: { lat: number; lng: number }
  ): Donor[] {
    let list = getStoredDonors();

    // 1. Blood group filter
    if (filters.bloodGroup && filters.bloodGroup !== 'ALL') {
      const targetGroup = filters.bloodGroup as BloodGroup;
      if (filters.includeCompatible) {
        // Find donors whose blood can be given to this recipient
        list = list.filter((d) => isDonorCompatible(d.bloodGroup, targetGroup));
      } else {
        list = list.filter((d) => d.bloodGroup === targetGroup);
      }
    }

    // 2. City or PIN search
    if (filters.cityOrPin.trim()) {
      const query = filters.cityOrPin.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.city.toLowerCase().includes(query) ||
          d.pinCode.toLowerCase().includes(query) ||
          d.state.toLowerCase().includes(query) ||
          d.address.toLowerCase().includes(query)
      );
    }

    // 3. Minimum age
    if (filters.minAge > 0) {
      list = list.filter((d) => d.age >= filters.minAge);
    }

    // 4. Availability
    if (filters.availabilityOnly) {
      list = list.filter((d) => d.availabilityStatus === 'Available');
    }

    // 5. Verification status
    if (filters.verifiedOnly) {
      list = list.filter((d) => d.medicalCertificate?.verificationStatus === 'Verified');
    }

    // 6. Distance calculation and filtering
    if (recipientCoords) {
      list = list.map((d) => {
        const roadDistance = calculateEstimatedRoadDistance(
          recipientCoords.lat,
          recipientCoords.lng,
          d.latitude,
          d.longitude
        );
        return {
          ...d,
          distanceKm: roadDistance,
          isStraightLine: false,
        };
      });

      if (filters.maxDistanceKm > 0) {
        list = list.filter((d) => (d.distanceKm ?? 99999) <= filters.maxDistanceKm);
      }

      // Sort nearest first by default
      list.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    }

    return list;
  },

  registerDonor(data: Omit<Donor, 'donorId' | 'createdAt' | 'updatedAt' | 'donationCount'>): Donor {
    const donors = getStoredDonors();
    const newId = `BLD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newDonor: Donor = {
      ...data,
      donorId: newId,
      donationCount: data.lastDonationDate ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newDonor, ...donors];
    saveDonors(updated);
    return newDonor;
  },

  updateDonor(donorId: string, updates: Partial<Donor>): Donor | null {
    const donors = getStoredDonors();
    const idx = donors.findIndex((d) => d.donorId === donorId);
    if (idx === -1) return null;

    const updatedDonor: Donor = {
      ...donors[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    donors[idx] = updatedDonor;
    saveDonors(donors);
    return updatedDonor;
  },

  updateAvailability(donorId: string, status: AvailabilityStatus): boolean {
    const donors = getStoredDonors();
    const donor = donors.find((d) => d.donorId === donorId);
    if (!donor) return false;
    donor.availabilityStatus = status;
    donor.updatedAt = new Date().toISOString();
    saveDonors(donors);
    return true;
  },

  updateMedicalDocument(
    donorId: string,
    fileInfo: { fileName: string; fileType: string; fileData?: string }
  ): boolean {
    const donors = getStoredDonors();
    const donor = donors.find((d) => d.donorId === donorId);
    if (!donor) return false;

    donor.medicalCertificate = {
      documentId: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      fileName: fileInfo.fileName,
      fileType: fileInfo.fileType,
      fileData: fileInfo.fileData,
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'Pending Review',
      reviewNotes: 'New document submitted for medical administrative review.',
    };
    donor.updatedAt = new Date().toISOString();
    saveDonors(donors);
    return true;
  },

  adminVerifyDocument(
    donorId: string,
    status: DocumentVerificationStatus,
    reviewerNotes: string,
    reviewerName: string = 'Authorized Medical Verifier'
  ): boolean {
    const donors = getStoredDonors();
    const donor = donors.find((d) => d.donorId === donorId);
    if (!donor || !donor.medicalCertificate) return false;

    donor.medicalCertificate.verificationStatus = status;
    donor.medicalCertificate.reviewedBy = reviewerName;
    donor.medicalCertificate.reviewNotes = reviewerNotes;
    donor.medicalCertificate.reviewedAt = new Date().toISOString();
    donor.updatedAt = new Date().toISOString();
    saveDonors(donors);
    return true;
  },

  deleteDonor(donorId: string): boolean {
    const donors = getStoredDonors();
    const filtered = donors.filter((d) => d.donorId !== donorId);
    if (filtered.length === donors.length) return false;
    saveDonors(filtered);
    return true;
  },

  // Emergency Requests
  getEmergencyRequests(): BloodRequest[] {
    return getStoredRequests();
  },

  createEmergencyRequest(
    data: Omit<BloodRequest, 'requestId' | 'status' | 'createdAt'>
  ): BloodRequest {
    const requests = getStoredRequests();
    const newReq: BloodRequest = {
      ...data,
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReq, ...requests];
    saveRequests(updated);
    return newReq;
  },

  updateRequestStatus(requestId: string, status: 'Active' | 'Fulfilled' | 'Closed'): boolean {
    const requests = getStoredRequests();
    const req = requests.find((r) => r.requestId === requestId);
    if (!req) return false;
    req.status = status;
    saveRequests(requests);
    return true;
  },

  // Platform Statistics
  getStats() {
    const donors = getStoredDonors();
    const requests = getStoredRequests();

    const verifiedDonors = donors.filter(
      (d) => d.medicalCertificate?.verificationStatus === 'Verified'
    ).length;
    const availableDonors = donors.filter((d) => d.availabilityStatus === 'Available').length;
    const fulfilledRequests = requests.filter((r) => r.status === 'Fulfilled').length;
    const activeRequests = requests.filter((r) => r.status === 'Active').length;

    // Blood groups inventory count
    const bloodGroupCounts: Record<string, number> = {};
    for (const d of donors) {
      if (d.availabilityStatus === 'Available') {
        bloodGroupCounts[d.bloodGroup] = (bloodGroupCounts[d.bloodGroup] || 0) + 1;
      }
    }

    return {
      totalDonors: donors.length,
      verifiedDonors,
      availableDonors,
      fulfilledRequests,
      activeRequests,
      totalDonationsRecorded: donors.reduce((acc, curr) => acc + (curr.donationCount || 0), 0),
      bloodGroupCounts,
    };
  },

  resetDefaults() {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  },
};
