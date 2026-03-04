import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
import {
  formatHour,
  formatTemperature,
  getWeatherInfo,
} from "../types/weather";
import type { HourlyWeather } from "../types/weather";

interface HourlyForecastProps {
  hourly: HourlyWeather;
  isCelsius: boolean;
}

export function HourlyForecast({ hourly, isCelsius }: HourlyForecastProps) {
  // Get next 24 hours starting from now
  const now = new Date();
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const displayIdx = startIdx >= 0 ? startIdx : 0;
  const hours = hourly.time.slice(displayIdx, displayIdx + 24);

  return (
    <motion.div
      data-ocid="weather.hourly.panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-2xl p-5 shadow-card"
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 font-body">
        Hourly Forecast
      </h3>

      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-3 scrollbar-thin min-w-max">
          {hours.map((timeStr, i) => {
            const idx = displayIdx + i;
            const info = getWeatherInfo(hourly.weather_code[idx]);
            const precipProb = hourly.precipitation_probability[idx];
            const isNow = i === 0;

            return (
              <motion.div
                key={timeStr}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl min-w-[72px] transition-all cursor-default
                  ${
                    isNow
                      ? "bg-primary/20 ring-1 ring-primary/40"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
              >
                <span
                  className={`text-xs font-semibold font-body whitespace-nowrap ${
                    isNow ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {formatHour(timeStr)}
                </span>
                <span className="text-xl leading-none">{info.emoji}</span>
                <span className="text-sm font-bold text-foreground font-display">
                  {formatTemperature(hourly.temperature_2m[idx], isCelsius)}
                </span>
                {precipProb > 0 && (
                  <span className="text-xs text-blue-400 font-body">
                    {precipProb}%
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
