export interface ILegalQuote {
  id: string;
  hashId: string;
  is_juridical: boolean;
  user_id: string;
  vehicle_id: string;
  insurance_company_id: number;
  insurance_type_id?: number;
  service_type_id: number;
  franchise_price?: number;
  service_price?: number;
  service_description?: string;
  user_notes?: string;
  partner_notes?: string;
  status: number;
  location_id: string;
  users?: {
    id: string;
    name: string;
    avatar: string;
    mobile_phone: string;
  };
  location?: {
    business_name: string;
    address_line: string;
    city: string;
    state: string;
    business_phone: string;
    avatar: string;
  };
  vehicles?: {
    id: string;
    brand_id: number;
    name_id: number;
    color: string;
    year: number;
    plate: string;
  };
  insurance_company?: {
    id: number;
    name: string;
    avatar: string;
  };

  created_at: string;
  updated_at?: string;
}
