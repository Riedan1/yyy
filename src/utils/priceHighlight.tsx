import { useState, useEffect } from "react";

export function usePriceUpdateHighlight(productId: string) {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!productId) return;

    const handlePriceUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ productId: string; direction: "up" | "down" }>;
      if (customEvent.detail && customEvent.detail.productId === productId) {
        setFlash(customEvent.detail.direction);
        const timer = setTimeout(() => {
          setFlash(null);
        }, 3500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("yume_price_updated", handlePriceUpdate);

    // Also verify if there is a recently saved price update in localStorage (within the last 15 seconds)
    try {
      const saved = localStorage.getItem("yume_recent_price_updates");
      if (saved) {
        const updates = JSON.parse(saved);
        const item = updates[productId];
        if (item && Date.now() - item.timestamp < 15000) {
          setFlash(item.direction);
          const timer = setTimeout(() => {
            setFlash(null);
          }, 15000 - (Date.now() - item.timestamp));
          return () => clearTimeout(timer);
        }
      }
    } catch (err) {
      console.warn("Failed to parse recent price updates from localStorage:", err);
    }

    return () => {
      window.removeEventListener("yume_price_updated", handlePriceUpdate);
    };
  }, [productId]);

  return flash;
}

export function notifyPriceUpdate(productId: string, oldPrice: number, newPrice: number) {
  if (!productId || oldPrice === newPrice) return;

  const direction = newPrice > oldPrice ? "up" : "down";

  // 1. Dispatch custom event for active tabs/cards
  const event = new CustomEvent("yume_price_updated", {
    detail: { productId, direction, oldPrice, newPrice },
  });
  window.dispatchEvent(event);

  // 2. Persist in localStorage so if cards rerender/refresh within 15 seconds, they still animate
  try {
    const saved = localStorage.getItem("yume_recent_price_updates");
    const updates = saved ? JSON.parse(saved) : {};
    updates[productId] = {
      direction,
      timestamp: Date.now(),
    };
    // Clean up older items to prevent bloating
    const now = Date.now();
    for (const key in updates) {
      if (now - updates[key].timestamp > 60000) {
        delete updates[key];
      }
    }
    localStorage.setItem("yume_recent_price_updates", JSON.stringify(updates));
  } catch (err) {
    console.warn("Failed to write price update to localStorage:", err);
  }
}
