export interface IAssistanceStatusDTO {
  id?: string;
  user_id: string;
  status: number;
  service_id: number;
  latitude: string;
  longitude: string;
  milesFee: number;
  price: number;
  users?: {
    name: string;
    last_name: string;
    email: string;
    mobile_phone: string;
    avatar: string;
  };
  created_at: Date;
  updated_at?: Date;
}
