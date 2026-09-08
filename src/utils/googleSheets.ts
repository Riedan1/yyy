import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Workspace scopes
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/drive.file");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Start Google sign-in flow
export const googleSignIn = async (): Promise<{ user: User; accessToken: string; isDemoFallback?: boolean } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Google Auth");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in error:", error);
    if (
      error?.code === "auth/unauthorized-domain" ||
      error?.message?.includes("unauthorized-domain") ||
      error?.message?.includes("auth/unauthorized-domain")
    ) {
      console.warn("Domain is not authorized in Firebase Console. Falling back to Demo Google Sheets mode.");
      const demoUser = {
        uid: "demo-google-user",
        displayName: "Merchant (Demo Account)",
        email: "merchant.demo@gmail.com",
        photoURL: "",
      } as unknown as User;
      cachedAccessToken = "demo-access-token";
      return { user: demoUser, accessToken: cachedAccessToken, isDemoFallback: true };
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  localStorage.removeItem("yume_spreadsheet_id");
};

// --- Google Sheets API Helpers ---

// 1. Search for existing "Yume Store Orders" spreadsheet
export const findOrCreateSpreadsheet = async (accessToken: string, storeName: string): Promise<string> => {
  if (accessToken.startsWith("demo-") || accessToken === "demo-access-token") {
    const existing = localStorage.getItem("yume_spreadsheet_id");
    if (existing) return existing;
    const demoId = "1Demo_Yume_Store_Orders_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("yume_spreadsheet_id", demoId);
    return demoId;
  }

  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Yume Store Orders' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false&fields=files(id,name)`;
  
  try {
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!searchRes.ok) {
      throw new Error(`Search request failed with status ${searchRes.status}`);
    }
    
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      const spreadsheetId = searchData.files[0].id;
      localStorage.setItem("yume_spreadsheet_id", spreadsheetId);
      return spreadsheetId;
    }
    
    // Create new spreadsheet
    console.log("Creating new Google Spreadsheet...");
    const createUrl = "https://www.googleapis.com/drive/v3/files";
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Yume Store Orders",
        mimeType: "application/vnd.google-apps.spreadsheet",
      }),
    });
    
    if (!createRes.ok) {
      throw new Error(`Create request failed with status ${createRes.status}`);
    }
    
    const createData = await createRes.json();
    const spreadsheetId = createData.id;
    localStorage.setItem("yume_spreadsheet_id", spreadsheetId);
    
    // Initialize standard sheets
    await initializeSpreadsheetStructure(accessToken, spreadsheetId);
    
    return spreadsheetId;
  } catch (error) {
    console.error("Error in findOrCreateSpreadsheet:", error);
    throw error;
  }
};

// Initialize spreadsheet structure with an 'All Orders' tab and headers
export const initializeSpreadsheetStructure = async (accessToken: string, spreadsheetId: string) => {
  if (accessToken.startsWith("demo-") || accessToken === "demo-access-token") {
    console.log("Demo mode: initialized spreadsheet structure for", spreadsheetId);
    return;
  }
  const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  
  try {
    // Add 'All Orders' sheet by updating sheet properties or adding a sheet.
    // Spreadsheets created via Drive API already have a "Sheet1". Let's rename Sheet1 to "All Orders".
    const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const getRes = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (getRes.ok) {
      const getData = await getRes.json();
      const firstSheetId = getData.sheets?.[0]?.properties?.sheetId || 0;
      
      const renameRequest = {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: firstSheetId,
                title: "All Orders",
              },
              fields: "title",
            },
          },
        ],
      };
      
      await fetch(batchUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(renameRequest),
      });
    }
    
    // Write Headers to 'All Orders'
    await writeHeaders(accessToken, spreadsheetId, "All Orders");
  } catch (err) {
    console.error("Failed to initialize spreadsheet structure:", err);
  }
};

const writeHeaders = async (accessToken: string, spreadsheetId: string, sheetTitle: string) => {
  if (accessToken.startsWith("demo-") || accessToken === "demo-access-token") {
    return;
  }
  const headers = [
    "Order ID",
    "Date",
    "Store Name",
    "Shopper Name",
    "Shopper Phone",
    "Shopper Email",
    "Wilaya",
    "Commune",
    "Address",
    "Items",
    "Total (DZD)",
    "Shipping (DZD)",
    "Payment Method",
    "Status"
  ];
  
  const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${sheetTitle}'!A1:N1?valueInputOption=RAW`;
  
  try {
    await fetch(writeUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: `'${sheetTitle}'!A1:N1`,
        majorDimension: "ROWS",
        values: [headers],
      }),
    });
  } catch (err) {
    console.error(`Error writing headers to sheet ${sheetTitle}:`, err);
  }
};

// Ensure a specific sheet tab exists (for store or product category)
export const ensureSheetExists = async (accessToken: string, spreadsheetId: string, sheetTitle: string): Promise<boolean> => {
  if (accessToken.startsWith("demo-") || accessToken === "demo-access-token") {
    return true;
  }
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(title))`;
  
  try {
    const res = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!res.ok) return false;
    
    const data = await res.json();
    const sheetTitles: string[] = data.sheets?.map((s: any) => s.properties.title) || [];
    
    if (sheetTitles.includes(sheetTitle)) {
      return true;
    }
    
    // Add the sheet
    const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    const addRequest = {
      requests: [
        {
          addSheet: {
            properties: {
              title: sheetTitle,
            },
          },
        },
      ],
    };
    
    const addRes = await fetch(batchUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addRequest),
    });
    
    if (addRes.ok) {
      // Write headers to the newly created sheet
      await writeHeaders(accessToken, spreadsheetId, sheetTitle);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error ensuring sheet ${sheetTitle} exists:`, error);
    return false;
  }
};

// Synchronize list of orders
export const syncOrdersToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  orders: any[]
): Promise<{ success: boolean; syncedCount: number }> => {
  if (orders.length === 0) return { success: true, syncedCount: 0 };
  
  if (accessToken.startsWith("demo-") || accessToken === "demo-access-token") {
    console.log(`[Demo Sync Mode] Synced ${orders.length} orders to spreadsheet ID ${spreadsheetId}`);
    return { success: true, syncedCount: orders.length };
  }

  try {
    // 1. Get existing order IDs from the "All Orders" sheet to avoid duplicates
    const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'All Orders'!A:A`;
    const readRes = await fetch(readUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    let existingIds: Set<string> = new Set();
    if (readRes.ok) {
      const readData = await readRes.json();
      if (readData.values) {
        // Skip header row
        readData.values.slice(1).forEach((row: any[]) => {
          if (row[0]) existingIds.add(row[0].toString().trim());
        });
      }
    }
    
    // Filter orders to only sync those not already present
    const ordersToSync = orders.filter(o => !existingIds.has(o.id.toString().trim()));
    if (ordersToSync.length === 0) {
      return { success: true, syncedCount: 0 };
    }
    
    // 2. Prepare order rows
    // Columns: Order ID, Date, Store Name, Shopper Name, Shopper Phone, Shopper Email, Wilaya, Commune, Address, Items, Total, Shipping, Payment Method, Status
    const buildRow = (o: any) => {
      const itemsStr = o.items ? o.items.map((i: any) => `${i.name} (x${i.quantity})`).join(", ") : "";
      return [
        o.id,
        o.date ? new Date(o.date).toLocaleString() : new Date().toLocaleString(),
        o.storeName || "Yume Store",
        o.shopper?.name || "Guest",
        o.shopper?.phone || "",
        o.shopper?.email || "",
        o.shopper?.wilaya || "",
        o.shopper?.commune || "",
        o.shopper?.address || "",
        itemsStr,
        o.total || 0,
        o.shippingCost || 0,
        o.paymentMethod ? o.paymentMethod.toUpperCase() : "COD",
        o.status || "pending"
      ];
    };
    
    // 3. Append to "All Orders" tab
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'All Orders'!A:A:append?valueInputOption=RAW`;
    const allRows = ordersToSync.map(o => buildRow(o));
    
    const appendRes = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: allRows,
      }),
    });
    
    if (!appendRes.ok) {
      throw new Error(`Failed to append to All Orders. Status: ${appendRes.status}`);
    }
    
    // 4. Group by store or product and sync to separate sheets!
    // Let's create a separate sheet for each store name and append the respective rows!
    const storeGroups: Record<string, any[]> = {};
    ordersToSync.forEach(o => {
      const storeName = o.storeName || "Yume Store";
      if (!storeGroups[storeName]) {
        storeGroups[storeName] = [];
      }
      storeGroups[storeName].push(o);
    });
    
    for (const [storeName, groupOrders] of Object.entries(storeGroups)) {
      // Limit sheet title to 30 characters (Google Sheets limit is 100 but keeping it short is safer)
      const sheetTitle = storeName.slice(0, 30).trim();
      const sheetCreated = await ensureSheetExists(accessToken, spreadsheetId, sheetTitle);
      
      if (sheetCreated) {
        const storeAppendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${sheetTitle}'!A:A:append?valueInputOption=RAW`;
        const storeRows = groupOrders.map(o => buildRow(o));
        
        await fetch(storeAppendUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: storeRows,
          }),
        });
      }
    }
    
    return { success: true, syncedCount: ordersToSync.length };
  } catch (err) {
    console.error("Error during sheets orders sync:", err);
    return { success: false, syncedCount: 0 };
  }
};
