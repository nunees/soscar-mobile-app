export interface ISearchAssistanceDTO {
  name: string;
  opening_hours: {
    open_now: boolean;
  };
  rating: number;
  user_ratings_total: number;
  phone_number?: string;
  vicinity: string;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos: {
    html_attributions: string[];
    photo_reference: string;
  }[];
}