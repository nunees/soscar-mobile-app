export interface IVehicleDTO {
  id: string;
  user_id: string;
  brand_id: number;
  name_id: number;
  color: string;
  year: number;
  plate: string;
  engineMiles: number;
  isPrimary: boolean;
  create_at: Date;
  update_at: Date | null;
  brand: {
    id: number;
    name: string;
    icon: string;
  };
  name: {
    id: number;
    name: string;
    brand_id: number;
  };
}
