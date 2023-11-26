import { ILocation } from './ILocation';
import { IQuotesDocumentDTO } from './IQuoteDocumentDTO';

export interface IQuoteList {
  id: string;
  hashId: string;
  is_juridical: boolean;
  user_id: string;
  vehicle_id: string;
  location_id: string;
  insurance_company_id?: number | null;
  service_type_id: number | null;
  franchise_price: number | null;
  service_price: number | null;
  service_decription: string | null;
  user_notes: string | null;
  status?: number | null;
  partner_notes: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  // UserQuotesDocuments: {
  //   document_type_id: number;
  //   document_url: string | null;
  // }[];
  UserQuotesDocuments: IQuotesDocumentDTO[];
  users: {
    id?: string;
    name: string;
    email: string;
    mobile_phone: string;
    avatar: string;
    last_name?: string;
  };
  insurance_company: {
    name: string;
    id: number;
  };
  location?: ILocation;
  vehicles: {
    brand_id: number;
    color: string;
    created_at: Date | null;
    engineMiles: number;
    id: string;
    insuranceCompaniesId: number;
    isPrimary: boolean;
    name_id: number;
    notes: string | null;
    photo: string | null;
    plate: string;
    updated_at: Date | null;
    user_id: string;
    year: number;
  };
}
