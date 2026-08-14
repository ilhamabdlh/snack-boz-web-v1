"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PlaceSuggestion } from "@/lib/places";

export type SelectedPlace = {
  address: string;
  placeName: string;
  lat: number;
  lng: number;
  distanceKm: number;
};

type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: SelectedPlace) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Ketik alamat (min. 3 karakter)...",
  className,
  required,
}: AddressAutocompleteProps) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [error, setError] = useState("");
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 3 || picking) {
      setSuggestions([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `/api/places/autocomplete?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const data = (await res.json()) as {
          suggestions?: PlaceSuggestion[];
          error?: string;
        };
        setSuggestions(data.suggestions ?? []);
        setError(data.error ?? "");
        setOpen(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Gagal memuat saran alamat.");
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value, picking]);

  async function pickSuggestion(item: PlaceSuggestion) {
    setPicking(true);
    setOpen(false);
    setSuggestions([]);
    onChange(item.description);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: String(item.lat),
        lng: String(item.lng),
        address: item.description,
        placeName: item.mainText,
      });
      const res = await fetch(`/api/places/details?${params.toString()}`);
      const data = (await res.json()) as SelectedPlace & { error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "Gagal mengambil detail alamat.");
        return;
      }
      onChange(data.address || item.description);
      onPlaceSelected({
        address: data.address || item.description,
        placeName: data.placeName || item.mainText,
        lat: data.lat,
        lng: data.lng,
        distanceKm: data.distanceKm,
      });
      setError("");
    } catch {
      setError("Gagal mengambil detail alamat.");
    } finally {
      setLoading(false);
      window.setTimeout(() => setPicking(false), 400);
    }
  }

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
        <Input
          className="pl-10 pr-9"
          value={value}
          required={required}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          onChange={(event) => {
            setPicking(false);
            onChange(event.target.value);
          }}
          onFocus={() => {
            if (suggestions.length) setOpen(true);
          }}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-[var(--muted)]" />
        ) : null}
      </div>

      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-[var(--z-dropdown)] mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius-sm)] border border-[var(--line)] bg-white py-1 shadow-[var(--shadow)]"
        >
          {suggestions.map((item) => (
            <li key={item.placeId}>
              <button
                type="button"
                role="option"
                className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--yellow-soft)]"
                onClick={() => pickSuggestion(item)}
              >
                <span className="font-medium text-[var(--palm)]">{item.mainText}</span>
                {item.secondaryText ? (
                  <span className="text-xs text-[var(--muted)]">{item.secondaryText}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="mt-1.5 text-xs text-amber-800">{error}</p> : null}
      {!error && value.trim().length > 0 && value.trim().length < 3 ? (
        <p className="mt-1.5 text-xs text-[var(--muted)]">
          Ketik minimal 3 karakter untuk mencari alamat.
        </p>
      ) : null}
    </div>
  );
}
