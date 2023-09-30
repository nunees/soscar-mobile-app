export interface ISchedules {
  id: string;
  user_id: string;
  vehicle_id: string;
  service_type_id: number | null;
  location_id: string;
  date: Date;
  time: string;
  notes?: string | null;
  status?: number | null;
  partner_notes?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;

  location?: {
    id: string;
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
    location_id?: string;
    payment_methods: number[];
    business_categories: number[];
    business_description: string;
    active: boolean;
    open_hours: string;
    open_hours_weekend: string[];
    user_id: string;
    avatar?: string;
    latitude: string;
    longitude: string;
    created_at?: Date;
  };
  users?: {
    id: string;
    name: string;
    last_name: string;
    email: string;
    cpf: string;
    mobile_phone: string;
    UsersAddresses?: {
      address_line: string;
      number: number;
      city: string;
      district: string;
      state: string;
      zipcode: string;
    };
  };
  service_type?: {
    id: number;
    name: string;
    category_id: number;
    created_at?: Date;
  };

  vehicles?: {
    InsuranceCompanies: {
      id: number;
      name: string;
    };
    brand: {
      icon: string;
      id: number;
      name: string;
    };
    brand_id: number;
    color: string;
    engineMiles: number;
    id: string;
    insuranceCompaniesId: number;
    isPrimary: boolean;
    name: {
      brand_id: number;
      id: number;
      name: string;
    };
    SchedulesFiles: {
      file_url: true;
    };
  };
}
