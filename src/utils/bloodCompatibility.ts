import { BloodGroup } from '../types';

export const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

// Who can donate to this recipient?
export const COMPATIBLE_DONORS_FOR_RECIPIENT: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Who can this donor give to?
export const CAN_DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'], // Universal recipient
};

export const BLOOD_GROUP_INFO: Record<BloodGroup, { title: string; rarity: string; note: string }> = {
  'O-': {
    title: 'Universal Red Cell Donor',
    rarity: '~7% of population',
    note: 'In severe emergencies, O- can be safely transfused to any patient regardless of blood type.'
  },
  'O+': {
    title: 'Most Common Blood Type',
    rarity: '~38% of population',
    note: 'Can donate to any positive blood group (O+, A+, B+, AB+). High daily hospital demand.'
  },
  'A-': {
    title: 'Universal Platelet Donor',
    rarity: '~6% of population',
    note: 'Can donate red blood cells to A-, A+, AB-, AB+ patients. Vital for immunocompromised patients.'
  },
  'A+': {
    title: 'Second Most Common',
    rarity: '~34% of population',
    note: 'Can donate red blood cells to A+ and AB+ recipients. Always in demand for scheduled surgeries.'
  },
  'B-': {
    title: 'Rare Blood Group',
    rarity: '~2% of population',
    note: 'Can donate red blood cells to B-, B+, AB-, AB+. High urgency in rare emergency matches.'
  },
  'B+': {
    title: 'Vital Rh Positive Type',
    rarity: '~9% of population',
    note: 'Can donate red blood cells to B+ and AB+ recipients. Widely required in obstetrics and trauma.'
  },
  'AB-': {
    title: 'Rarest Blood Group',
    rarity: '~1% of population',
    note: 'Can donate red blood cells to AB- and AB+. Universal plasma donor for all Rh negative patients.'
  },
  'AB+': {
    title: 'Universal Recipient',
    rarity: '~3% of population',
    note: 'Can receive red blood cells from any blood group. Universal plasma donor to any emergency recipient.'
  }
};

export function isDonorCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  return COMPATIBLE_DONORS_FOR_RECIPIENT[recipientGroup]?.includes(donorGroup) ?? false;
}
