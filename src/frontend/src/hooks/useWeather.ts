import { useCallback, useState } from "react";
import type {
  GeoLocation,
  GeocodingResponse,
  WeatherResponse,
} from "../types/weather";

export interface WeatherState {
  location: GeoLocation | null;
  weather: WeatherResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    location: null,
    weather: null,
    isLoading: false,
    error: null,
  });

  const fetchWeather = useCallback(
    async (location: GeoLocation, isCelsius: boolean) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const params = new URLSearchParams({
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,precipitation",
          hourly: "temperature_2m,weather_code,precipitation_probability",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max",
          forecast_days: "7",
          timezone: "auto",
          wind_speed_unit: "kmh",
        });

        if (!isCelsius) {
          params.set("temperature_unit", "fahrenheit");
        }

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
        );
        if (!res.ok) throw new Error("Failed to fetch weather data");
        const data: WeatherResponse = await res.json();

        setState({
          location,
          weather: data,
          isLoading: false,
          error: null,
        });

        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch weather";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        return null;
      }
    },
    [],
  );

  const searchCities = useCallback(
    async (query: string): Promise<GeoLocation[]> => {
      if (!query.trim()) return [];
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
        );
        if (!res.ok) throw new Error("Geocoding failed");
        const data: GeocodingResponse = await res.json();
        return data.results ?? [];
      } catch {
        return [];
      }
    },
    [],
  );

  const fetchByCoords = useCallback(
    async (
      lat: number,
      lon: number,
      isCelsius: boolean,
    ): Promise<GeoLocation | null> => {
      try {
        // Use geocoding to reverse-lookup the nearest city
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=&count=1&language=en&format=json&latitude=${lat}&longitude=${lon}`,
        );

        // Geocoding doesn't support reverse geocoding, so we create a synthetic location
        const location: GeoLocation = {
          id: -1,
          name: "Current Location",
          country: "",
          country_code: "",
          latitude: lat,
          longitude: lon,
        };

        // Try to find a city name from the Open-Meteo API
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
        );
        if (weatherRes.ok) {
          // We have coords, fetch weather with a generic location name
        }
        void res;

        await fetchWeather(location, isCelsius);
        return location;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Geolocation failed";
        setState((prev) => ({ ...prev, error: message, isLoading: false }));
        return null;
      }
    },
    [fetchWeather],
  );

  return {
    ...state,
    fetchWeather,
    searchCities,
    fetchByCoords,
  };
}
