export interface IReviewDTO {
  id: string;
  user_id: string;
  location_id: string;
  rating: number;
  review: string;
  users?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  created_at: Date;
  updated_at: Date;
}
