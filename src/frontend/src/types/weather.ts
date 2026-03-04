export interface GeoLocation {
  id: number;
  name: string;
  country: string;
  country_code: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeoLocation[];
}

export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  uv_index: number;
  precipitation: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  uv_index_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface WeatherInfo {
  emoji: string;
  description: string;
  bgClass: string;
}

export const weatherCodeMap: Record<number, WeatherInfo> = {
  0: { emoji: "☀️", description: "Clear sky", bgClass: "weather-clear" },
  1: { emoji: "⛅", description: "Mainly clear", bgClass: "weather-clear" },
  2: { emoji: "⛅", description: "Partly cloudy", bgClass: "weather-cloudy" },
  3: { emoji: "☁️", description: "Overcast", bgClass: "weather-cloudy" },
  45: { emoji: "🌫️", description: "Foggy", bgClass: "weather-fog" },
  48: { emoji: "🌫️", description: "Icy fog", bgClass: "weather-fog" },
  51: { emoji: "🌦️", description: "Light drizzle", bgClass: "weather-rain" },
  53: { emoji: "🌦️", description: "Moderate drizzle", bgClass: "weather-rain" },
  55: { emoji: "🌦️", description: "Dense drizzle", bgClass: "weather-rain" },
  61: { emoji: "🌧️", description: "Slight rain", bgClass: "weather-rain" },
  63: { emoji: "🌧️", description: "Moderate rain", bgClass: "weather-rain" },
  65: { emoji: "🌧️", description: "Heavy rain", bgClass: "weather-rain" },
  71: { emoji: "❄️", description: "Slight snow", bgClass: "weather-snow" },
  73: { emoji: "❄️", description: "Moderate snow", bgClass: "weather-snow" },
  75: { emoji: "❄️", description: "Heavy snow", bgClass: "weather-snow" },
  77: { emoji: "🌨️", description: "Snow grains", bgClass: "weather-snow" },
  80: { emoji: "🌧️", description: "Slight showers", bgClass: "weather-rain" },
  81: { emoji: "🌧️", description: "Moderate showers", bgClass: "weather-rain" },
  82: { emoji: "🌧️", description: "Violent showers", bgClass: "weather-rain" },
  85: {
    emoji: "🌨️",
    description: "Slight snow showers",
    bgClass: "weather-snow",
  },
  86: {
    emoji: "🌨️",
    description: "Heavy snow showers",
    bgClass: "weather-snow",
  },
  95: { emoji: "⛈️", description: "Thunderstorm", bgClass: "weather-storm" },
  96: {
    emoji: "⛈️",
    description: "Thunderstorm with hail",
    bgClass: "weather-storm",
  },
  99: {
    emoji: "⛈️",
    description: "Heavy thunderstorm with hail",
    bgClass: "weather-storm",
  },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return (
    weatherCodeMap[code] ?? {
      emoji: "🌤️",
      description: "Unknown",
      bgClass: "weather-cloudy",
    }
  );
}

export function formatTemperature(temp: number, isCelsius: boolean): string {
  return `${Math.round(temp)}°${isCelsius ? "C" : "F"}`;
}

export function formatDay(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatHour(timeStr: string): string {
  const date = new Date(timeStr);
  const now = new Date();

  if (date.getHours() === now.getHours() && date.getDate() === now.getDate()) {
    return "Now";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}
