export interface ILocationScheduleDTO {
  id?: string;
  user_id: string;
  vehicle_id: string;
  service_type_id: number | null;
  location_id: string;
  date: Date;
  time: string;
  description?: string | null;
  status: number;
  latitude: string;
  longitude: string;
  partner_notes?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}
