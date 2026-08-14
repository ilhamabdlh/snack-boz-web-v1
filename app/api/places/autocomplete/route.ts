import { NextResponse } from "next/server";
import {
  JABODETABEK_VIEWBOX,
  NOMINATIM_USER_AGENT,
  type PlaceSuggestion,
} from "@/lib/places";

type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  address?: {
    road?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = (searchParams.get("q") ?? "").trim();

  if (input.length < 3) {
    return NextResponse.json({ suggestions: [] as PlaceSuggestion[] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", input);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "id");
  url.searchParams.set("viewbox", JABODETABEK_VIEWBOX);
  url.searchParams.set("bounded", "0");
  url.searchParams.set("accept-language", "id");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": NOMINATIM_USER_AGENT,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          suggestions: [],
          error: "Gagal mencari alamat. Coba lagi sebentar.",
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as NominatimResult[];

    const suggestions: PlaceSuggestion[] = data
      .map((item) => {
        const lat = Number(item.lat);
        const lng = Number(item.lon);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

        const city =
          item.address?.city ??
          item.address?.town ??
          item.address?.municipality ??
          item.address?.village ??
          item.address?.state ??
          "";
        const district =
          item.address?.suburb ?? item.address?.city_district ?? item.address?.road ?? "";
        const mainText = item.name?.trim() || item.display_name.split(",")[0]?.trim() || "Lokasi";
        const secondaryText = [district, city].filter(Boolean).join(", ") || item.display_name;

        return {
          placeId: String(item.place_id),
          description: item.display_name,
          mainText,
          secondaryText,
          lat,
          lng,
        } satisfies PlaceSuggestion;
      })
      .filter((item): item is PlaceSuggestion => item !== null);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { suggestions: [], error: "Gagal menghubungi layanan pencarian alamat." },
      { status: 502 },
    );
  }
}
