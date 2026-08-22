"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  calcCartTotal,
  calcSubtotal,
  CART_STORAGE_KEY,
  COUPONS,
  createCartItemId,
  safeParseJson,
  SNACK_BOX_MIN_QTY,
  type CartItem,
  type CartState,
} from "@/lib/commerce";

type AddProductInput = {
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  minOrder: number;
  note?: string;
  variantId?: string;
  variantName?: string;
  exemptFromMixedMin?: boolean;
};

type AddSnackBoxInput = {
  slug?: string;
  name?: string;
  boxSize: string;
  unitPrice: number;
  qty: number;
  image: string;
  snacks: { name: string; qty: number }[];
  eventDate?: string;
  note?: string;
  withWater?: boolean;
};

type CartContextValue = {
  items: CartItem[];
  coupon?: string;
  ready: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  addProduct: (input: AddProductInput) => void;
  addSnackBox: (input: AddSnackBoxInput) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  setNote: (id: string, note: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  clearCart: () => void;
  replaceItems: (items: CartItem[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const emptyCart: CartState = { items: [] };

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(emptyCart);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = safeParseJson<CartState>(localStorage.getItem(CART_STORAGE_KEY), emptyCart);
    setState({
      items: Array.isArray(stored.items) ? stored.items : [],
      coupon: stored.coupon,
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const addProduct = useCallback((input: AddProductInput) => {
    const id = createCartItemId("product", input.slug, input.variantId);
    const qty = Math.max(1, input.qty);
    const displayName = input.variantName
      ? `${input.name} (${input.variantName})`
      : input.name;
    setState((prev) => {
      const existing = prev.items.find((item) => item.id === id);
      const minOrder = Math.max(1, input.minOrder || 1);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  qty: item.qty + qty,
                  note: input.note ?? item.note,
                  minOrder,
                  unitPrice: input.unitPrice,
                  name: displayName,
                  meta: {
                    ...item.meta,
                    variantId: input.variantId,
                    variantName: input.variantName,
                    exemptFromMixedMin: input.exemptFromMixedMin,
                  },
                }
              : item,
          ),
        };
      }
      const next: CartItem = {
        id,
        kind: "product",
        slug: input.slug,
        name: displayName,
        image: input.image,
        unitPrice: input.unitPrice,
        qty,
        minOrder,
        note: input.note,
        meta: {
          variantId: input.variantId,
          variantName: input.variantName,
          exemptFromMixedMin: input.exemptFromMixedMin,
        },
      };
      return { ...prev, items: [...prev.items, next] };
    });
  }, []);

  const addSnackBox = useCallback((input: AddSnackBoxInput) => {
    const slug =
      input.slug ?? `custom-${input.boxSize.toLowerCase().replace(/\s+/g, "-")}`;
    const id = createCartItemId("snack-box", slug, input.boxSize);
    const displayName = input.name ?? `Snack Box ${input.boxSize}`;
    setState((prev) => {
      const existing = prev.items.find((item) => item.id === id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  qty: item.qty + input.qty,
                  unitPrice: input.unitPrice,
                  name: displayName,
                  note: input.note ?? item.note,
                  meta: {
                    boxSize: input.boxSize,
                    snacks: input.snacks,
                    eventDate: input.eventDate,
                    withWater: input.withWater,
                  },
                }
              : item,
          ),
        };
      }
      const next: CartItem = {
        id,
        kind: "snack-box",
        slug,
        name: displayName,
        image: input.image,
        unitPrice: input.unitPrice,
        qty: Math.max(SNACK_BOX_MIN_QTY, input.qty),
        minOrder: SNACK_BOX_MIN_QTY,
        note: input.note,
        meta: {
          boxSize: input.boxSize,
          snacks: input.snacks,
          eventDate: input.eventDate,
          withWater: input.withWater,
        },
      };
      return { ...prev, items: [...prev.items, next] };
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setState((prev) => ({
      ...prev,
      items: prev.items
        .map((item) => {
          if (item.id !== id) return item;
          if (item.kind === "product") {
            const enforceMin =
              Boolean(item.meta?.exemptFromMixedMin) && item.minOrder > 1;
            if (qty <= 0) return { ...item, qty: 0 };
            return {
              ...item,
              qty: enforceMin ? Math.max(item.minOrder, qty) : Math.max(0, qty),
            };
          }
          return { ...item, qty: Math.max(item.minOrder, qty) };
        })
        .filter((item) => item.qty > 0),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const setNote = useCallback((id: string, note: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, note } : item)),
    }));
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      return { ok: false, message: "Masukkan kode kupon." };
    }
    if (!COUPONS[normalized]) {
      return { ok: false, message: "Kupon tidak ditemukan." };
    }
    setState((prev) => ({ ...prev, coupon: normalized }));
    return { ok: true, message: `Kupon ${normalized} dipasang.` };
  }, []);

  const clearCoupon = useCallback(() => {
    setState((prev) => ({ ...prev, coupon: undefined }));
  }, []);

  const clearCart = useCallback(() => {
    setState(emptyCart);
  }, []);

  const replaceItems = useCallback((items: CartItem[]) => {
    setState((prev) => ({ ...prev, items }));
  }, []);

  const totals = useMemo(
    () => calcCartTotal(state.items, state.coupon),
    [state.items, state.coupon],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      coupon: state.coupon,
      ready,
      itemCount: state.items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: calcSubtotal(state.items),
      discount: totals.discount,
      addProduct,
      addSnackBox,
      setQty,
      removeItem,
      setNote,
      applyCoupon,
      clearCoupon,
      clearCart,
      replaceItems,
    }),
    [
      state.items,
      state.coupon,
      ready,
      totals.discount,
      addProduct,
      addSnackBox,
      setQty,
      removeItem,
      setNote,
      applyCoupon,
      clearCoupon,
      clearCart,
      replaceItems,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return ctx;
}
