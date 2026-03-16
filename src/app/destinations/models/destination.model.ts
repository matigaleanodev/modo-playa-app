export type DestinationId = 'gesell' | 'pampas' | 'marazul';

export interface Destination {
  id: DestinationId;
  name: string;
}

export interface DestinationWeather {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
}

export interface DestinationForecastItem {
  day: 'today' | 'tomorrow';
  max: number;
  min: number;
}

export interface DestinationSun {
  sunrise: string;
  sunset: string;
}

export type PointOfInterestCategory =
  | 'healthcare'
  | 'safety'
  | 'downtown'
  | 'pharmacy'
  | 'beach'
  | 'landmark';

export interface PointOfInterest {
  id: string;
  title: string;
  category: PointOfInterestCategory;
  summary: string;
  googleMapsUrl: string;
  highlight: string;
  displayOrder: number;
}

export interface DestinationContext {
  destinationId: DestinationId;
  destination: string;
  timezone: string;
  weather: DestinationWeather;
  forecast: DestinationForecastItem[];
  sun: DestinationSun;
  pointsOfInterest: PointOfInterest[];
}
