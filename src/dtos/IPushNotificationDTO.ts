export interface IPushNotificationDTO {
  id: string;
  user_id: string;
  title: string;
  body: string;
  channel: string;
  received?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
