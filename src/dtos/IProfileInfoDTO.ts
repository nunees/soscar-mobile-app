export interface IProfileInfoDTO {
  name: string;
  last_name: string;
  phone: string;
  cpf: string;
  genderId: number;
  birth_date: Date;
  latitude?: number | null;
  longitude?: number | null;
}
