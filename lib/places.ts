export type PlaceSuggestion = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  lat: number;
  lng: number;
};

export type PlaceDetails = {
  address: string;
  placeName: string;
  lat: number;
  lng: number;
  distanceKm: number;
};

/** Identitas wajib untuk Nominatim (usage policy OSM). */
export const NOMINATIM_USER_AGENT =
  "PasarSenenKueSubuh/1.0 (https://pasarsenenkuesubuh.com; checkout-address)";

/** Bounding box kasar Jabodetabek untuk bias hasil pencarian. */
export const JABODETABEK_VIEWBOX = "106.40,-6.55,107.15,-5.95";
