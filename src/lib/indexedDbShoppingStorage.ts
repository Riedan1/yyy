export interface ShoppingListItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  updatedAt?: number;
}

const DB_NAME = "SmartShoppingDB";
const STORE_NAME = "shopping_list_items";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function initShoppingDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("checked", "checked", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.error("IndexedDB open error:", (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

export async function getAllShoppingItemsIndexedDB(): Promise<ShoppingListItem[]> {
  try {
    const db = await initShoppingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as ShoppingListItem[]);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn("IndexedDB read failed, falling back to localStorage:", err);
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("dz_shopping_list_items");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }
}

export async function saveAllShoppingItemsIndexedDB(items: ShoppingListItem[]): Promise<void> {
  // Always update localStorage as well for instant synchronous backup
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("dz_shopping_list_items", JSON.stringify(items));
    }
  } catch (e) {
    console.error("Failed localStorage backup:", e);
  }

  try {
    const db = await initShoppingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      items.forEach((item) => store.put({ ...item, updatedAt: item.updatedAt || Date.now() }));

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB bulk write error:", err);
  }
}

export async function addOrUpdateShoppingItemIndexedDB(item: ShoppingListItem): Promise<void> {
  try {
    const db = await initShoppingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({ ...item, updatedAt: Date.now() });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB single put error:", err);
  }
}

export async function deleteShoppingItemIndexedDB(id: string): Promise<void> {
  try {
    const db = await initShoppingDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB delete error:", err);
  }
}
