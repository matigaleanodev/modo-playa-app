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

export interface DestinationContext {
  destination: string;
  weather: DestinationWeather;
  forecast: DestinationForecastItem[];
  sun: DestinationSun;
}
