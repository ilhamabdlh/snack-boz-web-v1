import { NextResponse } from "next/server";
import {
  estimateRoadDistanceKm,
  KITCHEN_LOCATION,
} from "@/lib/shipping";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") ?? "").trim();
  const placeName = (searchParams.get("placeName") ?? "").trim();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { error: "Koordinat alamat tidak valid." },
      { status: 400 },
    );
  }

  const distanceKm = estimateRoadDistanceKm(KITCHEN_LOCATION, { lat, lng });

  return NextResponse.json({
    address: address || placeName,
    placeName: placeName || address,
    lat,
    lng,
    distanceKm,
  });
}
