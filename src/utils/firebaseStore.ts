import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer,
  disableNetwork,
  setLogLevel
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { auth } from "./googleSheets";

// Check if credentials are placeholders or dummy demo values
export const isPlaceholderConfig = !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes("Placeholder") || 
  firebaseConfig.apiKey.startsWith("AIzaSyDemo") ||
  firebaseConfig.projectId === "algerian-commerce-map";

// Suppress unhandled network timeout alerts in console when operating with demo credentials or offline sandbox
if (isPlaceholderConfig) {
  try {
    setLogLevel("silent");
  } catch (_) {}
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use experimentalForceLongPolling to eliminate the 10-second WebSocket connection timeout in iframes and proxies
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// If running in placeholder mode or sandbox, immediately operate purely offline to avoid failed network requests and 10s timeout warnings
if (isPlaceholderConfig) {
  disableNetwork(db).catch(() => {
    // Graceful offline fallback
  });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}

export async function testFirestoreConnection() {
  if (isPlaceholderConfig) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase running in offline storage mode.");
    }
  }
}

// Save the user's wishlist with reliable local persistence fallback
export async function saveWishlistToFirestore(userId: string, productIds: string[]): Promise<void> {
  if (!userId) return;
  
  // Local cache persistence
  try {
    localStorage.setItem(`yume_wishlist_${userId}`, JSON.stringify(productIds));
  } catch (_) {}

  if (isPlaceholderConfig) return;

  const path = `wishlists/${userId}`;
  try {
    await setDoc(doc(db, "wishlists", userId), {
      productIds,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Load the user's wishlist with reliable local persistence fallback
export async function loadWishlistFromFirestore(userId: string): Promise<string[] | null> {
  if (!userId) return null;

  // Check local cache first
  try {
    const cached = localStorage.getItem(`yume_wishlist_${userId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}

  if (isPlaceholderConfig) return [];

  const path = `wishlists/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, "wishlists", userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const productIds = data.productIds || [];
      try {
        localStorage.setItem(`yume_wishlist_${userId}`, JSON.stringify(productIds));
      } catch (_) {}
      return productIds;
    }
    return [];
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (_) {}
    return [];
  }
}
