import { Skeleton } from "@/components/ui/skeleton";

const STAT_KEYS = ["humidity", "wind", "uv", "precip"];
const HOUR_KEYS = ["h0", "h1", "h2", "h3", "h4", "h5", "h6", "h7"];
const DAY_KEYS = ["d0", "d1", "d2", "d3", "d4", "d5", "d6"];

export function WeatherSkeleton() {
  return (
    <div
      data-ocid="weather.loading_state"
      className="space-y-4 animate-fade-in"
    >
      {/* Current weather skeleton */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40 bg-white/10" />
            <Skeleton className="h-4 w-28 bg-white/8" />
            <Skeleton className="h-4 w-24 bg-white/8" />
          </div>
          <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
        </div>
        <Skeleton className="h-20 w-48 bg-white/10 mb-3" />
        <Skeleton className="h-4 w-36 bg-white/8" />
        <div className="grid grid-cols-4 gap-2 mt-4">
          {STAT_KEYS.map((k) => (
            <Skeleton key={k} className="h-16 rounded-xl bg-white/8" />
          ))}
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="glass-card rounded-2xl p-5">
        <Skeleton className="h-4 w-28 bg-white/8 mb-4" />
        <div className="flex gap-3">
          {HOUR_KEYS.map((k) => (
            <Skeleton key={k} className="h-24 w-18 rounded-xl bg-white/8" />
          ))}
        </div>
      </div>

      {/* Daily skeleton */}
      <div className="glass-card rounded-2xl p-5">
        <Skeleton className="h-4 w-28 bg-white/8 mb-4" />
        <div className="space-y-2">
          {DAY_KEYS.map((k) => (
            <Skeleton key={k} className="h-12 rounded-xl bg-white/8" />
          ))}
        </div>
      </div>
    </div>
  );
}
