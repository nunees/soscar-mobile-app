export interface ILocation {
  id: string;
  user_id?: string;
  location_id: string;
  cnpj: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  address_line: string;
  number: string;
  city: string;
  district: string;
  state: string;
  active: boolean;
  zipcode: string;
  payment_methods: number[];
  business_categories: number[];
  business_description: string;
  latitude: string;
  longitude: string;
  cover_photo: string;
  avatar: string;
  photos: string[];
  LocationsPhotos?: {
    id?: string;
    location_id?: string;
    photo: string;
    created_at: Date | null;
    updated_at: Date | null;
  }[];
  users?: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  open_hours: string;
  open_hours_weekend: string[];
  created_at: Date | null;
  updated_at: Date | null;
}
