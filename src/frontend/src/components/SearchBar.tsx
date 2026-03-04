import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GeoLocation } from "../types/weather";

interface SearchBarProps {
  onSelectCity: (location: GeoLocation) => void;
  onGeolocate: () => void;
  isGeolocating: boolean;
  searchCities: (query: string) => Promise<GeoLocation[]>;
}

export function SearchBar({
  onSelectCity,
  onGeolocate,
  isGeolocating,
  searchCities,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      setIsSearching(true);
      const cities = await searchCities(q);
      setResults(cities);
      setShowDropdown(cities.length > 0);
      setIsSearching(false);
    },
    [searchCities],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => performSearch(query), 350);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(location: GeoLocation) {
    setQuery(`${location.name}, ${location.country}`);
    setShowDropdown(false);
    onSelectCity(location);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0]);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  return (
    <div className="relative flex items-center gap-2 w-full max-w-xl">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>

        <Input
          ref={inputRef}
          data-ocid="search.search_input"
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          className={cn(
            "pl-9 pr-9 h-11 glass-card border-0 text-foreground placeholder:text-muted-foreground/60",
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
            "bg-transparent font-body text-sm rounded-xl",
          )}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass-card rounded-xl overflow-hidden shadow-card"
          >
            {results.map((city) => (
              <button
                type="button"
                key={city.id}
                onClick={() => handleSelect(city)}
                className={cn(
                  "w-full text-left px-4 py-3 flex items-center gap-3",
                  "hover:bg-white/5 transition-colors",
                  "border-b border-border/30 last:border-b-0",
                )}
              >
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate font-body">
                    {city.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate font-body">
                    {[city.admin1, city.country].filter(Boolean).join(", ")}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit button */}
      <Button
        data-ocid="search.button"
        onClick={() => results.length > 0 && handleSelect(results[0])}
        disabled={!query || isSearching}
        className={cn(
          "h-11 px-4 rounded-xl glass-card border-0",
          "bg-primary/20 hover:bg-primary/30 text-primary-foreground",
          "disabled:opacity-40 transition-all",
        )}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Geolocation button */}
      <Button
        data-ocid="geolocation.button"
        onClick={onGeolocate}
        disabled={isGeolocating}
        variant="outline"
        className={cn(
          "h-11 px-4 rounded-xl glass-card border-0",
          "hover:bg-white/10 text-muted-foreground hover:text-foreground",
          "disabled:opacity-40 transition-all",
        )}
        aria-label="Use my location"
        title="Use my current location"
      >
        {isGeolocating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
