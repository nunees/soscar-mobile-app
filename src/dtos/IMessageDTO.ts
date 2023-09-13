export interface IMessageDTO {
  id: string;
  sender_id: string;
  sender_avatar: string;
  receiver_id: string;
  receiver_avatar: string;
  content: string;
  status: number;
  created_at: Date;
}
