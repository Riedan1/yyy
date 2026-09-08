import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, setDoc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { auth } from "./googleSheets";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: client is offline.");
    }
  }
}

// Save the user's wishlist to Firestore
export async function saveWishlistToFirestore(userId: string, productIds: string[]): Promise<void> {
  if (!userId) return;
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

// Load the user's wishlist from Firestore
export async function loadWishlistFromFirestore(userId: string): Promise<string[] | null> {
  if (!userId) return null;
  const path = `wishlists/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, "wishlists", userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.productIds || [];
    }
    return null;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (_) {}
    return null;
  }
}
