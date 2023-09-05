export interface ILocation {
  id: string;
  user_id?: string;
  location_id?: string;
  cnpj: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  address_line: string;
  number: number;
  city: string;
  district: string;
  state: string;
  zipcode: string;
  payment_methods: number[];
  business_categories: number[];
  business_description: string | null;
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
}
