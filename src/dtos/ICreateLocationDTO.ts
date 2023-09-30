export interface ICreateLocationDTO {
  cnpj: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  address_line: string;
  number: string;
  city: string;
  district: string;
  state: string;
  zipcode: string;
  payment_methods: number[];
  business_categories: number[];
  business_description: string;
  open_hours: string;
  open_hours_weekend: string[];
  latitude: string;
  longitude: string;
}
