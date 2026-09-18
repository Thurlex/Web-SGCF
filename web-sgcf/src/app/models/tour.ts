export interface Tour {
  id: number;
  price: number;
  countryTour: string;
  kmOftour: number;
  nameOfTour: string;
  locations: string;
  reservationCount: number;
}

export interface TourForm {
  price: number | null;
  countryTour: string;
  kmOftour: number | null;
  nameOfTour: string;
  locations: string;
}
