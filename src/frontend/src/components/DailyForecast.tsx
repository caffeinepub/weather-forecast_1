import { motion } from "motion/react";
import { formatDay, formatTemperature, getWeatherInfo } from "../types/weather";
import type { DailyWeather } from "../types/weather";

interface DailyForecastProps {
  daily: DailyWeather;
  isCelsius: boolean;
}

const ocidItems = [
  "forecast.item.1",
  "forecast.item.2",
  "forecast.item.3",
  "forecast.item.4",
  "forecast.item.5",
  "forecast.item.6",
  "forecast.item.7",
];

export function DailyForecast({ daily, isCelsius }: DailyForecastProps) {
  const days = daily.time.slice(0, 7);
  const maxTemp = Math.max(...daily.temperature_2m_max);
  const minTemp = Math.min(...daily.temperature_2m_min);

  return (
    <motion.div
      data-ocid="weather.forecast.panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card rounded-2xl p-5 shadow-card"
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4 font-body">
        7-Day Forecast
      </h3>

      <div className="space-y-1">
        {days.map((dateStr, i) => {
          const info = getWeatherInfo(daily.weather_code[i]);
          const high = daily.temperature_2m_max[i];
          const low = daily.temperature_2m_min[i];
          const precip = daily.precipitation_sum[i];

          // Temperature bar range
          const barWidth =
            maxTemp > minTemp
              ? ((high - minTemp) / (maxTemp - minTemp)) * 100
              : 100;
          const barOffset =
            maxTemp > minTemp
              ? ((low - minTemp) / (maxTemp - minTemp)) * 100
              : 0;

          return (
            <motion.div
              key={dateStr}
              data-ocid={ocidItems[i] ?? `forecast.item.${i + 1}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default"
            >
              {/* Day name */}
              <span className="text-sm font-semibold text-foreground w-16 shrink-0 font-body">
                {formatDay(dateStr)}
              </span>

              {/* Icon + condition */}
              <div className="flex items-center gap-1.5 w-20 shrink-0">
                <span className="text-lg">{info.emoji}</span>
                {precip > 0 && (
                  <span className="text-xs text-blue-400 font-body">
                    {precip.toFixed(1)}mm
                  </span>
                )}
              </div>

              {/* Temperature bar */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-xs text-muted-foreground w-10 text-right shrink-0 font-body">
                  {formatTemperature(low, isCelsius)}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth - barOffset}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-amber-300 to-orange-400"
                    style={{ left: `${barOffset}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground w-10 shrink-0 font-body">
                  {formatTemperature(high, isCelsius)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
