import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AlertCircle, CloudSun, MapPin, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdUnit } from "./components/AdUnit";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { DailyForecast } from "./components/DailyForecast";
import { HourlyForecast } from "./components/HourlyForecast";
import { SearchBar } from "./components/SearchBar";
import { WeatherSkeleton } from "./components/WeatherSkeleton";
import { useActor } from "./hooks/useActor";
import { useWeather } from "./hooks/useWeather";
import { getWeatherInfo } from "./types/weather";
import type { GeoLocation } from "./types/weather";

export default function App() {
  const { actor, isFetching: isActorFetching } = useActor();
  const [isCelsius, setIsCelsius] = useState(true);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const {
    location,
    weather,
    isLoading,
    error,
    fetchWeather,
    searchCities,
    fetchByCoords,
  } = useWeather();

  // Load saved preferences
  useEffect(() => {
    if (!actor || isActorFetching || prefsLoaded) return;

    actor
      .getPreferences()
      .then((prefs) => {
        setPrefsLoaded(true);
        if (prefs.city && prefs.latitude && prefs.longitude) {
          setIsCelsius(prefs.inCelsius);
          const savedLocation: GeoLocation = {
            id: -1,
            name: prefs.city,
            country: "",
            country_code: "",
            latitude: prefs.latitude,
            longitude: prefs.longitude,
          };
          fetchWeather(savedLocation, prefs.inCelsius);
        } else {
          setPrefsLoaded(true);
        }
      })
      .catch(() => {
        setPrefsLoaded(true);
      });
  }, [actor, isActorFetching, prefsLoaded, fetchWeather]);

  const handleSelectCity = useCallback(
    async (loc: GeoLocation) => {
      await fetchWeather(loc, isCelsius);
      if (actor) {
        actor
          .savePreferences(loc.name, loc.latitude, loc.longitude, isCelsius)
          .catch(() => toast.error("Failed to save preferences"));
      }
    },
    [fetchWeather, isCelsius, actor],
  );

  const handleToggleUnit = useCallback(
    async (checked: boolean) => {
      const newIsCelsius = checked;
      setIsCelsius(newIsCelsius);
      if (location) {
        await fetchWeather(location, newIsCelsius);
        if (actor) {
          actor
            .savePreferences(
              location.name,
              location.latitude,
              location.longitude,
              newIsCelsius,
            )
            .catch(() => {});
        }
      }
    },
    [location, fetchWeather, actor],
  );

  const handleGeolocate = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await fetchByCoords(
          pos.coords.latitude,
          pos.coords.longitude,
          isCelsius,
        );
        if (loc && actor) {
          actor
            .savePreferences(loc.name, loc.latitude, loc.longitude, isCelsius)
            .catch(() => {});
        }
        setIsGeolocating(false);
      },
      (err) => {
        toast.error(`Location error: ${err.message}`);
        setIsGeolocating(false);
      },
      { timeout: 10000 },
    );
  }, [fetchByCoords, isCelsius, actor]);

  // Determine weather background class
  const bgClass = weather
    ? getWeatherInfo(weather.current.weather_code).bgClass
    : "weather-clear";

  return (
    <div
      className={cn("min-h-screen transition-all duration-1000", bgClass)}
      style={{
        background: `radial-gradient(ellipse at 20% 20%, oklch(var(--bg-from, 0.25 0.1 220) / 0.9), transparent 60%),
                     radial-gradient(ellipse at 80% 80%, oklch(var(--bg-to, 0.14 0.04 250) / 0.8), transparent 60%),
                     oklch(0.13 0.03 250)`,
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header */}
        <header className="py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl glass-card flex items-center justify-center">
              <CloudSun className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground font-display leading-none">
                SkyPulse
              </h1>
              <p className="text-[11px] text-muted-foreground font-body leading-none mt-0.5">
                Live weather forecast
              </p>
            </div>
          </div>

          {/* Unit toggle */}
          <div
            data-ocid="unit.toggle"
            className="flex items-center gap-2 glass-card rounded-xl px-4 py-2.5"
          >
            <Label
              htmlFor="unit-toggle"
              className={cn(
                "text-sm font-semibold font-body cursor-pointer transition-colors",
                !isCelsius ? "text-foreground" : "text-muted-foreground",
              )}
            >
              °F
            </Label>
            <Switch
              id="unit-toggle"
              checked={isCelsius}
              onCheckedChange={handleToggleUnit}
              className="data-[state=checked]:bg-primary/60"
            />
            <Label
              htmlFor="unit-toggle"
              className={cn(
                "text-sm font-semibold font-body cursor-pointer transition-colors",
                isCelsius ? "text-foreground" : "text-muted-foreground",
              )}
            >
              °C
            </Label>
          </div>
        </header>

        {/* Top Banner Ad */}
        <AdUnit
          data-ocid="ad.top.panel"
          className="mb-5 h-[60px] sm:h-[90px] w-full"
        />

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSelectCity={handleSelectCity}
            onGeolocate={handleGeolocate}
            isGeolocating={isGeolocating}
            searchCities={searchCities}
          />
        </div>

        {/* Main content grid */}
        <div className="flex gap-6">
          {/* Main weather content */}
          <main className="flex-1 min-w-0 space-y-4">
            <AnimatePresence mode="wait">
              {/* Loading state */}
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <WeatherSkeleton />
                </motion.div>
              )}

              {/* Error state */}
              {!isLoading && error && (
                <motion.div
                  key="error"
                  data-ocid="weather.error_state"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8 text-center"
                >
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-1 font-display">
                    Unable to fetch weather
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Empty state */}
              {!isLoading && !error && !weather && prefsLoaded && (
                <motion.div
                  key="empty"
                  data-ocid="weather.empty_state"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-12 text-center"
                >
                  <div className="text-7xl mb-5 select-none" aria-hidden>
                    🌍
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 font-display">
                    Where in the world?
                  </h3>
                  <p className="text-muted-foreground font-body mb-6 max-w-sm mx-auto text-sm leading-relaxed">
                    Search for any city to get live weather data, hourly
                    forecasts, and a 7-day outlook.
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-body glass-card rounded-xl px-4 py-2.5">
                      <Search className="h-4 w-4" />
                      <span>Search a city above</span>
                    </div>
                    <span className="text-muted-foreground/40 text-sm font-body">
                      or
                    </span>
                    <Button
                      onClick={handleGeolocate}
                      disabled={isGeolocating}
                      className="flex items-center gap-2 glass-card border-0 bg-primary/20 hover:bg-primary/30 text-foreground rounded-xl h-10 text-sm font-body"
                    >
                      <MapPin className="h-4 w-4" />
                      Use my location
                    </Button>
                  </div>

                  {/* Sample locations */}
                  <div className="mt-8 pt-6 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-3 font-body uppercase tracking-wider">
                      Popular cities
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        {
                          name: "New York",
                          country: "US",
                          country_code: "US",
                          latitude: 40.7128,
                          longitude: -74.006,
                        },
                        {
                          name: "London",
                          country: "UK",
                          country_code: "GB",
                          latitude: 51.5074,
                          longitude: -0.1278,
                        },
                        {
                          name: "Tokyo",
                          country: "Japan",
                          country_code: "JP",
                          latitude: 35.6762,
                          longitude: 139.6503,
                        },
                        {
                          name: "Sydney",
                          country: "Australia",
                          country_code: "AU",
                          latitude: -33.8688,
                          longitude: 151.2093,
                        },
                        {
                          name: "Paris",
                          country: "France",
                          country_code: "FR",
                          latitude: 48.8566,
                          longitude: 2.3522,
                        },
                      ].map((city) => (
                        <button
                          type="button"
                          key={city.name}
                          onClick={() =>
                            handleSelectCity({
                              ...city,
                              id: Math.random(),
                              admin1: undefined,
                              timezone: "auto",
                            })
                          }
                          className="text-sm text-muted-foreground hover:text-foreground glass-card rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors font-body"
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Weather data */}
              {!isLoading && !error && weather && location && (
                <motion.div
                  key="weather"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <CurrentWeatherCard
                    location={location}
                    current={weather.current}
                    isCelsius={isCelsius}
                  />

                  <HourlyForecast
                    hourly={weather.hourly}
                    isCelsius={isCelsius}
                  />

                  {/* Middle ad */}
                  <AdUnit
                    data-ocid="ad.middle.panel"
                    className="h-[60px] w-full"
                  />

                  <DailyForecast daily={weather.daily} isCelsius={isCelsius} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:flex flex-col gap-4 w-[300px] shrink-0">
            <AdUnit data-ocid="ad.sidebar.panel" className="h-[250px] w-full" />

            {/* Weather info tips card */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3 font-display">
                Weather Index Guide
              </h4>
              <div className="space-y-2.5">
                {[
                  {
                    label: "UV Index 0-2",
                    desc: "Low — no protection needed",
                    color: "bg-green-500",
                  },
                  {
                    label: "UV Index 3-5",
                    desc: "Moderate — wear sunscreen",
                    color: "bg-yellow-400",
                  },
                  {
                    label: "UV Index 6-7",
                    desc: "High — limit sun exposure",
                    color: "bg-orange-400",
                  },
                  {
                    label: "UV Index 8+",
                    desc: "Very high — stay indoors",
                    color: "bg-red-500",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color}`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-foreground font-body">
                        {item.label}
                      </div>
                      <div className="text-xs text-muted-foreground font-body">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second sidebar ad */}
            <AdUnit className="h-[250px] w-full" />
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground/50 font-body">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
            . Weather data by{" "}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors underline underline-offset-2"
            >
              Open-Meteo
            </a>
            .
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}
