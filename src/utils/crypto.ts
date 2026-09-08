/**
 * Security Utility for API Keys Isolation and Encryption.
 * Solves cross-store credential leaking by scoping encryption strictly to the merchant's storeId.
 */

const GLOBAL_SALT = "AlgerianCraftsSecureVault_2026_DzShared";

/**
 * Derives a store-specific cryptographic stream key from storeId and global salt.
 */
function deriveKey(storeId: string): number[] {
  const combined = `${storeId}:${GLOBAL_SALT}`;
  const keyBytes: number[] = [];
  for (let i = 0; i < combined.length; i++) {
    keyBytes.push(combined.charCodeAt(i));
  }
  return keyBytes;
}

/**
 * Encrypts a plain text API key using a salted, store-scoped stream cipher.
 * Returns a hex string prefixed with version signature.
 */
export function encryptApiKey(plainText: string | undefined | null, storeId: string): string {
  if (!plainText) return "";
  
  // If already encrypted, don't double-encrypt
  if (plainText.startsWith("enc_v1:")) {
    return plainText;
  }

  const keyBytes = deriveKey(storeId);
  const encryptedBytes: number[] = [];
  
  // Magic signature + original string for integrity verification
  const payload = `valid:${plainText}`;
  
  for (let i = 0; i < payload.length; i++) {
    const charCode = payload.charCodeAt(i);
    // XOR with derived key byte in sliding window
    const keyByte = keyBytes[i % keyBytes.length];
    // Rotate character code and XOR
    const encryptedByte = (charCode ^ keyByte) ^ (i & 0xFF);
    encryptedBytes.push(encryptedByte);
  }

  // Convert bytes to hex
  const hex = encryptedBytes.map(b => b.toString(16).padStart(2, "0")).join("");
  return `enc_v1:${hex}`;
}

/**
 * Decrypts a cipher text string, ensuring it was encrypted strictly for the specified storeId.
 * Returns empty string if the signature is invalid or cross-store access is detected.
 */
export function decryptApiKey(cipherText: string | undefined | null, storeId: string): string {
  if (!cipherText) return "";
  
  if (!cipherText.startsWith("enc_v1:")) {
    // Return as-is if it's not encrypted (e.g., initial placeholder key)
    return cipherText;
  }

  const hex = cipherText.substring(7);
  const keyBytes = deriveKey(storeId);
  const decryptedBytes: number[] = [];

  try {
    for (let i = 0; i < hex.length; i += 2) {
      const byteVal = parseInt(hex.substring(i, i + 2), 16);
      const idx = i / 2;
      const keyByte = keyBytes[idx % keyBytes.length];
      const decryptedByte = (byteVal ^ (idx & 0xFF)) ^ keyByte;
      decryptedBytes.push(decryptedByte);
    }

    const decryptedStr = String.fromCharCode(...decryptedBytes);
    if (decryptedStr.startsWith("valid:")) {
      return decryptedStr.substring(6);
    }
  } catch (e) {
    console.error("Cryptographic decryption failed:", e);
  }

  // Security isolation failure: Cross-store key contamination detected or corrupted key
  console.warn(`[SECURITY ISOLATION CHECK FAILED] Unauthorized access attempt to key container. Store scope mismatch: ${storeId}`);
  return "";
}

/**
 * Fully encrypts all API keys inside a store configuration object.
 */
export function encryptStoreApiKeys(store: any): any {
  if (!store) return store;
  const storeId = store.id || "unknown_store";
  
  const encryptedStore = { ...store };
  
  if (store.apiKey) {
    encryptedStore.apiKey = encryptApiKey(store.apiKey, storeId);
  }
  
  if (store.apiKeysVault) {
    encryptedStore.apiKeysVault = { ...store.apiKeysVault };
    for (const key of Object.keys(encryptedStore.apiKeysVault)) {
      if (encryptedStore.apiKeysVault[key]) {
        encryptedStore.apiKeysVault[key] = encryptApiKey(encryptedStore.apiKeysVault[key], storeId);
      }
    }
  }
  
  return encryptedStore;
}

/**
 * Fully decrypts all API keys inside a store configuration object, with strict storeId scoping.
 */
export function decryptStoreApiKeys(store: any): any {
  if (!store) return store;
  const storeId = store.id || "unknown_store";
  
  const decryptedStore = { ...store };
  
  if (store.apiKey) {
    decryptedStore.apiKey = decryptApiKey(store.apiKey, storeId);
  }
  
  if (store.apiKeysVault) {
    decryptedStore.apiKeysVault = { ...store.apiKeysVault };
    for (const key of Object.keys(decryptedStore.apiKeysVault)) {
      if (decryptedStore.apiKeysVault[key]) {
        decryptedStore.apiKeysVault[key] = decryptApiKey(decryptedStore.apiKeysVault[key], storeId);
      }
    }
  }
  
  return decryptedStore;
}
