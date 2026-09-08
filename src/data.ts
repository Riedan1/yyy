/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MerchantStore, Product } from "./types";

export interface WilayaInfo {
  code: string;
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const COMMUNICATIVE_WILAYAS: WilayaInfo[] = [
  { code: "16", name: "Algiers", nameAr: "الجزائر العاصمة", lat: 36.7538, lng: 3.0588, zoom: 12 },
  { code: "31", name: "Oran", nameAr: "وهران", lat: 35.6971, lng: -0.6308, zoom: 12 },
  { code: "25", name: "Constantine", nameAr: "قسنطينة", lat: 36.3650, lng: 6.6147, zoom: 12 },
  { code: "06", name: "Bejaia", nameAr: "بجاية", lat: 36.7512, lng: 5.0567, zoom: 11 },
  { code: "47", name: "Ghardaïa", nameAr: "غرداية", lat: 32.4909, lng: 3.6738, zoom: 11 },
  { code: "13", name: "Tlemcen", nameAr: "تلمسان", lat: 34.8783, lng: -1.3150, zoom: 12 },
  { code: "23", name: "Annaba", nameAr: "عنابة", lat: 36.9000, lng: 7.7667, zoom: 12 },
];

export const ALL_58_WILAYAS = [
  { code: "01", name: "Adrar" }, { code: "02", name: "Chlef" }, { code: "03", name: "Laghouat" },
  { code: "04", name: "Oum El Bouaghi" }, { code: "05", name: "Batna" }, { code: "06", name: "Béjaïa" },
  { code: "07", name: "Biskra" }, { code: "08", name: "Béchar" }, { code: "09", name: "Blida" },
  { code: "10", name: "Bouira" }, { code: "11", name: "Tamanrasset" }, { code: "12", name: "Tébessa" },
  { code: "13", name: "Tlemcen" }, { code: "14", name: "Tiaret" }, { code: "15", name: "Tizi Ouzou" },
  { code: "16", name: "Alger" }, { code: "17", name: "Djelfa" }, { code: "18", name: "Jijel" },
  { code: "19", name: "Sétif" }, { code: "20", name: "Saïda" }, { code: "21", name: "Skikda" },
  { code: "22", name: "Sidi Bel Abbès" }, { code: "23", name: "Annaba" }, { code: "24", name: "Guelma" },
  { code: "25", name: "Constantine" }, { code: "26", name: "Médéa" }, { code: "27", name: "Mostaganem" },
  { code: "28", name: "M'Sila" }, { code: "29", name: "Mascara" }, { code: "30", name: "Ouargla" },
  { code: "31", name: "Oran" }, { code: "32", name: "El Bayadh" }, { code: "33", name: "Illizi" },
  { code: "34", name: "Bordj Bou Arréridj" }, { code: "35", name: "Boumerdès" }, { code: "36", name: "El Tarf" },
  { code: "37", name: "Tindouf" }, { code: "38", name: "Tissemsilt" }, { code: "39", name: "El Oued" },
  { code: "40", name: "Khenchela" }, { code: "41", name: "Souk Ahras" }, { code: "42", name: "Tipaza" },
  { code: "43", name: "Mila" }, { code: "44", name: "Aïn Defla" }, { code: "45", name: "Naâma" },
  { code: "46", name: "Aïn Témouchent" }, { code: "47", name: "Ghardaïa" }, { code: "48", name: "Relizane" },
  { code: "49", name: "El M'Ghair" }, { code: "50", name: "El Meniaa" }, { code: "51", name: "Ouled Djellal" },
  { code: "52", name: "Bordj Baji Mokhtar" }, { code: "53", name: "Béni Abbès" }, { code: "54", name: "In Salah" },
  { code: "55", name: "In Guezzam" }, { code: "56", name: "Touggourt" }, { code: "57", name: "Djanet" },
  { code: "58", name: "El M'Gheier" }
];

const RAW_INITIAL_STORES: MerchantStore[] = [
  {
    id: "store_1",
    name: "Tapis Berbères Ath Yenni",
    slug: "athyenni-rugs",
    subdomain: "berber-rugs.platform.dz",
    logo: "/src/assets/images/berber_store_logo_1780094183818.png",
    banner: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    description: "Authentic Algerian Berber rugs hand-woven by Kabyle women weavers. Every geometric pattern tells a centuries-old story.",
    bio: "A family enterprise dedicated to preserving the legacy of traditional Kabyle weaving in Ath Yenni. All rugs are 100% organic virgin sheep wool.",
    wilaya: "Bejaia",
    wilayaCode: "06",
    address: "Route d'Ath Yenni, Béjaïa Centre",
    coordinates: { lat: 36.7512, lng: 5.0567 },
    rating: 4.9,
    categories: ["Crafts", "Home"],
    verified: true,
    premiumTier: "Pro",
    merchantFullName: "Hakim BNS",
    contact: {
      phone: "+213 555 12 34 56",
      email: "contact@berber-rugs.dz",
      instagram: "berber_rugs_dz",
      facebook: "BerberRugsAthYenni",
    },
    reviews: [
      {
        id: "rev_1_1",
        author: "Amel Boukhari",
        authorLocation: "Algiers",
        rating: 5,
        comment: "Excellent travail! Le tapis est une véritable oeuvre d'art dans mon salon. Je recommande vivement les artisans.",
        date: "2026-04-12",
        sentiment: "positive"
      },
      {
        id: "rev_1_2",
        author: "Karim Slimani",
        authorLocation: "Oran",
        rating: 4.8,
        comment: "Livraison un peu en retard mais la qualité du fil de laine et des couleurs naturelles compense largement l'attente.",
        date: "2026-05-02",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_1_1",
        storeId: "store_1",
        name: "Tapis Berbère 'Kalliste' Rouge & Noir",
        category: "Crafts",
        price: 36000,
        stock: 3,
        imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "سجاد بربري قبائلي من آث يني منسوج يدويًا بنسبة 100% من صوف الغنم الصافي. ألوان طبيعية قوية ورسومات ترمز لتاريخ المنطقة لبيت مميز.",
        description_fr: "Tapis berbère traditionnel d'Ath Yenni tissé entièrement à la main. Laine épaisse vierge de haute qualité teintée avec des extraits naturels.",
        description_en: "Authentic Kabyle Berber Rug from Ath Yenni, 100% handcrafted virgin sheep wool. Traditional geometric patterns representing Algerian heritage.",
        tags: ["tapis", "kabyle", "laine", "artisanat", "ath yenni"]
      },
      {
        id: "p_1_2",
        storeId: "store_1",
        name: "Bijou Kabyle - Bracelet en Argent Massif",
        category: "Crafts",
        price: 18500,
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.8,
        reviews: [],
        description_ar: "سوار فضي قبائلي أصيل مطلي بالمينا الملونة (الأزرق والأصفر والأخضر) ومرصع بالمرجان الأحمر الطبيعي، فخر الحرف اليدوية لآث يني.",
        description_fr: "Bracelet kabyle authentique en argent massif avec émail traditionnel trilobé (bleu, vert, jaune) et corail rouge méditerranéen.",
        description_en: "Authentic Kabyle sterling silver bracelet with traditional enamel (blue, green, yellow) and original red Mediterranean coral inlay.",
        tags: ["bijou", "argent", "corail", "kabyle", "traditionnel"]
      },
      {
        id: "p_1_3",
        storeId: "store_1",
        name: "Poterie Kabyle en Argile de Maatkas",
        category: "Crafts",
        price: 4500,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.6,
        reviews: [],
        description_ar: "جرة فخارية تقليدية مصنوعة يدويًا من طين معاتقة الطبيعي، مزينة برسومات هندسية كلاسيكية تعبر عن الهوية الأمازيغية والجمال العريق.",
        description_fr: "Jarre de poterie traditionnelle kabyle façonnée à la main en argile naturelle de Maatkas, ornée de motifs géométriques berbères peints aux pigments naturels.",
        description_en: "Authentic pottery jar from Maatkas, handcrafted with organic clay and finished with ancestral geometric mineral-ink hand engravings.",
        tags: ["poterie", "argil", "artisanat", "maatkas", "déco"]
      },
      {
        id: "p_1_4",
        storeId: "store_1",
        name: "Collier Kabyle Royal 'Tasfift'",
        category: "Crafts",
        price: 34000,
        stock: 4,
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1611085583191-a3b1a20a5a4a?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 5.0,
        reviews: [],
        description_ar: "قلادة قبائلية ملكية مصنوعة بدقة عالية من الفضة عيار 950 المطلية بحبيبات المينا الملونة ومرصعة بقطع مرجان البحر الأبيض المتوسط الأحمر.",
        description_fr: "Collier kabyle d'exception en argent massif émaillé à l'ancienne avec cabochons montés de coraux rouges précieux d'Algérie.",
        description_en: "Precious Algerian royal bridal silver necklace embellished with colored enamelwork and premium Mediterranean red coral gems.",
        tags: ["collier", "argent", "corail", "bijou", "kabyle"]
      },
      {
        id: "p_1_5",
        storeId: "store_1",
        name: "Robe Kabyle Traditionnelle de broderie d'Or",
        category: "Fashion",
        price: 19500,
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "جبة قبائلية نسائية مطرزة بالخيوط الحريرية الملونة والزخارف التقليدية المميزة، فضفاضة وراقية تجمع بين الحشمة والأصالة لمناسبتكم العائلية.",
        description_fr: "Robe de fête traditionnelle kabyle en satin brodée de galons colorés (Zgach) et rehaussée de motifs perlés exquis.",
        description_en: "Classic embroidered women's Kabyle celebration dress adorned with color-vibrant local zigzag lace and satin sleeve finishes.",
        tags: ["robe", "fashion", "kabyle", "mariage", "vêtement"]
      },
      {
        id: "p_1_6",
        storeId: "store_1",
        name: "Pochette de Soirée en Cuir Brodé",
        category: "Fashion",
        price: 5200,
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "حقيبة يد نسائية من الجلد الطبيعي الفاخر، مطرزة يدوياً بخيوط الفتلة والحرير اللامع على أيدي أمهر الحرفيين في جبال جرجرة.",
        description_fr: "Sac pochette de soirée en cuir d'agneau souple brodé d'ornements traditionnels raffinés à la main.",
        description_en: "Elegant evening clutch made from supple local leather and hand-stitched with intricate ancestral filigree patterns.",
        tags: ["pochette", "cuir", "sac", "accessoire", "fashion"]
      },
      {
        id: "p_1_7",
        storeId: "store_1",
        name: "Plat en Céramique Décoratif Omeyyade",
        category: "Crafts",
        price: 7800,
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1535401991746-da3d9055713e?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.8,
        reviews: [],
        description_ar: "صحن دائري كبير من السيراميك المصقول يدويًا، مزين بنقوش وزخارف إسلامية أندلسية فريدة لتعليقه في الصالونات أو غرف الضيوف.",
        description_fr: "Grand plat de service d'ornementation murale en céramique faite main, décors floraux andalous peints minutieusement.",
        description_en: "Handmade ceramic ornamental plate featuring vibrant traditional handpainted Andalusian designs, suitable for food or wall showcase.",
        tags: ["plat", "céramique", "déco", "artisanat", "cuisine"]
      },
      {
        id: "p_1_8",
        storeId: "store_1",
        name: "Boîte Ronde en Bois de Thuya Précieux",
        category: "Crafts",
        price: 8900,
        stock: 6,
        imageUrl: "https://images.unsplash.com/photo-1512201858874-15202619bbbf?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "علبة تخزين خشبية صلبة مستخرجة من جذور خشب العرعر برائحتها العطرية المميزة، مصقولة بعناية كاملة ومصممة لحفظ المجوهرات ومقتنياتكم الثمينة.",
        description_fr: "Coffret en ronce de thuya naturel poli à la cire d'abeille, caractérisé par sa divine odeur boisée et ses veinures uniques.",
        description_en: "Aromatic thuya roots hand-carved decorative jewelry compartment, polished with high quality natural beeswax for natural shine.",
        tags: ["boite", "bois", "thuya", "bijoux", "déco"]
      },
      {
        id: "p_1_9",
        storeId: "store_1",
        name: "Tapis Mural Kabyle 'Beni Yenni'",
        category: "Crafts",
        price: 24000,
        stock: 3,
        imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d90029?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 5.0,
        reviews: [],
        description_ar: "رقمة جدارية تقليدية صغيرة من صوف الغنم المغزول والمصبوغ يدويًا برموز الحماية الأمازيغية القديمة لتبث الدفء والاصالة في جدران بيتكم.",
        description_fr: "Tapis mural fin à franges tissé en haute laine vierge, représentant les constellations symboliques et les récits de Grande Kabylie.",
        description_en: "Wall hanger artistic woolen weave, handmade with pure virgin wool from Grande Kabylie, showcasing historical constellation designs.",
        tags: ["tapis", "mural", "laine", "artisanat", "kabylie"]
      }
    ]
  },
  {
    id: "store_2",
    name: "La Maison du Caftan d'Alger",
    slug: "maison-caftan-alger",
    subdomain: "caftan-alger.platform.dz",
    logo: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    description: "Handcrafted traditional Algerian Caftans and Karakou dresses made with imperial Fetla and Mejboub embroidery.",
    bio: "Located in the historic Casbah of Algiers, our master tailors design exceptional bridal wear bridging elegant heritage with modern silhouettes.",
    wilaya: "Algiers",
    wilayaCode: "16",
    address: "24 Rue de la Casbah, Alger",
    coordinates: { lat: 36.7538, lng: 3.0588 },
    rating: 4.8,
    categories: ["Fashion"],
    verified: true,
    premiumTier: "Growth",
    contact: {
      phone: "+213 661 98 76 54",
      email: "contact@caftan-alger.dz",
      instagram: "caftan_casbah_chic",
    },
    reviews: [
      {
        id: "rev_2_1",
        author: "Yasmina Benali",
        authorLocation: "Constantine",
        rating: 5,
        comment: "Karakou absolument sublime pour mes fiançailles! Travail de haute couture, les broderies Fetla dorées brillent magnifiquement.",
        date: "2026-05-10",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_2_1",
        storeId: "store_2",
        name: "Karakou Algérois Royal Moderne",
        category: "Fashion",
        price: 85000,
        stock: 2,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "كاراكو عاصمي عريق سترة قطيفة سوداء مطرزة يدوياً بخيوط الفتلة الذهبية والفضية، مع سروال شلقة حريري بلون كريمي أنيق للعروس الجزائرية.",
        description_fr: "Veste de Karakou algérois d'exception en velours de soie noir brodé or à la main (broderie Fetla), accompagnée de son pantalon en satin de soie.",
        description_en: "Exquisite modern Algiers Karakou. Handcrafted silk velvet jacket embroidered in gold thread (Fetla) and paired with smooth silk trousers.",
        tags: ["karakou", "traditional", "algerois", "mariage", "fetla"]
      }
    ]
  },
  {
    id: "store_3",
    name: "Oasis de Deglet Nour - Ghardaïa Spécialités",
    slug: "deglet-nour-ghardaia",
    subdomain: "oasis-dates.platform.dz",
    logo: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=800&auto=format&fit=crop&q=80",
    description: "Organic premium Deglet Nour dates sourced directly from the oases of Ghardaïa (M'zab Valley) and Tolga.",
    bio: "A collaborative cooperative of palm growers in Ghardaïa. We hand-select and vacuum-seal honeyed, translucent fresh dates of high calibre.",
    wilaya: "Ghardaïa",
    wilayaCode: "47",
    address: "Palmeraie de Beni Isguen, Ghardaïa",
    coordinates: { lat: 32.4909, lng: 3.6738 },
    rating: 4.95,
    categories: ["Food"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 29 11 22 33",
      email: "ghardaia.dates@gmail.com",
      whatsapp: "+213 551 44 55 66",
    },
    reviews: [
      {
        id: "rev_3_1",
        author: "Ryad Merabet",
        authorLocation: "Algiers",
        rating: 5,
        comment: "Véritable Deglet Nour extra charnue et translucide. Un régal quotidien. Emballage sous vide impeccable pour conserver la fraîcheur.",
        date: "2026-04-25",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_3_1",
        storeId: "store_3",
        name: "Dattes Deglet Nour Bio 'Miel Doré' - Carton 5Kg",
        category: "Food",
        price: 4800,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1596515101367-a35974c4db96?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.95,
        reviews: [],
        description_ar: "تمر دقلة نور طبيعية بيولوجية من واحات غرداية وبني يزقن الشهيرة. حبات عسلية ذهبية شفافة، ناعمة ومحفوظة بعناية كاملة في كرتون بوزن 5 كغ.",
        description_fr: "Authentique datte Deglet Nour d'exception, translucide et miellée de calibre supérieur. Carton de 5kg d'agriculture biologique sans conservateurs.",
        description_en: "Premium organic Deglet Nour dates from the valley of Ghardaïa. Semi-dry translucent honeyed dates of high calibre. 5Kg box, direct oasis source.",
        tags: ["dates", "deglet", "nour", "bio", "ghardaia"]
      }
    ]
  },
  {
    id: "store_4",
    name: "Al Bey Pâtisserie Constantine",
    slug: "el-bey-constantine",
    subdomain: "albey-pastry.platform.dz",
    logo: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80",
    description: "Pure traditional confectionery from Constantine, specializing in walnut Baklawa and honey-spun Djouzia.",
    bio: "Keepers of the imperial secret recipe of Constantine's Djouzia white nougat, handcrafting ultra-flaky honey-layered pastries.",
    wilaya: "Constantine",
    wilayaCode: "25",
    address: "Avenue Kaddour Boumedous, Constantine Centre",
    coordinates: { lat: 36.3650, lng: 6.6147 },
    rating: 4.7,
    categories: ["Food"],
    verified: true,
    premiumTier: "Starter",
    contact: {
      phone: "+213 31 88 54 22",
      email: "order@albey-pastry.dz",
    },
    reviews: [
      {
        id: "rev_4_1",
        author: "Nabila Saidouni",
        authorLocation: "Annaba",
        rating: 4.5,
        comment: "La Djouzia est excellente mais un tout petit peu trop de miel sucré à mon goût. La texture en bouche est parfaite.",
        date: "2026-05-15",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_4_1",
        storeId: "store_4",
        name: "Djouzia Traditionnelle au Miel de Montagne - Boite de 1Kg",
        category: "Food",
        price: 3900,
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1596515101367-a35974c4db96?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "جوزية قسنطينية ملكية أصيلة محضرة ببياض البيض ومخفوقة بالكامل بعسل النحل الحر الكثيف ومرصعة بقطع الجوز المقرمشر، حلاوة فاخرة لضيافتكم.",
        description_fr: "Djouzia authentique de Constantine, nougat blanc artisanal ultra-moelleux préparé au pur miel de montagne sauvage et incrusté de cerneaux de noix.",
        description_en: "Classic Constantine Royal Djouzia. A soft white nougat handcrafted with pure mountain honey and packed with premium crunchy local walnuts.",
        tags: ["djouzia", "sucre", "constantine", "miel", "noix"]
      }
    ]
  },
  {
    id: "store_5",
    name: "Tlemcen Or & Cuir",
    slug: "tlemcen-leather",
    subdomain: "tlemcen-leather.platform.dz",
    logo: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
    description: "Premium handcrafted leather goods from Tlemcen, specializing in organic dyed slippers and cardholders.",
    bio: "Founded in Tlemcen's ancient Medina, our workshop uses 100% eco-friendly local leather hand-tanned with pine and argan bark extracts.",
    wilaya: "Tlemcen",
    wilayaCode: "13",
    address: "Boulevard Sidi Boumediene, Tlemcen",
    coordinates: { lat: 34.8783, lng: -1.3150 },
    rating: 4.75,
    categories: ["Crafts", "Fashion"],
    verified: true,
    premiumTier: "Growth",
    contact: {
      phone: "+213 43 27 12 99",
      email: "tlemcen.cuir@yahoo.com",
    },
    reviews: [
      {
        id: "rev_5_1",
        author: "SidAhmed Belkaid",
        authorLocation: "Oran",
        rating: 5,
        comment: "La babouche tlemcenienne est ultra confortable. Le cuir respire, parfait pour la prière et pour l'Aïd. Qualité haut de gamme.",
        date: "2026-05-18",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_5_1",
        storeId: "store_5",
        name: "Babouches Tlemcéniennes Traditionnelles en Cuir de Chèvre",
        category: "Fashion",
        price: 3200,
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.8,
        reviews: [],
        description_ar: "بلغة أو شربيل تلمساني جلد ماعز أصيل مدبوغ طبيعياً بمواد نباتية، مخيط وملبوس للمناسبات والأعياد ويتميز بالراحة التامة للقدمين والمتانة الطويلة.",
        description_fr: "Babouches tlemcéniennes de qualité supérieure faites main en cuir de chèvre tanné végétalement, coutures traditionnelles renforcées.",
        description_en: "Authentic Tlemcen leather slippers (Babouches) made from naturally tanned premium goat leather, double stitched by master cobblers.",
        tags: ["cuir", "babouche", "tlemcen", "fait-main", "chaussures"]
      }
    ]
  },
  {
    id: "store_6",
    name: "Oran Tech Express",
    slug: "oran-tech",
    subdomain: "oran-tech.platform.dz",
    logo: "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=800&auto=format&fit=crop&q=80",
    description: "Importer of premium gaming gear, high-performance PC components, and tech accessories based in Oran El Bahia.",
    bio: "Leading electronics distributor in Western Algeria. We ship directly across all 58 provinces with 12 to 24 months full warranty.",
    wilaya: "Oran",
    wilayaCode: "31",
    address: "Résidence El Bahia, Boulevard Front de Mer, Oran",
    coordinates: { lat: 35.6971, lng: -0.6308 },
    rating: 4.6,
    categories: ["Electronics"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 552 90 90 90",
      email: "sales@oran-tech.dz",
      instagram: "oran_tech_luxe",
    },
    reviews: [
      {
        id: "rev_6_1",
        author: "Walid Benziane",
        authorLocation: "Chlef",
        rating: 5,
        comment: "Excellent service service après-vente, livraison hyper rapide sous 48h directement à Chlef. Matériel très bien protégé.",
        date: "2026-05-19",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_6_1",
        storeId: "store_6",
        name: "Clavier Mécanique Gamer Ergonomique Pro DZ",
        category: "Electronics",
        price: 14500,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "لوحة مفاتيح ميكانيكية احترافية للألعاب مع أزرار سريعة الاستجابة، مضادة للتعرق وضوضاء هادئة مع نظام إضاءة RGB مذهل قابل للتعديل بالكامل.",
        description_fr: "Clavier mécanique haut de gamme pour l'esport et gaming intensif. Switches bleus réactifs, rétroéclairage RGB personnalisable et repose-poignets.",
        description_en: "Premium Esports mechanical keyboard with linear switches, dynamic custom RGB backlighting, and heavy-duty localized durability.",
        tags: ["gaming", "clavier", "gamer", "oran", "informatique"]
      }
    ]
  },
  {
    id: "store_7",
    name: "Distillerie Artisanale de Blida",
    slug: "distillerie-blida",
    subdomain: "blida-distill.platform.dz",
    logo: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80",
    description: "Ancestral steam-distilled flower waters and organic raw blossom honey from the lush Mitidja plains.",
    bio: "Nestled in Blida, the City of Roses, our craft distillery uses copper stills to preserve pure organic blossom essences.",
    wilaya: "Blida",
    wilayaCode: "09",
    address: "Boulevard des Orangers, Blida",
    coordinates: { lat: 36.4700, lng: 2.8300 },
    rating: 4.85,
    categories: ["Food", "Home"],
    verified: true,
    premiumTier: "Growth",
    contact: {
      phone: "+213 25 40 12 34",
      email: "blida.fleurs@platdz.com",
      instagram: "blida_distillerie_mitidja"
    },
    reviews: [
      {
        id: "rev_7_1",
        author: "Fatiha Ould",
        authorLocation: "Algiers",
        rating: 5,
        comment: "L'eau de fleur d'oranger est extrêmement parfumée. Idéale pour mes gâteaux de l'Aïd. Je n'achète plus que chez eux !",
        date: "2026-05-01",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_7_1",
        storeId: "store_7",
        name: "Eau de Fleur d'Oranger Distillée (M'gatar)",
        category: "Food",
        price: 1800,
        stock: 45,
        imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=400&auto=format&fit=crop&q=80",
        images: [
          "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80"
        ],
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "ماء زهر الليمون الطبيعي المقطر تقليدياً بقطارة النحاس التقليدية في البليدة. معطر رائع ومنعش للحلويات الجزائرية التقليدية والمشروبات.",
        description_fr: "Eau de fleur d'oranger pure distillée traditionnellement à l'alambic de cuivre. Parfait pour parfumer vos gâteaux d'Aïd et vos boissons locales.",
        description_en: "Pure locally-distilled Orange Blossom water (M'gatar) crafted using traditional copper stills. Essential organic culinary extract.",
        tags: ["fleur d'oranger", "blida", "distill", "naturel", "cuisine"]
      },
      {
        id: "p_7_2",
        storeId: "store_7",
        name: "Miel d'Oranger Pur des Vergers de la Mitidja",
        category: "Food",
        price: 4500,
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.8,
        reviews: [],
        description_ar: "عسل زهر الليمون الصافي واللذيذ من حقول متيجة المعطرة ببليدة. عسل طبيعي ذو فوائد صحية جمة وطعم فريد يحبه الصغار والكبار.",
        description_fr: "Miel d'oranger pur récolté dans les plaines de la Mitidja. Un miel doux à l'arôme fruité d'agrumes, excellent pour la santé.",
        description_en: "Pure Orange Blossom honey harvested from the fragrant plains of Mitidja, Blida. Soft hints of citrus, completely unfiltered.",
        tags: ["miel", "oranger", "mitidja", "bio", "blida"]
      }
    ]
  },
  {
    id: "store_8",
    name: "Rucher National de Bouira",
    slug: "rucher-bouira",
    subdomain: "bouira-honey.platform.dz",
    logo: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?w=800&auto=format&fit=crop&q=80",
    description: "High-purity mountain honey harvested from the wildflowers and steep forests of Bouira.",
    bio: "A family apiary located at the foot of Mount Djurdjura. We harvest wildflower honey from organic Eucalyptus and Arbutus forest groves.",
    wilaya: "Bouira",
    wilayaCode: "10",
    address: "Lakhdaria hauteurs, Bouira",
    coordinates: { lat: 36.3734, lng: 3.9015 },
    rating: 4.78,
    categories: ["Food"],
    verified: true,
    premiumTier: "Starter",
    contact: {
      phone: "+213 770 12 99 88",
      email: "bouira.apiculture@platdz.com"
    },
    reviews: [
      {
        id: "rev_8_1",
        author: "Mohamed Belkacem",
        authorLocation: "Sétif",
        rating: 4.8,
        comment: "Excellent miel d'Eucalyptus ! Très efficace pour calmer les maux de gorge. Livraison rapide en 48h.",
        date: "2026-05-10",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_8_1",
        storeId: "store_8",
        name: "Miel d'Eucalyptus Pur des Forêts de Bouira",
        category: "Food",
        price: 5800,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.85,
        reviews: [],
        description_ar: "عسل الكاليتوس (أوكالبتوس) الطبيعي الأصيل والحر المستخرج من غابات ولاية البويرة الجبلية. معالج للبرد والسعال والالتهابات التنفسية.",
        description_fr: "Miel d'eucalyptus récolté dans les massifs forestiers de Bouira. Idéal pour adoucir la gorge et soigner les bronchites hivernales.",
        description_en: "Authentic wild Eucalyptus honey harvested in high altitude pine forests of Bouira. Great health benefits for soothing respiratory paths.",
        tags: ["miel", "eucalyptus", "bouira", "sante", "naturel"]
      },
      {
        id: "p_8_2",
        storeId: "store_8",
        name: "Pollen d'Abeille Bio & Crème Royale",
        category: "Food",
        price: 2900,
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "حبوب اللقاح البيولوجية الطازجة مع لمسة عسلية مغذية جداً لبناء المناعة وصحة الرياضيين والأطفال، مستخرجة مباشرة من خلايانا في جبال جرجرة.",
        description_fr: "Véritables grains de pollen frais récoltés par les abeilles du Djurdjura. Super-aliment énergisant à prendre à jeun tous les matins.",
        description_en: "100% organic local flower pollen grains and royal jelly blend, high in protein and enzymes, straight from mountain hives.",
        tags: ["pollen", "rucher", "bio", "vitalité", "miel"]
      }
    ]
  },
  {
    id: "store_9",
    name: "Aurès Tradition & Kachabia",
    slug: "aures-trads",
    subdomain: "aures-chaoui.platform.dz",
    logo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    description: "Manteaux légendaires en laine de chameau Kachabia et bijoux traditionnels argentés de l'Aurès.",
    bio: "Installés à Batna, nous sommes fiers de collaborer avec les tisserands traditionnels chaouis. Nous confectionnons des kachabias et bernous luxueux en pure laine vierge.",
    wilaya: "Batna",
    wilayaCode: "05",
    address: "Route des Aurès, Batna",
    coordinates: { lat: 35.5560, lng: 6.1740 },
    rating: 4.9,
    categories: ["Crafts", "Fashion"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 33 55 11 22",
      email: "contact@aures-trads.dz",
      facebook: "AuresTraditionalKachabia"
    },
    reviews: [
      {
        id: "rev_9_1",
        author: "Chaker Chaoui",
        authorLocation: "Batna",
        rating: 5,
        comment: "La kachabia est incroyablement chaude et lourde, le tissu en laine de chameau est d'une authenticité rare. Prix amplement mérité.",
        date: "2026-04-18",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_9_1",
        storeId: "store_9",
        name: "Kachabia Légendaire Chaoui en Poil de Chameau (Waber)",
        category: "Fashion",
        price: 26000,
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.95,
        reviews: [],
        description_ar: "القشابية الأوراسية التقليدية الفاخرة المنسوجة يدويًا من صوف ووبر الجمال الفاخر. تمنح دفئاً رائعاً للشتاء القارس مع تصميم يرمز للشرف السلالي.",
        description_fr: "Manteau lourd Kachabia traditionnel des Aurès tissé entièrement à la main en poil de chameau premium (Waber). Une isolation glaciale légendaire.",
        description_en: "Premium traditional Aurès Kachabia handcrafted from high-grade camel wool (Waber). Extremely warm design made to withstand alpine Algerian winters.",
        tags: ["kachabia", "tradition", "chaoui", "laine", "vetement"]
      },
      {
        id: "p_9_2",
        storeId: "store_9",
        name: "Pendentifs de Khamsa d'Argent Fin Chaoui",
        category: "Crafts",
        price: 11500,
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.8,
        reviews: [],
        description_ar: "قلادة الخميسة الأوراسية الفضية التقليدية المصنعة يدوياً بBatna. تفاصيل دقيقة مستوحاة من الحلي الأمازيغية الشاوية العريقة.",
        description_fr: "Pendentif Khamsa traditionnel gravé de motifs géométriques chaouis en argent massif pour femmes fières.",
        description_en: "Traditional handcrafted solid silver Khamsa necklace decorated with cultural Aurès symbols, lightweight but highly durable.",
        tags: ["argent", "bijou", "khamsa", "chaoui", "artisanat"]
      }
    ]
  },
  {
    id: "store_10",
    name: "L'Olivier de l'Edough - Annaba",
    slug: "olivier-edough",
    subdomain: "edough-olive.platform.dz",
    logo: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&auto=format&fit=crop&q=80",
    description: "Huile d'olive d'exception pressée à froid et récoltée sur les collines du Mont Edough.",
    bio: "Notre maison produit une huile d'olive vierge bio et de caractère sur les terrasses côtières d'Annaba (Bône). Des olives mûres récoltées à la main pour un jus d'olive d'excellence.",
    wilaya: "Annaba",
    wilayaCode: "23",
    address: "Col de l'Edough, Seraïdi, Annaba",
    coordinates: { lat: 36.9100, lng: 7.7200 },
    rating: 4.82,
    categories: ["Food"],
    verified: true,
    premiumTier: "Growth",
    contact: {
      phone: "+213 38 88 44 22",
      email: "contact@olivier-edough.dz"
    },
    reviews: [
      {
        id: "rev_10_1",
        author: "Yasmine Bouneb",
        authorLocation: "Constantine",
        rating: 5,
        comment: "Excellent goût fruité avec une légère ardence poivrée en fin de bouche! Le goût de l'huile traditionnelle de Kabylie et de Seraïdi.",
        date: "2026-05-18",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_10_1",
        storeId: "store_10",
        name: "Huile d'Olive Extra Vierge Pressée à Froid - Bidon 5L",
        category: "Food",
        price: 7500,
        stock: 120,
        imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "زيت زيتون بكر ممتاز طبيعي 100% معصور على البارد من جبال سرايدي بجبل إيدوغ عنابة. نكهة غنية ورائحة قوية وصافية مثالية لصحتكم ووجباتكم اليومية.",
        description_fr: "Huile d'olive vierge extra de calibre supérieur extraite à froid du Mont Edough à Annaba. Bidon métallique de 5L préservant le goût et les nutriments.",
        description_en: "Extra virgin olive oil cold-pressed from the heights of Mount Edough in Annaba. Clear and fruity premium flavor profile. 5L metal container.",
        tags: ["huile d'olive", "annaba", "edough", "bio", "terroir"]
      },
      {
        id: "p_10_2",
        storeId: "store_10",
        name: "Olives Vertes de l'Edough Farcies à la Harissa Royale",
        category: "Food",
        price: 950,
        stock: 80,
        imageUrl: "https://images.unsplash.com/photo-1541009249019-b2f56b7cd831?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "زيتون أخضر بوني كبير مخلل ومحشو يدوياً بالهريسة العربية الحارة والمنكه بالأعشاب الطازجة، مقبل ممتع لمائدتكم الرمضانية أو العائلية.",
        description_fr: "Grosses olives vertes dénoyautées farcies artisanalement avec notre harissa maison de Provence et d'Annaba d'un piquant équilibré.",
        description_en: "Jumbo green olives stuffed with authentic local spicy harissa and organic oil, perfect for traditional tables and salads.",
        tags: ["olives", "harissa", "epicerie", "annaba", "apero"]
      }
    ]
  },
  {
    id: "store_11",
    name: "M'zab Eco-Bois & Palmier",
    slug: "mzab-ecobois",
    subdomain: "mzab-wood.platform.dz",
    logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    description: "Mobilier design écologique et vannerie fine à base de palmier dattier.",
    bio: "Basés dans la vallée sacrée de Ghardaïa, nous revalorisons le bois de palmier issu des ravalements d'oasis pour créer des objets décoratifs minimalistes pour la maison moderne.",
    wilaya: "Ghardaïa",
    wilayaCode: "47",
    address: "Rue des Arcades, Ghardaïa Cente",
    coordinates: { lat: 32.4855, lng: 3.6700 },
    rating: 4.89,
    categories: ["Home", "Crafts"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 29 14 55 66",
      email: "eco.mzab@platdz.com",
      instagram: "mzab_ecodesign_palm"
    },
    reviews: [
      {
        id: "rev_11_1",
        author: "Kenza Mzab",
        authorLocation: "Ghardaïa",
        rating: 5,
        comment: "La table de palmier est une merveille. Un bois si lourd et robuste avec un veinage tigré unique en son genre.",
        date: "2026-05-15",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_11_1",
        storeId: "store_11",
        name: "Table de Chevet Minimaliste en Bois de Palmier",
        category: "Home",
        price: 19500,
        stock: 4,
        imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "طاولة سرير (كومودينو) غاية في الأناقة مصنوعة يدوياً بالكامل من خشب نسيج النخيل المتميز بتعرجاته الجميلة ومقاومته العالية للرطوبة والحرارة.",
        description_fr: "Table de nuit cubique fabriquée en bois de palmier de Ghardaïa. Traitement à l'huile de lin naturelle pour un aspect de veinures tigrées brunes somptueux.",
        description_en: "Minimalist bedside table handcrafted from local date-palm wood. Eco-responsible treatment showcasing organic wooden shades.",
        tags: ["table", "bois", "palmier", "design", "ghardaia"]
      },
      {
        id: "p_11_2",
        storeId: "store_11",
        name: "Corbeille Tressée Ronde en Feuilles de Palmier",
        category: "Crafts",
        price: 2300,
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.8,
        reviews: [],
        description_ar: "قفة أو سلة دائرية واسعة مصنوعة من أوراق السعف الطبيعية المنسوجة يدوياً، مثالية لحفظ الخبز والخضف أو كقطعة زينة حائطية متميزة.",
        description_fr: "Panier de rangement de style rustique tressé à la main en feuilles de palmier séchées au soleil du Sahara. Durable et multi-usage.",
        description_en: "Rustic storage basket meticulously braided using organic sun-dried palm leaves. Sturdy handles for absolute comfort.",
        tags: ["panier", "سعف", "تلوين", "سلة", "artisanat"]
      }
    ]
  },
  {
    id: "store_12",
    name: "Caravane du Tassili - Djanet",
    slug: "caravane-tassili",
    subdomain: "caravane-djanet.platform.dz",
    logo: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80",
    description: "Joyaux d'argent targuis et maroquinerie nomade façonnée au cœur du Sahara.",
    bio: "Une association d'orfèvres et de teinturières touaregs à Djanet. Chaque pièce de bijouterie d'argent ou sacoche de cuir raconte les étoiles de la caravane du grand désert.",
    wilaya: "Djanet",
    wilayaCode: "57",
    address: "Quartier Artisanal, Djanet",
    coordinates: { lat: 24.5539, lng: 9.4847 },
    rating: 4.96,
    categories: ["Crafts", "Fashion"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 29 47 11 00",
      email: "tassili.nomads@gmx.com"
    },
    reviews: [
      {
        id: "rev_12_1",
        author: "Adel Bouras",
        authorLocation: "Algiers",
        rating: 5,
        comment: "La Croix d'Agadez est magnifique! L'argent est pur et poli avec une brillance historique. Expédition et suivi parfaits par avion.",
        date: "2026-05-12",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_12_1",
        storeId: "store_12",
        name: "Grande Besace Nomade du Sahara en Cuir Teint",
        category: "Fashion",
        price: 18000,
        stock: 3,
        imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "حقيبة كتف صحراوية تقليدية (تاغودا) ملونة وطويلة مصنوعة من جلد الإبل المتين، صبغت يدوياً بنبات النيلة ومطرزة بزخارف التوارق الصحراوية الخالدة.",
        description_fr: "Sacoche en cuir de dromadaire teint à l'indigo naturel par les femmes de Djanet. Franges décoratives protectrices et fermoir en corne.",
        description_en: "Nomadic Camel Leather travel messenger bag featuring hand-dyed dark indigo hints, with protective leather fringe patterns.",
        tags: ["sac", "cuir", "sahara", "touareg", "nomade"]
      },
      {
        id: "p_12_2",
        storeId: "store_12",
        name: "Pendentif Croix du Sud d'Agadez en Argent Pur",
        category: "Crafts",
        price: 9800,
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 5.0,
        reviews: [],
        description_ar: "قلادة صليب الصحراء الفضية الأسطورية الممثلة لرموز الحماية والتوازن التارقية الأصيلة، مصنوعة من الفضة النقية المصهورة يدوياً.",
        description_fr: "Croix Touareg traditionnelle coulée selon la méthode millénaire de la cire perdue en argent très pur. Symbole de guidage céleste.",
        description_en: "Sterling silver Tuareg Southern Cross symbolising guidance across the majestic dunes of Southern Algeria.",
        tags: ["croix", "argent", "targui", "bijou", "djanet"]
      }
    ]
  },
  {
    id: "store_13",
    name: "Oran Silk Elégance",
    slug: "oran-silk",
    subdomain: "oran-blousa.platform.dz",
    logo: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    description: "Créations de Blousates oranaises raffinées et robes de cérémonies d'Oran El Bahia.",
    bio: "Une maison de couture d'exception sise à Oran. Nous sélectionnons des brocarts et tissus de soie d'une légèreté exceptionnelle pour confectionner la traditionnelle Blousa d'Oran.",
    wilaya: "Oran",
    wilayaCode: "31",
    address: "Rue Larbi Ben M'hidi, Oran Cente",
    coordinates: { lat: 35.7010, lng: -0.6250 },
    rating: 4.8,
    categories: ["Fashion"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 41 33 22 11",
      email: "atelier.oran@platdz.com",
      instagram: "oran_silk_chic"
    },
    reviews: [
      {
        id: "rev_13_1",
        author: "Fadoua Oran",
        authorLocation: "Oran",
        rating: 4.9,
        comment: "Magnifique Blousa ! Les perles et la broderie sont si délicates. Une créatrice à l'écoute et de bons conseils.",
        date: "2026-05-19",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_13_1",
        storeId: "store_13",
        name: "Blousa Oranaise Brodée aux Fils d'Or (Sder Zgach)",
        category: "Fashion",
        price: 49000,
        stock: 3,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.9,
        reviews: [],
        description_ar: "بلوزة وهرانية ملكية مزينة بصدر مطرز بدقة بالخرز واللؤلؤ اللامع، دمج مذهل بين الدانتيل والأورجانزا الحريرية للعروس الباهية.",
        description_fr: "Somptueuse Blousa El Bahia traditionnelle confectionnée en mousseline fine, plastron richement orné de perles fines et de fils dorés scintillants.",
        description_en: "Classic Oran Blousa decorated with heavy gold-thread beaded chest plates (Sder Zgach). Essential dress for celebration.",
        tags: ["blousa", "oran", "robe", "ceremonie", "fashion"]
      },
      {
        id: "p_13_2",
        storeId: "store_13",
        name: "Écharpe de Soie Pure d'Oran Teinte Naturel",
        category: "Fashion",
        price: 8500,
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "وشاح ناعم وأنيق من الحرير الطبيعي 100% المصبوغ بمواد نباتية طبيعية بالكامل في ورشتنا بوهران، ملمس دافئ وخفيف لإطلالة راقية.",
        description_fr: "Écharpe d'une douceur absolue tissée en pure soie, colorée à base de pigments d'origine végétale locale.",
        description_en: "Hand-dyed 100% pure silk scarf with local organic vegetal pigment extracts, luxurious feel and design.",
        tags: ["echarpe", "soie", "oran", "accessoire", "fashion"]
      }
    ]
  },
  {
    id: "store_14",
    name: "Hauts-Plateaux Semoule & Terroir - Sétif",
    slug: "grenier-setif",
    subdomain: "setif-terroir.platform.dz",
    logo: "https://images.unsplash.com/photo-1586444248902-2f34eddc137a?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1586444248902-2f34eddc137a?w=800&auto=format&fit=crop&q=80",
    description: "Couscous d'orge roulé à la main et épices traditionnelles du grenier d'Algérie.",
    bio: "Une coopérative de femmes agricultrices de Sétif produisant le meilleur couscous à base de semoule de blé dur et d'orge grillée, roulé méticuleusement à la main.",
    wilaya: "Sétif",
    wilayaCode: "19",
    address: "Avenue du 8 Mai 1945, Sétif Cente",
    coordinates: { lat: 36.1901, lng: 5.4137 },
    rating: 4.75,
    categories: ["Food"],
    verified: true,
    premiumTier: "Starter",
    contact: {
      phone: "+213 36 62 10 99",
      email: "order.setif@gmx.dz"
    },
    reviews: [
      {
        id: "rev_14_1",
        author: "Fouad Setifi",
        authorLocation: "Sétif",
        rating: 5,
        comment: "Le couscous d'orge (Belboula) est très digeste, comme le faisait ma grand-mère. Très bon rapport qualité-prix.",
        date: "2026-05-14",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_14_1",
        storeId: "store_14",
        name: "Couscous d'Orge Traditionnel (Belboula) Roulé Main - Sac 2Kg",
        category: "Food",
        price: 1100,
        stock: 150,
        imageUrl: "https://images.unsplash.com/photo-1586444248902-2f34eddc137a?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.8,
        reviews: [],
        description_ar: "كسكس الشعير (بلمبولة) الصحي واللذيذ، مفتول يدوياً بالكامل بحب وخبرة نساء الهضاب العليا في سطيف. غني بالألياف وسهل الهضم لغذائكم الصحي.",
        description_fr: "Véritable couscous d'orge bio du terroir algérien roulé de façon paysanne au tamis de jonc. Sac en coton écologique préservant de 2Kg.",
        description_en: "Classic hand-rolled organic barley couscous (Belboula) crafted by women cooperatives of Sétif. Premium dietary source of fibers.",
        tags: ["couscous", "orge", "setif", "epicerie", "terroir"]
      },
      {
        id: "p_14_2",
        storeId: "store_14",
        name: "Mélange Royal Ras El Hanout Rouge Sétifien",
        category: "Food",
        price: 850,
        stock: 200,
        imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "خلاط البهارات السطايفي السري (رأس الحانوت الأحمر) مكون من أكثر من 15 تابل مطحون ومحمص، سر طهي الشربا والحريرة والمأكولات الشهية.",
        description_fr: "Mélange somptueux d'épices Ras El Hanout rouge fait maison suivant la recette secrète de Sétif. Composé de carvi, coriandre, gingembre et piment séché.",
        description_en: "Aromatic Red Sétifian Ras El Hanout royal spice blend. Mix of over 15 hand-ground spices including premium coriander and caraway.",
        tags: ["epices", "ras el hanout", "cuisine", "setif", "tradition"]
      }
    ]
  },
  {
    id: "store_15",
    name: "Le Souf Cuir & Rose des Sables",
    slug: "souf-leather",
    subdomain: "souf-cuir.platform.dz",
    logo: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80",
    description: "Sandales légères et sacs en véritable cuir de chameau saharien d'El Oued.",
    bio: "Une tannerie familiale de la ville aux mille coupoles d'El Oued. Nous fabriquons des sandales solides et des sacs d'une grande résistance pour les voyageurs du désert.",
    wilaya: "El Oued",
    wilayaCode: "39",
    address: "Marché Traditionnel d'El Oued, El Oued",
    coordinates: { lat: 33.3644, lng: 6.8529 },
    rating: 4.79,
    categories: ["Fashion", "Crafts"],
    verified: true,
    premiumTier: "Growth",
    contact: {
      phone: "+213 32 21 00 55",
      email: "souf.leather@platdz.com"
    },
    reviews: [
      {
        id: "rev_15_1",
        author: "Ziad Guediri",
        authorLocation: "El Oued",
        rating: 5,
        comment: "Les sandales sont d'un confort légendaire sous le soleil de plomb. Cuir de chameau souple et extrêmement coriace.",
        date: "2026-05-15",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_15_1",
        storeId: "store_15",
        name: "Sac de Voyage Souple en Cuir de Chameau (Bagage Nomade)",
        category: "Fashion",
        price: 21500,
        stock: 6,
        imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.85,
        reviews: [],
        description_ar: "حقيبة سفر جلدية كبيرة ومريحة مصنوعة من جلد الإبل الصلب ذو مقاومة عالية وخياطة مزدوجة معززة بجيوب متعددة لحفظ المقتنيات.",
        description_fr: "Sac de voyage spacieux de forme polochon fait de cuir de chameau ultra-résistant de couleur naturelle fauve. Idéal pour des années de voyage.",
        description_en: "Heavy-duty Camel Leather duffle bag designed with vintage styles, high durability and solid metal double zippers.",
        tags: ["sac", "cuir", "chameau", "voyage", "el oued"]
      },
      {
        id: "p_15_2",
        storeId: "store_15",
        name: "Sandales Traditionnelles en Cuir de Chameau Cousues Main",
        category: "Fashion",
        price: 3800,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.7,
        reviews: [],
        description_ar: "صندل صحراوي صيفي مصنوع بالكامل من جلد الإبل الأصيل مخيط يدوياً، يسمح بتهوية جيدة وملائمة للمناخ الحار بكل راحة ومتانة.",
        description_fr: "Sandales de marche sahariennes idéales pour les climats arides. Brides de confort en cuir de chameau et semelle intérieure amortissante.",
        description_en: "Artisanal Camel leather light desert sandals featuring reinforced hand-stitching and sweat-absorbing orthopedic insoles.",
        tags: ["sandales", "cuir", "sahara", "chaussures", "el oued"]
      }
    ]
  },
  {
    id: "store_16",
    name: "Dinanderie Fine de la Casbah d'Alger",
    slug: "dinanderie-casbah",
    subdomain: "casbah-copper.platform.dz",
    logo: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80",
    description: "Métaux martelés brillants, cafetières en cuivre rouge et miroirs ottomans sculptés à la main.",
    bio: "Un atelier de maîtres dinandiers transmettant de génération en génération les secrets de la Casbah d'Alger. Chaque miroir ou bougeoir de cuivre rouge porte l'esprit de l'Amirauté.",
    wilaya: "Algiers",
    wilayaCode: "16",
    address: "Impasse des Artisans, Casbah d'Alger",
    coordinates: { lat: 36.7562, lng: 3.0560 },
    rating: 4.92,
    categories: ["Crafts", "Home"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 661 54 32 10",
      email: "dinanderie.casbah@platdz.com"
    },
    reviews: [
      {
        id: "rev_16_1",
        author: "Meziane Algiers",
        authorLocation: "Algiers",
        rating: 5,
        comment: "La Djezoua est superbe, l'épaisseur du cuivre est excellente pour une diffusion homogène du café chaud. Authentique bijou de cuisine.",
        date: "2026-05-18",
        sentiment: "positive"
      }
    ],
    products: [
      {
        id: "p_16_1",
        storeId: "store_16",
        name: "Cafetière Traditionnelle Algérienne (Djezoua) en Cuivre Rouge",
        category: "Crafts",
        price: 6500,
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.95,
        reviews: [],
        description_ar: "جزوة قهوة مصنوعة يدوياً من النحاس الأحمر الثقيل بمقبض خشبي عازل للحرارة، مثالية لتحضير القهوة التركية والجزائرية التقليدية المحبوبة.",
        description_fr: "Cafetière turco-algéroise Djezoua en cuivre rouge martelé d'un diamètre robuste avec une longue poignée de bois isolante pour un café parfaitement mousseux.",
        description_en: "Handmade heavy solid red copper Djezoua (coffee pot) with ergonomic heat-insulating wooden handles for traditional rich coffee brewing.",
        tags: ["djezoua", "cuivre", "cafe", "casbah", "artisanat"]
      },
      {
        id: "p_16_2",
        storeId: "store_16",
        name: "Grand Miroir en Laiton Doré Martelée Main Casbah",
        category: "Home",
        price: 16800,
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=80",
        status: "active",
        rating: 4.88,
        reviews: [],
        description_ar: "مرآة حائطية رقيقة بيضاوية غنية بالنقوش العثمانية والخطوط الأندلسية المستلهمة من قصور القصبة القديمة، مطروقة يدوياً على النحاس الأصفر اللامع.",
        description_fr: "Miroir d'apparat en laiton massif martelé sur plaque de pin, forme ogive ottomane rehaussée de dentelle de métal ciselée avec le plus grand art du détail.",
        description_en: "Majestic authentic Casbah hand-hammered shiny brass mirror portraying exquisite Ottoman royal geometrical contours.",
        tags: ["miroir", "cuivre", "deco", "casbah", "laiton"]
      }
    ]
  }
];

const EXTRA_STORES: MerchantStore[] = [
  {
    id: "store_17",
    name: "Parfums d'Orient - Ghardaïa",
    slug: "parfums-orient-ghardaia",
    subdomain: "parfums-mzab.platform.dz",
    logo: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80",
    description: "Traditional natural scents, musk, and amber of the Sahara.",
    bio: "We distillate traditional organic flower oils and curate authentic Saharan musk, wood, and spice fragrances in Beni Isguen, Ghardaïa.",
    wilaya: "Ghardaïa",
    wilayaCode: "47",
    address: "Palmeraie de Beni Isguen, Ghardaïa",
    coordinates: { lat: 32.4909, lng: 3.6738 },
    rating: 4.88,
    categories: ["Crafts", "Home"],
    verified: true,
    premiumTier: "Growth",
    contact: {
      phone: "+213 29 11 44 22",
      email: "parfums.mzab@gmx.com",
    },
    reviews: [
      {
        id: "rev_17_1",
        author: "Siham Mezab",
        authorLocation: "Ghardaïa",
        rating: 5,
        comment: "Senteurs absolument divines et très durables! L'ambre royal sent merveilleusement bon.",
        date: "2026-05-14",
        sentiment: "positive"
      }
    ],
    products: []
  },
  {
    id: "store_18",
    name: "Céramique de Bider - Nedroma",
    slug: "ceramique-bider",
    subdomain: "bider-pottery.platform.dz",
    logo: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80",
    description: "Classic glazed terracotta pottery and hand-painted plates from Nedroma.",
    bio: "Preserving the ancestral andalusian glazing methods of Bider, our family enterprise shapes raw clay into stunning colorful tableware and houseware.",
    wilaya: "Tlemcen",
    wilayaCode: "13",
    address: "Village de Bider, Nedroma, Tlemcen",
    coordinates: { lat: 35.0188, lng: -1.7482 },
    rating: 4.91,
    categories: ["Crafts", "Home"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 43 12 40 10",
      email: "bider.terracotta@yahoo.fr",
    },
    reviews: [
      {
        id: "rev_18_1",
        author: "Ali Nedromi",
        authorLocation: "Tlemcen",
        rating: 5,
        comment: "Excellent travail d'artisanat. Les couleurs de l'émail andalou sont d'un éclat incroyable.",
        date: "2026-05-20",
        sentiment: "positive"
      }
    ],
    products: []
  },
  {
    id: "store_19",
    name: "La Djebba de Constantine Elegance",
    slug: "djebba-constantine",
    subdomain: "constantine-djebba.platform.dz",
    logo: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    description: "Imperial Fergani velvet dresses hand-embroidered with pure gold thread (Majboub).",
    bio: "Our master tailors in Constantine design elegant velvet dresses showcasing royal andalusian heritage embroidered in thick local gold braids.",
    wilaya: "Constantine",
    wilayaCode: "25",
    address: "Boulevard Mohamed Belouizdad, Constantine",
    coordinates: { lat: 36.3650, lng: 6.6147 },
    rating: 4.94,
    categories: ["Fashion"],
    verified: true,
    premiumTier: "Pro",
    contact: {
      phone: "+213 31 44 88 99",
      email: "contact@fergani-chic.dz",
    },
    reviews: [
      {
        id: "rev_19_1",
        author: "Lamia Constantinoise",
        authorLocation: "Constantine",
        rating: 5,
        comment: "La djebba est une merveille d'artisanat ! On sent l'histoire et le prestige dans chaque point du fil d'or.",
        date: "2026-05-21",
        sentiment: "positive"
      }
    ],
    products: []
  },
  {
    id: "store_20",
    name: "Algeria Gadget & Innovation",
    slug: "algeria-gadgets",
    subdomain: "algiers-iot.platform.dz",
    logo: "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=800&auto=format&fit=crop&q=80",
    description: "Curator of smart electronic devices, home automation accessories, and innovative gadgets in Algiers.",
    bio: "Bringing the latest smart tech, IoT modules, and sleek electronics to Algerian tech enthusiasts with fast delivery and high responsive support.",
    wilaya: "Algiers",
    wilayaCode: "16",
    address: "Avenue Mustapha El Ouali, Alger Centre",
    coordinates: { lat: 36.7538, lng: 3.0588 },
    rating: 4.75,
    categories: ["Electronics"],
    verified: true,
    premiumTier: "Growth",
    contact: {
      phone: "+213 655 40 40 40",
      email: "support@algeria-gadgets.dz",
    },
    reviews: [
      {
        id: "rev_20_1",
        author: "Samy Algiers",
        authorLocation: "Alger",
        rating: 5,
        comment: "Super gadgets ! Chargeur induction ultra rapide et livraison en 24h sur Alger.",
        date: "2026-05-18",
        sentiment: "positive"
      }
    ],
    products: []
  }
];

const CRAFTS_TEMPLATES = [
  {
    name: "Porte-clés en Cuir de Chameau Gravé",
    price: 950,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80",
    tags: ["cuir", "artisanat", "cadeau"],
    description_ar: "ميدالية مفاتيح أنيقة من جلد الجمل الأصيل، منقوشة يدوياً بزخارف صحراوية جميلة.",
    description_fr: "Porte-clés artisanal en véritable cuir de chameau saharien, gravé à la main de motifs kabyles.",
    description_en: "Artisanal camel leather keychain hand-carved with traditional sahara designs."
  },
  {
    name: "Lampe Suspendue en Cuivre Ciselé",
    price: 15500,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80",
    tags: ["lampe", "deco", "copper"],
    description_ar: "مصباح نحاسي معلق مصنوع يدويًا وجذاب بنقوش عثمانية فريدة تمنح إنارة دافئة لبيتك.",
    description_fr: "Lustre oriental en cuivre pur martelé de la Casbah, offrant une diffusion de lumière tamisée féerique.",
    description_en: "Classic brass hanging lantern carefully hand-etched for romantic retro shadow patterns."
  },
  {
    name: "Assiette Décorative en Argile de Bider",
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&auto=format&fit=crop&q=80",
    tags: ["ceramic", "artisanat", "assiette"],
    description_ar: "طبق خزفي مزخرف وملون مستوحى من التراث الأندلسي العتيق بمدينة ندرومة.",
    description_fr: "Assiette décorative en poterie émaillée faite main aux motifs de Nedroma.",
    description_en: "Ancestral hand-glazed clay plate embellished with andalusian floral designs."
  },
  {
    name: "Bague en Argent Massif Touareg",
    price: 6500,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
    tags: ["silver", "bijou", "targui"],
    description_ar: "خاتم فضي تارقي أصيل منقوش بزخارف تمثل نجوم الصحراء وحماية المسافرين.",
    description_fr: "Bague touareg authentique en argent massif gravée par les maîtres orfèvres de Djanet.",
    description_en: "Original Tuareg sterling silver ring hand-engraved with deep desert star representations."
  },
  {
    name: "Tapis Berbère de Table en Laine",
    price: 9500,
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80",
    tags: ["tapis", "laine", "deco"],
    description_ar: "فرش طاولة صوفي قبائلي صغير منسوج باليد وبألوان زاهية مبهجة.",
    description_fr: "Mini-tapis de table berbère en pure laine de mouton, parfait pour égayer un buffet.",
    description_en: "Small decorative handwoven Berber table rug made of lightweight local sheep wool."
  },
  {
    name: "Flûte Traditionnelle en Roseau (Gasba)",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=400&auto=format&fit=crop&q=80",
    tags: ["musique", "roseau", "gasba"],
    description_ar: "قصبة موسيقية تقليدية مصنوعة من الخيزران البري المصقول، صوت دافئ يحاكي تراث الأوراس.",
    description_fr: "Gasba en roseau sauvage sélectionné et percé à la main pour les mélodies folkloriques.",
    description_en: "Traditional Algerian reed flute (Gasba) beautifully dried and hand-tuned for deep emotional sounds."
  },
  {
    name: "Panier Kabyle Multicolore en Sceau",
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=400&auto=format&fit=crop&q=80",
    tags: ["panier", "سعف", "artisanat"],
    description_ar: "سلة قبائلية دائرية ملونة مصنوعة يدوياً من السعف الطبيعي وسعف النخل.",
    description_fr: "Panier traditionnel kabyle tressé de fils de laine multicolores pour l'épicerie.",
    description_en: "Vibrant multi-colored Kabyle braided basket, lightweight and stylish storage element."
  },
  {
    name: "Tajine Traditionnel en Terre Cuite",
    price: 3400,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80",
    tags: ["tajine", "cuisine", "deco"],
    description_ar: "طاجين طيني تقليدي مقاوم للحرارة مثالي لتحضير أشهى المأكولات على الجمر.",
    description_fr: "Plat à tajine traditionnel en argile rouge de Kabylie, cuisson douce mijotée.",
    description_en: "Genuine red clay cooking Tajine made with fire-resistant clay for delicious stews."
  }
];

const FOOD_TEMPLATES = [
  {
    name: "Miel de Forêt Sauvage Premium",
    price: 4900,
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80",
    tags: ["miel", "bio", "epicerie"],
    description_ar: "عسل الغابة البري الصافي واللذيذ غني بفوائد صحية فريدة.",
    description_fr: "Miel sauvage de forêt alpine récolté sur les hauteurs côtières de l'Edough.",
    description_en: "Pure mountain forest honey harvested with traditional sustainable bee-keeping."
  },
  {
    name: "Huile de Figue de Barbarie Organique",
    price: 8500,
    imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=400&auto=format&fit=crop&q=80",
    tags: ["huile", "bio", "sante"],
    description_ar: "زيت بذور التين الشوكي العضوي المتميز بفوائده التجميلية والصحية الفائقة.",
    description_fr: "Huile précieuse de pépins de figue de Barbarie pressée à froid de Souk Ahras.",
    description_en: "Extremely rich cold-pressed Prickly Pear seed oil, premium anti-aging beauty elixir."
  },
  {
    name: "Makroudh de Constantine au Miel de Datte",
    price: 2400,
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=80",
    tags: ["sucre", "patisserie", "miel"],
    description_ar: "مقروض قسنطيني تقليدي هش معسل ومحشو بأجود أنواع التمر.",
    description_fr: "Makroudh fondant de Constantine fourré aux dattes écrasées et parfumé à l'eau de rose.",
    description_en: "Delectable semolina Makroudh pastry stuffed with dates, dipped inside sweet pure honey."
  },
  {
    name: "Pâte de Harissa Algérienne Fumée",
    price: 1100,
    imageUrl: "https://images.unsplash.com/photo-1541009249019-b2f56b7cd831?w=400&auto=format&fit=crop&q=80",
    tags: ["harissa", "cuisine", "epices"],
    description_ar: "هريسة عربية حارة وبسيطة مصنوعة يدوياً بالفلفل الحار المشوي والثوم.",
    description_fr: "Harissa d'Annaba artisanale au piment rouge fumé au feu de bois et coriandre.",
    description_en: "Smoky homecrafted Algerian red chilli Harissa paste with olive oil and spices."
  },
  {
    name: "Baklawa aux Amandes et Noix",
    price: 3600,
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=80",
    tags: ["baklawa", "patisserie", "sucre"],
    description_ar: "بقلاوة تقليدية مورقة ومقرمشة ومحشوة باللوز والجوز البلدي المعسل.",
    description_fr: "Baklawa artisanale croustillante de Constantine aux amandes grillées et miel doré.",
    description_en: "Crisp flaky Baklawa squares filled with almonds and nuts under mountain sweet honey."
  },
  {
    name: "Tapenade d'Olives Vertes de Tlemcen",
    price: 1300,
    imageUrl: "https://images.unsplash.com/photo-1541009249019-b2f56b7cd831?w=400&auto=format&fit=crop&q=80",
    tags: ["olives", "sauce", "terroir"],
    description_ar: "تغمسة زيتون أخضر مالح بنكهة ثوم المزارع وزيت الزيتون الصافي.",
    description_fr: "Écrase d'olives sauvages de Nedroma aux herbes locales de Provence et d'Algérie.",
    description_en: "Premium green olive tapenade enriched with mountain olive oil and garlic."
  },
  {
    name: "Thé Vert Biologique à la Menthe Saharienne",
    price: 950,
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&auto=format&fit=crop&q=80",
    tags: ["the", "menthe", "sahara"],
    description_ar: "أوراق الشاي الأخضر العضوي ممزوج بالنعناع الصحراوي المركز والمجفف.",
    description_fr: "Mélange spécial thé à la menthe fort du Sahara, séché à l'ombre de l'Oasis.",
    description_en: "Premium dry green tea blended with organic wild mint, directly from the Sahara."
  },
  {
    name: "Dates Deglet Nour Farcies aux Noix",
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=400&auto=format&fit=crop&q=80",
    tags: ["dates", "noix", "cadeau"],
    description_ar: "حبات دقلة نور الفاخرة محشوة بقطع الجوز البلدي اللذيذ لضيافة ملكية.",
    description_fr: "Coffret cadeau de dattes Deglet Nour de qualité supérieure garnies de noix.",
    description_en: "Elegant gift selection of Deglet Nour dates stuffed with fresh crunchy walnut halves."
  }
];

const ELECTRONICS_TEMPLATES = [
  {
    name: "Support de Charge sans Fil Bambou",
    price: 6800,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
    tags: ["tech", "chargeur", "bureau"],
    description_ar: "شاحن لاسلكي سريع مدمج بقاعدة خشبية صديقة للبيئة تمنح أناقة لسطح مكتبك.",
    description_fr: "Chargeur à induction rapide recouvert de bois de bambou écologique, compatible Qi.",
    description_en: "Premium natural bamboo Qi-wireless charger standing mount for clean desks."
  },
  {
    name: "Souris de Jeu Sans Fil Ergonomique",
    price: 8900,
    imageUrl: "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=400&auto=format&fit=crop&q=80",
    tags: ["tech", "gaming", "souris"],
    description_ar: "ماوس ألعاب لاسلكي سريع الاستجابة مع بطارية طويلة المدى وإضاءة RGB مبهجة.",
    description_fr: "Souris esport sans fil de haute précision, ergonomique et rétroéclairage RVB.",
    description_en: "Wired-grade wireless gaming mouse featuring extreme optical precision specs and RGB."
  },
  {
    name: "Casque Audio à Réduction Actives de Bruit",
    price: 19500,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    tags: ["casque", "audio", "tech"],
    description_ar: "سماعة رأس لاسلكية مريحة مع عزل ضوضاء قوي وصوت نقي ذو جهير عميق.",
    description_fr: "Casque Bluetooth à réduction active de bruit ambiant, autonomie de 40 heures.",
    description_en: "Over-ear active noise cancelling bluetooth headphones with rich audio and rich bass."
  },
  {
    name: "Lampe LED Multicouleur pour Streamer",
    price: 5200,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80",
    tags: ["led", "rgb", "bureau"],
    description_ar: "إضاءة ليد حلقية قابلة لتعديل الألوان وشدة السطوع، لتسجيل فيديوهات أو البث المباشر.",
    description_fr: "Anneau lumineux LED multicolore RGB avec trépied de table stable pour créateurs.",
    description_en: "Dimmable RGB Ring Light with sturdy table tripod holder for digital video creators."
  },
  {
    name: "Clavier Mécanique Compact 60% RGB",
    price: 12800,
    imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&auto=format&fit=crop&q=80",
    tags: ["tech", "gaming", "clavier"],
    description_ar: "لوحة مفاتيح ميكانيكية صغيرة الحجم مصممة للبرمجة والألعاب السريعة.",
    description_fr: "Clavier mécanique gamer 60% compact, touches réactives et rétroéclairage vif.",
    description_en: "Ultra-compact 60% layout gaming mechanical keyboard for maximized desktop workspace."
  },
  {
    name: "Refroidisseur Ventilateur pour PC Portable",
    price: 4900,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80",
    tags: ["cooling", "tech", "accessoire"],
    description_ar: "قاعدة تبريد صامتة وقوية مع مراوح مزدوجة لحماية لابتوبك من الحرارة الزائدة.",
    description_fr: "Support de refroidissement à deux ventilateurs silencieux rétroéclairés bleus.",
    description_en: "Quiet performance dual-fan cooling pad with ergonomic tilt heights and blue LED."
  },
  {
    name: "Hub USB-C Multi-port 8-en-1",
    price: 6400,
    imageUrl: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&auto=format&fit=crop&q=80",
    tags: ["tech", "hub", "bureau"],
    description_ar: "موزع مدخل يو اس بي سي فريد يدعم نقل الفيديو بدقة 4K وقراءة الكروت والبيانات.",
    description_fr: "Adaptateur USB-C complet avec HDMI 4K, ports USB 3.0 et lecteurs de cartes SD.",
    description_en: "Heavy-duty 8-in-1 USB-C docking hub with premium aluminum finish and 4K output."
  },
  {
    name: "Enceinte sans Fil Portable Water-Resistant",
    price: 11500,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80",
    tags: ["audio", "speaker", "bluetooth"],
    description_ar: "مكبر صوت بلوتوث متنقل ومضاد للماء وصدمات الطبيعة لأحلى المغامرات.",
    description_fr: "Enceinte nomade étanche longue autonomie, son directionnel à 360 degrés.",
    description_en: "IPX6 Waterproof portable bluetooth speaker with deep surround and 20h playtime."
  }
];

const FASHION_TEMPLATES = [
  {
    name: "Ceinture en Cuir de Chèvre Brodé d'Or",
    price: 4500,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80",
    tags: ["ceinture", "cuir", "gold"],
    description_ar: "حزام من الجلد الطبيعي المدبوغ يدوياً ومطرز بخيوط الفتلة الذهبية الجذابة.",
    description_fr: "Ceinture traditionnelle en cuir d'agneau ornée de broderies délicates de fil d'or.",
    description_en: "Stunning handcrafted local leather belt adorned with shiny traditional gold embroidery."
  },
  {
    name: "Babouches de Cérémonie en Velours Chic",
    price: 3600,
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80",
    tags: ["chaussures", "velours", "babouches"],
    description_ar: "بلغة فاخرة من القطيفة الناعمة مطرزة باليد للمناسبات والأعياد السعيدة.",
    description_fr: "Babouches royales en velours de soie bordeaux perlées de fils d'or à la main.",
    description_en: "Imperial velvet slippers (Babouches) detailed with hand-beaded golden cords."
  },
  {
    name: "Kaftan en Lin Léger d'Alger",
    price: 14500,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
    tags: ["kaftan", "lin", "robe"],
    description_ar: "قفطان صيفي خفيف من الكتان الأصيل مريح وعصري للاستعمال اليومي أو المناسبات.",
    description_fr: "Kaftan décontracté en pur lin naturel blanc, brodé de lisérés pastel.",
    description_en: "Vibrant breathable summer kaftan made of quality local linen with delicate lines."
  },
  {
    name: "Bracelet de Cheville Argenté Kabyle (Ikhelkhalen)",
    price: 11200,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80",
    tags: ["bracelet", "argent", "kabyle"],
    description_ar: "خلخال قبائلي عتيق من الفضة النقية مع زخارف ملونة ومرصع بالمرجان الأحمر.",
    description_fr: "Khalkhal kabyle traditionnel en argent massif émaillé aux couleurs ancestrales.",
    description_en: "Authentic Kabyle silver anklet (Khalkhal) highlighted with colored floral enamels."
  },
  {
    name: "Châle en Soie Fleurie Casbah Alger",
    price: 5400,
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80",
    tags: ["soie", "echarpe", "casbah"],
    description_ar: "شال حريري رائع ومريح مزين بنقوشات مستوحاة من زهور حدائق القصبة.",
    description_fr: "Châle traditionnel Casbah en soie brodée de jacquard floral somptueux.",
    description_en: "Exquisite pure silk ornamental shawl capturing Algiers Casbah's historic styles."
  },
  {
    name: "Maillot Sport Algérie Rétro Edition",
    price: 4900,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
    tags: ["vêtement", "maillot", "sport"],
    description_ar: "قميص منتخب الجزائر كلاسيكي أخضر وأبيض مريح وعالي الجودة للرياضيين.",
    description_fr: "Maillot rétro de l'équipe nationale algérienne de football, tissu respirant.",
    description_en: "Classic retro edition Algerian national football jersey designed in green & white."
  },
  {
    name: "Sacoche en Cuir de Chameau Souple",
    price: 11500,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80",
    tags: ["sac", "cuir", "sahara"],
    description_ar: "حقيبة جلدية صغيرة وأنيقة بكتف كتاني متين تناسب كل مشاويرك اليومية.",
    description_fr: "Sacoche bandoulière unisexe en cuir de dromadaire tannage bio rustique.",
    description_en: "Charming camel-skin leather sling cross-body bag for keys, phone and daily accessories."
  },
  {
    name: "Gilet Traditionnel en Velours et Galons (Kardoun)",
    price: 8900,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
    tags: ["veste", "velours", "tradition"],
    description_ar: "صدرية مخملية أنيقة وعريقة مطرزة بخيوط الحرير المبرومة لمختلف الأعياد.",
    description_fr: "Gilet court d'apparat en velours de coton brodé de liserés dorés fins.",
    description_en: "Elegant women's sleeveless short vest made of dense crimson velvet & golden laces."
  }
];

const HOME_TEMPLATES = [
  {
    name: "Encensoir en Cuivre Rouge Casbah",
    price: 4200,
    imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=400&auto=format&fit=crop&q=80",
    tags: ["enco", "deco", "copper"],
    description_ar: "مبخرة نحاسية رائعة لنشر روائح البخور واللبان الجذابة في بيتك.",
    description_fr: "Brûle-parfum traditionnel en cuivre rouge ciselé à la main, idéal pour l'encens.",
    description_en: "Stunning hand-hammered red copper incense burner for Saharan resins and musk."
  },
  {
    name: "Coussin de Sol en Laine Kabyle",
    price: 6800,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&auto=format&fit=crop&q=80",
    tags: ["coussin", "laine", "berber"],
    description_ar: "وسادة أرضية مغايرة ودافئة مصنوعة يدوياً من أصواف الأغنام في غابات جرجرة.",
    description_fr: "Pouf berbère traditionnel en véritable grosse laine de mouton tissé main.",
    description_en: "Cozy floor pouf cushion handcrafted with geometric Kabyle wool weavings."
  },
  {
    name: "Vase Fleuri Céramique de Nedroma",
    price: 3400,
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=80",
    tags: ["vase", "ceramic", "deco"],
    description_ar: "مزهرية من السيراميك المصقول يدويًا برسومات زهرية خضراء وزرقاء أندلسية.",
    description_fr: "Vase artisanal en céramique émaillée, motifs fleuris peints à la main.",
    description_en: "Glossy andalusian style hand-glazed flower vase with intricate royal carvings."
  },
  {
    name: "Bougie Fine Parfumée Miel & Bois Sandal",
    price: 1900,
    imageUrl: "https://images.unsplash.com/photo-1512201858874-15202619bbbf?w=400&auto=format&fit=crop&q=80",
    tags: ["bougie", "parfum", "deco"],
    description_ar: "شمعة معطرة مهدئة برائحة العسل وعبق خشب الصندل الدافئ.",
    description_fr: "Bougie d'ambiance naturelle en cire végétale parfumée au miel d'oranger doux.",
    description_en: "Aromatic ambient candle, made with soy wax and infused with warm orange honey."
  },
  {
    name: "Jeté de Lit en Laine Fine Berbère",
    price: 18500,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80",
    tags: ["draps", "laine", "luxe"],
    description_ar: "غطاء سرير صوفي دافئ وسميك مطرز بزخارف الحماية والرخاء القبائلية العتيقة.",
    description_fr: "Jeté de lit berbère tissé en haute laine, idéal pour apporter chaleur et authenticité.",
    description_en: "Precious geometric wool throw blanket handcrafted with local organic sheep fibers."
  },
  {
    name: "Lanterne en Fer forgé d'Oran",
    price: 5900,
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&auto=format&fit=crop&q=80",
    tags: ["lanterne", "fer", "deco"],
    description_ar: "فانوس حديدي عتيق ومطروق يدوياً، يضفي لمسة شرقية هادئة ومميزة لصالتك.",
    description_fr: "Lanterne orientale sur pied en fer forgé martelé, jeu d'ombres féerique.",
    description_en: "Classic wrought iron standing lantern featuring hand-pressed patterns for lovely shadows."
  },
  {
    name: "Tabouret en Bois de Thuya Ciselé",
    price: 14500,
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&auto=format&fit=crop&q=80",
    tags: ["bois", "thuya", "mobilier"],
    description_ar: "كرسي خشبي صغير ومصقول مصنوع من خشب العرعر الأصيل برائحته الفواحة والدافئة.",
    description_fr: "Tabouret trépied sculpté à la main en bois précieux de thuya rustique ciré.",
    description_en: "Highly polished thuya root wood tripod accent stool with organic woody scents."
  },
  {
    name: "Table de Salon Ronde en Cuivre Gravé",
    price: 24500,
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=80",
    tags: ["table", "deco", "copper"],
    description_ar: "صينية طاولة نحاسية دائرية واسعة على حامل خشبي أصيل، مزينة بنقوش مذهلة.",
    description_fr: "Table basse plateau (séiniya) en laiton gravé main posé sur piétement de cèdre.",
    description_en: "Magnificent brass tray coffee table (Seiniya) resting on folding cedar wood legs."
  }
];

function enrichAndCompleteStores(rawStores: MerchantStore[], extraStores: MerchantStore[]): MerchantStore[] {
  const combined = [...rawStores, ...extraStores];
  
  return combined.map((store, index) => {
    // Determine target category based on store categories
    const category = store.categories[0] || "Crafts";
    let templates = CRAFTS_TEMPLATES;
    if (category === "Food") templates = FOOD_TEMPLATES;
    else if (category === "Electronics") templates = ELECTRONICS_TEMPLATES;
    else if (category === "Fashion") templates = FASHION_TEMPLATES;
    else if (category === "Home") templates = HOME_TEMPLATES;

    // Generate a unique 3-character skuPrefix where the first character is different for every single merchant.
    // Index ranges from 0 to 19. String.fromCharCode(65 + index) gives A, B, C, D, ...
    const firstChar = String.fromCharCode(65 + (index % 26)); // e.g. A, B, C, ...
    const baseSuffix = category.substring(0, 2).toUpperCase(); // e.g. "CR", "FO", "EL", "FA", "HO"
    const skuPrefix = `${firstChar}${baseSuffix}`; // e.g. ACR, BFO, etc.

    const products = [...store.products];
    let counter = products.length + 1;

    // We want at least 8 products per store (meaning more than 7)
    while (products.length < 8) {
      const templateIndex = (counter - 1) % templates.length;
      const template = templates[templateIndex];
      const pId = `p_${store.id.replace("store_", "")}_ext_${counter}`;
      
      const newProduct: Product = {
        id: pId,
        storeId: store.id,
        name: `${template.name} - ${store.name.split(" - ")[0]} Style`,
        category: category,
        price: template.price,
        stock: Math.floor(Math.random() * 25) + 5, // 5 to 30
        imageUrl: template.imageUrl,
        images: [template.imageUrl],
        status: "active",
        rating: Number((4.5 + Math.random() * 0.5).toFixed(2)), // 4.5 to 5.0
        reviews: [],
        description_ar: template.description_ar,
        description_fr: template.description_fr,
        description_en: template.description_en,
        tags: [...template.tags, store.wilaya.toLowerCase()]
      };
      
      products.push(newProduct);
      counter++;
    }

    // Assign SKUs with the merchant's custom unique skuPrefix
    const productsWithSku = products.map((p, pIdx) => {
      const rand = 100000 + ((pIdx + index * 13) % 900000);
      return {
        ...p,
        sku: p.sku || `${skuPrefix}-${rand}`
      };
    });
    
    return {
      ...store,
      followersCount: 0,
      skuPrefix: skuPrefix,
      products: productsWithSku
    };
  });
}

export const INITIAL_STORES: MerchantStore[] = enrichAndCompleteStores(RAW_INITIAL_STORES, EXTRA_STORES);

