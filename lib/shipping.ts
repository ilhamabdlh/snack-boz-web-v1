/** Lokasi dapur Pasar Senen Kue Subuh (Pasar Senen Jaya, Jakarta Pusat). */
export const KITCHEN_LOCATION = {
  lat: -6.1768,
  lng: 106.8413,
  label: "Pasar Senen Jaya, Jakarta Pusat",
} as const;

/** Slot jam antar (setengah jam). */
export const DELIVERY_TIME_SLOTS = [
  "06.00",
  "06.30",
  "07.00",
  "07.30",
  "08.00",
  "08.30",
  "09.00",
  "09.30",
  "10.00",
  "10.30",
  "11.00",
  "11.30",
  "12.00",
  "12.30",
  "13.00",
  "13.30",
  "14.00",
  "14.30",
  "15.00",
  "15.30",
  "16.00",
  "16.30",
  "17.00",
] as const;

/**
 * Estimasi tarif Instant Jabodetabek (mirip struktur tarif Gojek/Grab Instant).
 * Motor: min Rp 18.500, ~Rp 2.815/km
 * Mobil: min Rp 28.500, ~Rp 5.500/km
 */
export const GOSEND_RATES = {
  motor: {
    id: "gosend-motor" as const,
    label: "Gojek/Grab Instant Motor",
    minFee: 18_500,
    perKm: 2_815,
  },
  car: {
    id: "gosend-mobil" as const,
    label: "Gojek/Grab Instant Mobil",
    minFee: 28_500,
    perKm: 5_500,
  },
} as const;

export type ShippingMethodId =
  | "gosend-motor"
  | "gosend-mobil"
  | "pickup"
  | "self-delivery";

export type ShippingOption = {
  id: ShippingMethodId;
  label: string;
  fee: number;
  distanceKm?: number;
};

export function calcGoSendFee(
  kind: keyof typeof GOSEND_RATES,
  distanceKm: number,
) {
  const rate = GOSEND_RATES[kind];
  const km = Math.max(0, distanceKm);
  return Math.max(rate.minFee, Math.round(km * rate.perKm));
}

/** Haversine distance in km, then city road factor (~1.35x). */
export function estimateRoadDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  const haversine = 2 * R * Math.asin(Math.sqrt(a));
  return Math.round(haversine * 1.35 * 10) / 10;
}

const FREE_SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "pickup",
    label: "Ambil di dapur (Pasar Senen Jaya)",
    fee: 0,
  },
  {
    id: "self-delivery",
    label: "Gunakan pengiriman sendiri",
    fee: 0,
  },
];

export function buildShippingOptions(distanceKm: number | null): ShippingOption[] {
  if (distanceKm == null || Number.isNaN(distanceKm)) {
    return [
      {
        id: GOSEND_RATES.motor.id,
        label: GOSEND_RATES.motor.label,
        fee: GOSEND_RATES.motor.minFee,
      },
      {
        id: GOSEND_RATES.car.id,
        label: GOSEND_RATES.car.label,
        fee: GOSEND_RATES.car.minFee,
      },
      ...FREE_SHIPPING_OPTIONS,
    ];
  }

  return [
    {
      id: GOSEND_RATES.motor.id,
      label: GOSEND_RATES.motor.label,
      fee: calcGoSendFee("motor", distanceKm),
      distanceKm,
    },
    {
      id: GOSEND_RATES.car.id,
      label: GOSEND_RATES.car.label,
      fee: calcGoSendFee("car", distanceKm),
      distanceKm,
    },
    ...FREE_SHIPPING_OPTIONS,
  ];
}
