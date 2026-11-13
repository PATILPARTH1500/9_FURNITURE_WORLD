export interface CustomerAddress {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string | null;
  landmark?: string | null;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData {
  recipientName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  landmark?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;
