import { db, handleFirestoreError, OperationType } from "./firebaseStore";
import { collection, doc, getDocs, setDoc, updateDoc, writeBatch, deleteDoc, query, where, addDoc } from "firebase/firestore";

export interface Brand {
  id: string; // Document ID (usually brand name normalized, e.g. "apple")
  name: string; // "Apple"
  category: string; // e.g., "electronics_devices"
  models: string[]; // List of official approved models
}

export interface PendingModel {
  id: string;
  brandId: string;
  brandName: string;
  modelName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

// Expansive list of default brands and popular models to seed
export const DEFAULT_BRANDS: Brand[] = [
  {
    id: "apple",
    name: "Apple",
    category: "electronics_devices",
    models: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Plus", "iPhone 13"]
  },
  {
    id: "samsung",
    name: "Samsung",
    category: "electronics_devices",
    models: ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S23 FE", "Galaxy A55", "Galaxy Z Flip 5"]
  },
  {
    id: "google_pixel",
    name: "Google Pixel",
    category: "electronics_devices",
    models: ["Pixel 8 Pro", "Pixel 8", "Pixel 7a", "Pixel 7 Pro", "Pixel Fold"]
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    category: "electronics_devices",
    models: ["Xiaomi 14 Ultra", "Xiaomi 13T Pro", "Redmi Note 13 Pro", "Poco X6 Pro"]
  },
  {
    id: "redmi",
    name: "Redmi",
    category: "electronics_devices",
    models: ["Redmi Note 13 Pro+ 5G", "Redmi 13C", "Redmi Note 12", "Redmi 12 5G"]
  },
  {
    id: "poco",
    name: "POCO",
    category: "electronics_devices",
    models: ["Poco X6 Pro", "Poco F5 Pro", "Poco M6 Pro", "Poco C65"]
  },
  {
    id: "huawei",
    name: "Huawei",
    category: "electronics_devices",
    models: ["Mate 60 Pro+", "P60 Pro", "Nova 12 SE", "Mate X3"]
  },
  {
    id: "honor",
    name: "Honor",
    category: "electronics_devices",
    models: ["Honor Magic 6 Pro", "Honor 90", "Honor X9b", "Honor Magic V2"]
  },
  {
    id: "oppo",
    name: "Oppo",
    category: "electronics_devices",
    models: ["Find X7 Ultra", "Reno 11 Pro", "Oppo A98", "Oppo A78"]
  },
  {
    id: "oneplus",
    name: "OnePlus",
    category: "electronics_devices",
    models: ["OnePlus 12", "OnePlus 12R", "OnePlus Nord 3", "OnePlus Open"]
  },
  {
    id: "vivo",
    name: "Vivo",
    category: "electronics_devices",
    models: ["X100 Pro", "V30 Pro", "Y200 5G", "V29 Lite"]
  },
  {
    id: "realme",
    name: "Realme",
    category: "electronics_devices",
    models: ["Realme GT5 Pro", "Realme 12 Pro+", "Realme C67", "Realme 11"]
  },
  {
    id: "motorola",
    name: "Motorola",
    category: "electronics_devices",
    models: ["Edge 40 Neo", "Moto G84", "Razr 40 Ultra", "Moto G54"]
  },
  {
    id: "nokia",
    name: "Nokia",
    category: "electronics_devices",
    models: ["XR21", "G42 5G", "C32", "G22"]
  },
  {
    id: "sony",
    name: "Sony",
    category: "electronics_devices",
    models: ["Xperia 1 V", "Xperia 5 V", "Xperia 10 V"]
  },
  {
    id: "asus",
    name: "Asus",
    category: "electronics_devices",
    models: ["ROG Phone 8 Pro", "Zenfone 10", "ROG Phone 7 Ultimate"]
  },
  {
    id: "lenovo",
    name: "Lenovo",
    category: "electronics_devices",
    models: ["Legion Y70", "ThinkPhone by Motorola", "K14 Plus"]
  },
  {
    id: "nothing",
    name: "Nothing",
    category: "electronics_devices",
    models: ["Phone (2)", "Phone (2a)", "Phone (1)"]
  },
  {
    id: "zte",
    name: "ZTE",
    category: "electronics_devices",
    models: ["Axon 60 Ultra", "Nubia Z60 Ultra", "Blade V50 Design"]
  },
  {
    id: "nubia",
    name: "Nubia",
    category: "electronics_devices",
    models: ["Red Magic 9 Pro", "Nubia Z60 Ultra", "Nubia Neo 5G"]
  },
  {
    id: "tecno",
    name: "Tecno",
    category: "electronics_devices",
    models: ["Camon 30 Premier", "Phantom V Fold", "Spark 20 Pro+", "Pova 6 Pro"]
  },
  {
    id: "infinix",
    name: "Infinix",
    category: "electronics_devices",
    models: ["Note 40 Pro+ 5G", "Zero 30 5G", "Hot 40 Pro", "Smart 8"]
  },
  {
    id: "iris",
    name: "Iris",
    category: "electronics_devices",
    models: ["Iris Vox 4G", "Iris Next G3", "Iris IS4"]
  },
  {
    id: "condor",
    name: "Condor",
    category: "electronics_devices",
    models: ["Allure A80", "Plume P10", "Griffe T9 Plus", "Condor Plume L8"]
  }
];

// Load and initialize Brands from Firestore
export async function fetchBrandsFromFirestore(): Promise<Brand[]> {
  try {
    const snap = await getDocs(collection(db, "brands"));
    let brands: Brand[] = [];
    snap.forEach((doc) => {
      brands.push(doc.data() as Brand);
    });

    if (brands.length === 0) {
      console.log("Seeding expanded default brands list into Firestore...");
      const batch = writeBatch(db);
      for (const brand of DEFAULT_BRANDS) {
        const docRef = doc(db, "brands", brand.id);
        batch.set(docRef, brand);
      }
      await batch.commit();
      brands = [...DEFAULT_BRANDS];
    }

    return brands.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, "brands");
    } catch (_) {
      // Ignore re-thrown error in fallback fetcher
    }
    return DEFAULT_BRANDS.sort((a, b) => a.name.localeCompare(b.name));
  }
}

// Save or Update a Brand
export async function saveBrandToFirestore(brand: Brand): Promise<void> {
  try {
    await setDoc(doc(db, "brands", brand.id), brand);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `brands/${brand.id}`);
    throw error;
  }
}

// Delete a Brand
export async function deleteBrandFromFirestore(brandId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "brands", brandId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `brands/${brandId}`);
    throw error;
  }
}

// Submit a Custom/New Model for Admin Review
export async function submitPendingModelToFirestore(
  brandId: string,
  brandName: string,
  modelName: string
): Promise<void> {
  const id = `pending-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  try {
    const pendingDoc: PendingModel = {
      id,
      brandId,
      brandName,
      modelName,
      status: "pending",
      submittedAt: new Date().toISOString()
    };
    await setDoc(doc(db, "pending_models", id), pendingDoc);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pending_models/${id}`);
    throw error;
  }
}

// Fetch all pending custom models submitted for review
export async function fetchPendingModelsFromFirestore(): Promise<PendingModel[]> {
  try {
    const snap = await getDocs(collection(db, "pending_models"));
    const pendingList: PendingModel[] = [];
    snap.forEach((doc) => {
      pendingList.push(doc.data() as PendingModel);
    });
    return pendingList.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "pending_models");
    return [];
  }
}

// Process (Approve or Reject) a pending custom model
export async function processPendingModel(
  pending: PendingModel,
  action: "approved" | "rejected"
): Promise<void> {
  try {
    const batch = writeBatch(db);
    const pendingRef = doc(db, "pending_models", pending.id);

    if (action === "approved") {
      // 1. Update pending model status
      batch.update(pendingRef, { status: "approved" });

      // 2. Fetch the existing brand and append the model
      const brandSnap = await getDocs(query(collection(db, "brands"), where("id", "==", pending.brandId)));
      let brandDoc: Brand | null = null;
      brandSnap.forEach((d) => {
        brandDoc = d.data() as Brand;
      });

      if (brandDoc) {
        const updatedModels = [...(brandDoc as Brand).models];
        if (!updatedModels.includes(pending.modelName)) {
          updatedModels.push(pending.modelName);
        }
        batch.update(doc(db, "brands", pending.brandId), { models: updatedModels });
      } else {
        // Create new brand doc if it doesn't exist
        const newBrand: Brand = {
          id: pending.brandId,
          name: pending.brandName,
          category: "electronics_devices",
          models: [pending.modelName]
        };
        batch.set(doc(db, "brands", pending.brandId), newBrand);
      }
    } else {
      batch.update(pendingRef, { status: "rejected" });
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pending_models/${pending.id}`);
    throw error;
  }
}
