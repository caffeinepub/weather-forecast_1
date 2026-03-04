import { Droplets, Sun, Thermometer, Wind } from "lucide-react";
import { motion } from "motion/react";
import { formatTemperature, getWeatherInfo } from "../types/weather";
import type { CurrentWeather } from "../types/weather";
import type { GeoLocation } from "../types/weather";

interface CurrentWeatherCardProps {
  location: GeoLocation;
  current: CurrentWeather;
  isCelsius: boolean;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide font-body">
          {label}
        </span>
      </div>
      <span className="text-base font-semibold text-foreground font-body">
        {value}
      </span>
    </div>
  );
}

export function CurrentWeatherCard({
  location,
  current,
  isCelsius,
}: CurrentWeatherCardProps) {
  const info = getWeatherInfo(current.weather_code);

  return (
    <motion.div
      data-ocid="weather.current.card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card rounded-2xl p-6 shadow-card"
    >
      {/* Location & Condition */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display leading-tight">
            {location.name}
          </h2>
          {location.country && (
            <p className="text-sm text-muted-foreground mt-0.5 font-body">
              {[location.admin1, location.country].filter(Boolean).join(", ")}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base">{info.emoji}</span>
            <span className="text-sm text-muted-foreground font-body">
              {info.description}
            </span>
          </div>
        </div>

        {/* Big weather emoji */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl leading-none select-none"
          aria-hidden="true"
        >
          {info.emoji}
        </motion.div>
      </div>

      {/* Main temperature */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="temp-display text-8xl leading-none tracking-tight"
        >
          {formatTemperature(current.temperature_2m, isCelsius)}
        </motion.div>
        <p className="text-muted-foreground text-sm mt-2 font-body">
          Feels like{" "}
          <span className="text-foreground font-medium">
            {formatTemperature(current.apparent_temperature, isCelsius)}
          </span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatItem
          icon={<Droplets className="h-3.5 w-3.5" />}
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
        />
        <StatItem
          icon={<Wind className="h-3.5 w-3.5" />}
          label="Wind"
          value={`${Math.round(current.wind_speed_10m)} km/h`}
        />
        <StatItem
          icon={<Sun className="h-3.5 w-3.5" />}
          label="UV Index"
          value={`${current.uv_index}`}
        />
        <StatItem
          icon={<Thermometer className="h-3.5 w-3.5" />}
          label="Precip."
          value={`${current.precipitation} mm`}
        />
      </div>
    </motion.div>
  );
}
