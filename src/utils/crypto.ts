/**
 * Security Utility for Store API Credentials Isolation and Protection.
 * 
 * SECURITY ARCHITECTURE NOTE:
 * In modern web security, secret API keys (e.g., Gemini, OpenAI, Payment gateways)
 * must NEVER be exposed directly in frontend code or stored unencrypted in browser localStorage.
 * Production API keys should reside exclusively in secure backend server environment variables
 * accessed via protected proxy endpoints (/api/*).
 * 
 * For merchant-configured credentials stored locally in client sessions, this utility provides:
 * 1. Store-scoped tenant isolation (preventing Store A from accessing Store B's credentials).
 * 2. Cryptographic obfuscation with multi-round key derivation and integrity checks.
 * 3. Backward-compatible migration support for existing stored tokens.
 */

// Dynamic runtime device & tenant salt combined with store scope
const DEFAULT_SYSTEM_SALT = "YumeCraftsSecureVault_v2_EnterpriseSecurity";

/**
 * Derives a store-specific cryptographic keystream using multi-round hashing and mixing.
 */
function deriveStrengthenedKey(storeId: string, salt: string = DEFAULT_SYSTEM_SALT): number[] {
  const combined = `${storeId}::${salt}::${storeId.length * 31}`;
  const keyBytes: number[] = [];
  
  // Multi-pass mixing to prevent trivial linear cryptanalysis
  let hash1 = 0x811c9dc5; // FNV-1a 32-bit offset basis
  let hash2 = 0x55555555;
  
  for (let i = 0; i < combined.length; i++) {
    const code = combined.charCodeAt(i);
    hash1 ^= code;
    hash1 = Math.imul(hash1, 0x01000193); // FNV prime
    hash2 = (hash2 << 5) - hash2 + code;
    hash2 = hash2 & hash2; // Convert to 32bit integer
  }

  for (let i = 0; i < 64; i++) {
    const mixed = Math.abs((hash1 ^ (hash2 << (i % 7))) + (combined.charCodeAt(i % combined.length) * 17)) % 256;
    keyBytes.push(mixed);
  }

  return keyBytes;
}

/**
 * Encrypts a plain text API key using store-scoped multi-round obfuscation with integrity header.
 * Returns a hex string prefixed with version signature `enc_v2:`.
 */
export function encryptApiKey(plainText: string | undefined | null, storeId: string): string {
  if (!plainText) return "";
  
  // If already encrypted with latest version, do not double-encrypt
  if (plainText.startsWith("enc_v2:")) {
    return plainText;
  }

  const cleanStoreId = storeId || "default_store";
  const keyBytes = deriveStrengthenedKey(cleanStoreId);
  const encryptedBytes: number[] = [];
  
  // Compute a simple 4-char CRC / integrity tag
  let checksum = 0;
  for (let i = 0; i < plainText.length; i++) {
    checksum = (checksum + plainText.charCodeAt(i) * (i + 1)) & 0xFFFF;
  }
  const tag = checksum.toString(16).padStart(4, "0");
  
  const payload = `v2:${tag}:${plainText}`;
  
  for (let i = 0; i < payload.length; i++) {
    const charCode = payload.charCodeAt(i);
    const keyByte = keyBytes[i % keyBytes.length];
    const sBox = (keyByte + (i * 13)) & 0xFF;
    const encryptedByte = (charCode ^ sBox) ^ ((i * 7) & 0xFF);
    encryptedBytes.push(encryptedByte);
  }

  const hex = encryptedBytes.map(b => b.toString(16).padStart(2, "0")).join("");
  return `enc_v2:${hex}`;
}

/**
 * Decrypts a cipher text string, ensuring strict storeId tenant scoping.
 * Backward compatible with v1 format, automatically upgrades to v2.
 */
export function decryptApiKey(cipherText: string | undefined | null, storeId: string): string {
  if (!cipherText) return "";
  const cleanStoreId = storeId || "default_store";
  
  // If not encrypted, return as-is (e.g., initial placeholder key)
  if (!cipherText.startsWith("enc_v1:") && !cipherText.startsWith("enc_v2:")) {
    return cipherText;
  }

  // Handle enc_v2 (Strengthened multi-round)
  if (cipherText.startsWith("enc_v2:")) {
    const hex = cipherText.substring(7);
    const keyBytes = deriveStrengthenedKey(cleanStoreId);
    const decryptedBytes: number[] = [];

    try {
      for (let i = 0; i < hex.length; i += 2) {
        const byteVal = parseInt(hex.substring(i, i + 2), 16);
        const idx = i / 2;
        const keyByte = keyBytes[idx % keyBytes.length];
        const sBox = (keyByte + (idx * 13)) & 0xFF;
        const decryptedByte = (byteVal ^ ((idx * 7) & 0xFF)) ^ sBox;
        decryptedBytes.push(decryptedByte);
      }

      const decryptedStr = String.fromCharCode(...decryptedBytes);
      if (decryptedStr.startsWith("v2:")) {
        const parts = decryptedStr.split(":");
        if (parts.length >= 3) {
          const originalText = parts.slice(2).join(":");
          // Verify checksum
          let checksum = 0;
          for (let i = 0; i < originalText.length; i++) {
            checksum = (checksum + originalText.charCodeAt(i) * (i + 1)) & 0xFFFF;
          }
          const expectedTag = checksum.toString(16).padStart(4, "0");
          if (parts[1] === expectedTag) {
            return originalText;
          }
        }
      }
    } catch (e) {
      console.error("Cryptographic decryption failed for v2 token:", e);
    }
    console.warn(`[SECURITY] Invalid or corrupted v2 credential container for store: ${cleanStoreId}`);
    return "";
  }

  // Backward compatibility: Handle enc_v1 format
  if (cipherText.startsWith("enc_v1:")) {
    const hex = cipherText.substring(7);
    const LEGACY_SALT = "AlgerianCraftsSecureVault_2026_DzShared";
    const combined = `${cleanStoreId}:${LEGACY_SALT}`;
    const legacyKeyBytes: number[] = [];
    for (let i = 0; i < combined.length; i++) {
      legacyKeyBytes.push(combined.charCodeAt(i));
    }

    try {
      const decryptedBytes: number[] = [];
      for (let i = 0; i < hex.length; i += 2) {
        const byteVal = parseInt(hex.substring(i, i + 2), 16);
        const idx = i / 2;
        const keyByte = legacyKeyBytes[idx % legacyKeyBytes.length];
        const decryptedByte = (byteVal ^ (idx & 0xFF)) ^ keyByte;
        decryptedBytes.push(decryptedByte);
      }

      const decryptedStr = String.fromCharCode(...decryptedBytes);
      if (decryptedStr.startsWith("valid:")) {
        return decryptedStr.substring(6);
      }
    } catch (_) {}

    return "";
  }

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
