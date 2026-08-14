"use client";

import {
  ADDRESSES_STORAGE_KEY,
  createOrderId,
  ORDERS_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  safeParseJson,
  type CheckoutProfile,
  type Order,
  type SavedAddress,
} from "@/lib/commerce";

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  return safeParseJson<Order[]>(localStorage.getItem(ORDERS_STORAGE_KEY), []);
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function saveOrder(order: Order) {
  const existing = loadOrders();
  saveOrders([order, ...existing]);
}

export function getOrderById(orderId: string): Order | null {
  if (typeof window === "undefined") return null;
  return loadOrders().find((order) => order.id === orderId) ?? null;
}

export function loadProfile(): CheckoutProfile | null {
  if (typeof window === "undefined") return null;
  return safeParseJson<CheckoutProfile | null>(localStorage.getItem(PROFILE_STORAGE_KEY), null);
}

export function saveProfile(profile: CheckoutProfile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function loadAddresses(): SavedAddress[] {
  if (typeof window === "undefined") return [];
  return safeParseJson<SavedAddress[]>(localStorage.getItem(ADDRESSES_STORAGE_KEY), []);
}

export function saveAddresses(addresses: SavedAddress[]) {
  localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
}

export function upsertAddressFromProfile(profile: CheckoutProfile) {
  const addresses = loadAddresses();
  const match = addresses.find(
    (item) => item.address === profile.address && item.placeName === profile.placeName,
  );
  if (match) return;
  const next: SavedAddress = {
    id: `addr-${Date.now()}`,
    label: profile.placeName || "Alamat pesanan",
    placeName: profile.placeName,
    address: profile.address,
    note: profile.deliveryNote,
  };
  saveAddresses([next, ...addresses].slice(0, 8));
}

export { createOrderId };
