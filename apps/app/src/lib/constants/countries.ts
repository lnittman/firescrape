export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  continent?: string;
}

// Simplified country list for now
export const countries: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', continent: 'North America' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', continent: 'Europe' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', continent: 'North America' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', continent: 'Oceania' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', continent: 'Europe' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', continent: 'Europe' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', continent: 'Europe' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', continent: 'Europe' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', continent: 'Asia' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', continent: 'Asia' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', continent: 'Asia' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', continent: 'South America' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', continent: 'North America' },
];

export const continentOrder = [
  'North America',
  'Europe', 
  'Asia',
  'South America',
  'Africa',
  'Oceania',
  'Antarctica'
];