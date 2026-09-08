import { Country, State, City, ICountry, IState, ICity } from "country-state-city";

export interface CountryOption {
  code: string; // ISO 2 code e.g. "DZ", "US", "FR"
  name: string; // e.g. "Algeria", "United States"
  currency: string; // e.g. "DZD", "USD", "EUR"
  currencySymbol?: string;
  flag?: string;
  phonecode?: string;
}

export interface StateOption {
  code: string; // ISO code or Wilaya ID e.g. "06", "CA", "IDF"
  name: string; // e.g. "Bejaia", "California"
  formattedName: string; // e.g. "06 - Bejaia"
  countryCode: string;
}

export interface CityOption {
  code: string; // City name or code
  name: string; // e.g. "Bejaia", "Los Angeles"
  stateCode: string;
  countryCode: string;
}

// Complete 58 Wilayas for Algeria with padded codes 01 - 58
export const ALGERIA_58_WILAYAS: StateOption[] = [
  { code: "01", name: "Adrar", formattedName: "01 - Adrar", countryCode: "DZ" },
  { code: "02", name: "Chlef", formattedName: "02 - Chlef", countryCode: "DZ" },
  { code: "03", name: "Laghouat", formattedName: "03 - Laghouat", countryCode: "DZ" },
  { code: "04", name: "Oum El Bouaghi", formattedName: "04 - Oum El Bouaghi", countryCode: "DZ" },
  { code: "05", name: "Batna", formattedName: "05 - Batna", countryCode: "DZ" },
  { code: "06", name: "Bejaia", formattedName: "06 - Bejaia", countryCode: "DZ" },
  { code: "07", name: "Biskra", formattedName: "07 - Biskra", countryCode: "DZ" },
  { code: "08", name: "Bechar", formattedName: "08 - Bechar", countryCode: "DZ" },
  { code: "09", name: "Blida", formattedName: "09 - Blida", countryCode: "DZ" },
  { code: "10", name: "Bouira", formattedName: "10 - Bouira", countryCode: "DZ" },
  { code: "11", name: "Tamanrasset", formattedName: "11 - Tamanrasset", countryCode: "DZ" },
  { code: "12", name: "Tebessa", formattedName: "12 - Tebessa", countryCode: "DZ" },
  { code: "13", name: "Tlemcen", formattedName: "13 - Tlemcen", countryCode: "DZ" },
  { code: "14", name: "Tiaret", formattedName: "14 - Tiaret", countryCode: "DZ" },
  { code: "15", name: "Tizi Ouzou", formattedName: "15 - Tizi Ouzou", countryCode: "DZ" },
  { code: "16", name: "Alger", formattedName: "16 - Alger", countryCode: "DZ" },
  { code: "17", name: "Djelfa", formattedName: "17 - Djelfa", countryCode: "DZ" },
  { code: "18", name: "Jijel", formattedName: "18 - Jijel", countryCode: "DZ" },
  { code: "19", name: "Setif", formattedName: "19 - Setif", countryCode: "DZ" },
  { code: "20", name: "Saida", formattedName: "20 - Saida", countryCode: "DZ" },
  { code: "21", name: "Skikda", formattedName: "21 - Skikda", countryCode: "DZ" },
  { code: "22", name: "Sidi Bel Abbes", formattedName: "22 - Sidi Bel Abbes", countryCode: "DZ" },
  { code: "23", name: "Annaba", formattedName: "23 - Annaba", countryCode: "DZ" },
  { code: "24", name: "Guelma", formattedName: "24 - Guelma", countryCode: "DZ" },
  { code: "25", name: "Constantine", formattedName: "25 - Constantine", countryCode: "DZ" },
  { code: "26", name: "Medea", formattedName: "26 - Medea", countryCode: "DZ" },
  { code: "27", name: "Mostaganem", formattedName: "27 - Mostaganem", countryCode: "DZ" },
  { code: "28", name: "M'Sila", formattedName: "28 - M'Sila", countryCode: "DZ" },
  { code: "29", name: "Mascara", formattedName: "29 - Mascara", countryCode: "DZ" },
  { code: "30", name: "Ouargla", formattedName: "30 - Ouargla", countryCode: "DZ" },
  { code: "31", name: "Oran", formattedName: "31 - Oran", countryCode: "DZ" },
  { code: "32", name: "El Bayadh", formattedName: "32 - El Bayadh", countryCode: "DZ" },
  { code: "33", name: "Illizi", formattedName: "33 - Illizi", countryCode: "DZ" },
  { code: "34", name: "Bordj Bou Arreridj", formattedName: "34 - Bordj Bou Arreridj", countryCode: "DZ" },
  { code: "35", name: "Boumerdes", formattedName: "35 - Boumerdes", countryCode: "DZ" },
  { code: "36", name: "El Tarf", formattedName: "36 - El Tarf", countryCode: "DZ" },
  { code: "37", name: "Tindouf", formattedName: "37 - Tindouf", countryCode: "DZ" },
  { code: "38", name: "Tissemsilt", formattedName: "38 - Tissemsilt", countryCode: "DZ" },
  { code: "39", name: "El Oued", formattedName: "39 - El Oued", countryCode: "DZ" },
  { code: "40", name: "Khenchela", formattedName: "40 - Khenchela", countryCode: "DZ" },
  { code: "41", name: "Souk Ahras", formattedName: "41 - Souk Ahras", countryCode: "DZ" },
  { code: "42", name: "Tipaza", formattedName: "42 - Tipaza", countryCode: "DZ" },
  { code: "43", name: "Mila", formattedName: "43 - Mila", countryCode: "DZ" },
  { code: "44", name: "Ain Defla", formattedName: "44 - Ain Defla", countryCode: "DZ" },
  { code: "45", name: "Naama", formattedName: "45 - Naama", countryCode: "DZ" },
  { code: "46", name: "Ain Temouchent", formattedName: "46 - Ain Temouchent", countryCode: "DZ" },
  { code: "47", name: "Ghardaia", formattedName: "47 - Ghardaia", countryCode: "DZ" },
  { code: "48", name: "Relizane", formattedName: "48 - Relizane", countryCode: "DZ" },
  { code: "49", name: "El M'Ghair", formattedName: "49 - El M'Ghair", countryCode: "DZ" },
  { code: "50", name: "El Meniaa", formattedName: "50 - El Meniaa", countryCode: "DZ" },
  { code: "51", name: "Ouled Djellal", formattedName: "51 - Ouled Djellal", countryCode: "DZ" },
  { code: "52", name: "Bordj Baji Mokhtar", formattedName: "52 - Bordj Baji Mokhtar", countryCode: "DZ" },
  { code: "53", name: "Beni Abbes", formattedName: "53 - Beni Abbes", countryCode: "DZ" },
  { code: "54", name: "Timimoun", formattedName: "54 - Timimoun", countryCode: "DZ" },
  { code: "55", name: "Touggourt", formattedName: "55 - Touggourt", countryCode: "DZ" },
  { code: "56", name: "Djanet", formattedName: "56 - Djanet", countryCode: "DZ" },
  { code: "57", name: "In Salah", formattedName: "57 - In Salah", countryCode: "DZ" },
  { code: "58", name: "In Guezzam", formattedName: "58 - In Guezzam", countryCode: "DZ" },
];

// Complete communes and municipalities mapping for all 58 Wilayas of Algeria
export const ALGERIA_COMMUNES_MAP: Record<string, string[]> = {
  "01": ["Adrar", "Tamest", "Charouine", "Reggane", "In Zghmir", "Aoulef", "Timekten", "Fenoughil", "Zaouiet Kounta", "Tsabit", "Sebaa", "Ouled Said", "Sali", "Akabli", "Bouda"],
  "02": ["Chlef", "Tenes", "Benairia", "El Karimia", "Tadjena", "Taougrite", "Beni Haoua", "Sobha", "Harchoun", "Dahra", "Ouled Abbes", "Sendjas", "Zeboudja", "Oued Sly", "Abou El Hassan", "El Marsa", "Chettia", "Breira", "Oued Goussine"],
  "03": ["Laghouat", "Ksar El Hirane", "Bennasser Benchohra", "Sidi Makhlouf", "Hassi Delaa", "Hassi R'Mel", "Aflou", "Ain Madhi", "Tadjemout", "El Houaita", "Kheneg", "Ain Sidi Ali", "Tadjerouna", "Brida", "El Ghicha", "Oued M'Zi"],
  "04": ["Oum El Bouaghi", "Ain Beida", "Ain M'lila", "Behir El Chergui", "El Amiria", "Sigus", "El Belala", "Ain Babouche", "Berriche", "Ouled Zouai", "Dhalaa", "Ain Zitoun", "Fkirina", "Souk Naamane"],
  "05": ["Batna", "Ghassira", "Seriana", "M'doukel", "Tazoult", "N'Gaous", "Guigba", "Ain Djasser", "Arris", "Merouana", "Barika", "Ain Touta", "Menaa", "Timgad", "Ras El Aaiun", "Djerma", "Ichmoul", "Chir", "Fesdis", "Oued Taga"],
  "06": ["Bejaia", "Amizour", "Akbou", "Tazmalt", "Seddouk", "El Kseur", "Sidi Aich", "Kherrata", "Souk El Tenine", "Ath Yenni", "Adekar", "Darguina", "Tichy", "Aokas", "Chemini", "Kendira", "Timezrit", "Ouzzellaguen", "Melbou", "Taskriout", "Beni Maouche", "Tamridjet", "Ighram", "Draa El Kaid", "Barbacha", "Boudjellil", "Tifra"],
  "07": ["Biskra", "Umache", "Branis", "Chetma", "Ouled Djellal", "Tolga", "Sidi Okba", "Zeribet El Oued", "El Kantara", "Ain Naga", "M'Chouche", "Lioua", "Ourlal", "Foughala", "El Outaya", "Djemorah", "Ain Zaatout"],
  "08": ["Bechar", "Erg Ferradj", "Abadla", "Beni Ounif", "Kenadsa", "Taghit", "Igli", "Beni Abbes", "Kerzaz", "Lahmar", "Boukais", "Mougheul", "Meridja", "Tabelbala"],
  "09": ["Blida", "Boufarik", "Ouled Yaich", "El Affroun", "Mouzaia", "Larbaa", "Meftah", "Chiffa", "Soumaa", "Bougara", "Ouled Slama", "Chebli", "Bouarfa", "Beni Mered", "Djebabra", "Oued El Alleug", "Ain Romana", "Souhane"],
  "10": ["Bouira", "Lakhdaria", "Sour El Ghozlane", "Ayn Bessem", "M'Chedallah", "Haizer", "Kadiria", "Bordj Okhriss", "Bir Ghbalou", "El Asnam", "Bechloul", "Taghzout", "Dirah", "Raouraoua", "Aghbalou", "El Hachimia", "Ahl El Ksar"],
  "11": ["Tamanrasset", "Abalessa", "In Ghar", "In Guezzam", "In Salah", "Tazrouk", "Idles"],
  "12": ["Tebessa", "Bir El Ater", "Cheria", "Stah Guentis", "El Aouinet", "El Kouif", "El Morsott", "Ouenza", "Hammamet", "Negrine", "Bedjene", "Morsott", "Boukhadra", "Bir Mokkadem", "Ferkane"],
  "13": ["Tlemcen", "Mansourah", "Chetouane", "Ghazaouet", "Remchi", "Sebdou", "Maghnia", "Nedroma", "Beni Saf", "Hennaya", "Bensekrane", "Zenata", "Bab El Assa", "Marsa Ben M'Hidi", "Honaine", "Sabra", "Sidi Djillali", "Beni Bousseid", "Ouled Mimoun"],
  "14": ["Tiaret", "Medroussa", "Rachgoun", "Ksar Chellala", "Mahdia", "Frenda", "Ain Deheb", "Sougueur", "Hamadia", "Dahmouni", "Rahouia", "Takhemaret", "Meghila", "Sebaine", "Ain Bouchekif"],
  "15": ["Tizi Ouzou", "Azazga", "Ath Yenni", "Boghni", "Draa Ben Khedda", "Tigzirt", "Azeffoun", "Larbaa Nath Irathen", "Ouadhia", "Ain El Hammam", "Beni Douala", "Makouda", "Mekla", "Freha", "Ouaguenoun", "Bouzeguene", "Ifigha", "Iferhounene", "Maatkas", "Tadmait", "Tizi Gheniff", "Draa El Mizan", "Souk El Tenine", "Yakouren", "Mizrana"],
  "16": ["Algiers Center", "Bab El Oued", "Hydra", "El Harrach", "Zeralda", "Sidi M'Hamed", "Kouba", "Dar El Beida", "Cheraga", "Ben Aknoun", "Bir Mourad Rais", "Dely Ibrahim", "Hussein Dey", "Bordj El Kiffan", "Ain Taya", "Draria", "Bab Ezzouar", "Reghaia", "Rouiba", "Staoueli", "Bologhine", "El Biar", "Ouled Fayet", "Saoula", "Baraki", "Birtouta", "Eucalyptus", "El Madania", "Mohamed Belouizdad", "Kasbah", "Souidania", "Douera", "Khraicia", "Hammamet", "Bordj El Bahri", "Marsa", "Tessala El Merdja", "Ain Benian"],
  "17": ["Djelfa", "Moudjebara", "Tadmit", "Ain El Ibel", "Hassi Bahbah", "Ain Oussera", "Messaad", "Dar Chioukh", "Charef", "El Khedidja", "Birine", "Sidi Ladjel", "Hassi El Ghezze", "Zaccard", "Had Sahary", "Faydh El Botma"],
  "18": ["Jijel", "El Aouana", "Ziamah Mansouriah", "Taher", "Chekfa", "El Milia", "Sattara", "El Ancer", "Sidi Abdelaziz", "Kaous", "Texenna", "Emir Abdelkader", "Oudjana", "Djimla", "El Kennar Novera", "Selma Benziada"],
  "19": ["Setif", "El Eulma", "Ain Arnat", "Ain Azel", "Ain Oulmene", "Bouandas", "Beni Ourtilane", "Babor", "Guidjel", "Ain El Kebira", "Hammam Soukhna", "Djamil", "Maoklane", "Salah Bey", "Ain Legradj", "Bellaa", "Mezloug", "Ouled Si Ahmed", "Bir El Arch", "Ras El Ma"],
  "20": ["Saida", "Doui Thabet", "Ain El Hadjar", "Ouled Khaled", "El Hassasna", "Sidi Boubekeur", "Youb", "Hounet", "Sidi Amar", "Moulay Larbi", "Ain Sekhouna"],
  "21": ["Skikda", "Filfila", "Hamadi Krouma", "El Hadaiek", "Azzaba", "El Harrouch", "Collo", "Tamalous", "Ben Azzouz", "Ramdane Djamel", "Djendel Saadi Mohamed", "Ain Zouit", "Cheraia", "Kanoua", "Bekkouche Lakhdar", "Zitouna", "Oued Beni Ziad"],
  "22": ["Sidi Bel Abbes", "Tessala", "Sidi Brahim", "Mostefa Ben Brahim", "Telagh", "Sfisef", "Ain El Berd", "Ben Badis", "Ras El Ma", "Tabia", "Tenira", "Moulay Slissen", "Marhoum", "Merine", "Oued Sebaa"],
  "23": ["Annaba", "El Bouni", "El Hadjar", "Berrahal", "Seraidi", "Ain Berda", "Chetaibi", "Treat", "Oued El Aneb", "Chorfa", "Eulma"],
  "24": ["Guelma", "Nechmaya", "Bouati Mahmoud", "Heliopolis", "Guelaat Bou Sbaa", "Hammama Debagh", "Oued Zenati", "Bouchegouf", "Belkheir", "Djeballah Khemissi", "Roknia", "Hammam N'Bails", "Ain Makhlouf", "Bordj Sabath"],
  "25": ["Constantine", "El Khroub", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef", "Ain Smara", "Ibn Ziad", "Ouled Rahmoune", "Ben Badis", "Ain Abid"],
  "26": ["Medea", "Ouzera", "Ain Boucif", "Ksar El Boukhari", "El Omaria", "Berrouaghia", "Seghouane", "Tablat", "Chahbounia", "Beni Slimane", "Si Mahdjoub", "Souagui", "Ouamri", "Damiat", "Chellalat El Adhaoura", "Aziz"],
  "27": ["Mostaganem", "Sayada", "Hassi Mameche", "Mazagran", "Ain Tedles", "Bouguirat", "Achaacha", "Sidi Ali", "Ain Nouissy", "Fornaka", "Stidia", "Sirat", "Mesra", "Kheir Eddine", "Souaflia"],
  "28": ["M'Sila", "Bousaada", "Hammam Dhalaa", "Ouled Derradj", "Sidi Aissa", "Ain El Hadjel", "Magra", "Ben Srour", "Berhoum", "Ain El Melh", "Sidi Hadjeres", "Khoubana", "Medjedel", "Tamsa"],
  "29": ["Mascara", "Bou Hanifia", "Tizi", "Ghriss", "Sig", "Oued El Taria", "Mohammadia", "Tighennif", "Aouf", "Zahana", "Oued Taria", "El Gaada", "Maoussa", "Hacine", "Oggaz"],
  "30": ["Ouargla", "N'Gousa", "Hassi Messaoud", "Rouissat", "El Borma", "Sidi Khouiled", "Ain Beida", "Hassi Ben Abdellah"],
  "31": ["Oran City", "Es Senia", "Bir El Djir", "Ain El Turk", "Arzew", "Bethioua", "Mers El Kebir", "Gdyel", "Boutlelis", "Misserghin", "Bousfer", "El Ancor", "Hassi Bounif", "Hassi Ben Okba", "Tafraoui", "Oued Tlelat"],
  "32": ["El Bayadh", "Roghassa", "Stitten", "Brezina", "Ghassoul", "Labiodh Sidi Cheikh", "El Abiodh", "El Kheiter", "Boussemghoun", "Chellala", "Arbaouat"],
  "33": ["Illizi", "Debdeb", "Bordj Omar Driss", "In Amenas"],
  "34": ["Bordj Bou Arreridj", "Ras El Oued", "Bordj Zimoura", "Mansoura", "El Achir", "Ain Taghrout", "Bir Kasdali", "Teniet En Nasr", "Khattouti Sed El Djir", "Bordj Ghedir", "Haraza", "Hasnaoua"],
  "35": ["Boumerdes", "Bordj Menaiel", "Baghlia", "Naciria", "Isser", "Thenia", "Khemis El Khechna", "Dellys", "Zemmouri", "Tidjelabine", "Ouled Moussa", "Larbatache", "Hammadi", "Afir", "Chabet El Ameur", "Si Mustapha", "Corsu"],
  "36": ["El Tarf", "El Kala", "Ben M'Hidi", "Besbes", "Drean", "Bouhadjar", "Bouteldja", "Chefia", "Berrihane", "Ain El Assel", "Raml Souk", "Zerizer"],
  "37": ["Tindouf", "Oum El Assel"],
  "38": ["Tissemsilt", "Bordj Bou Naama", "Theniet El Had", "Lardjem", "Khemisti", "Ammari", "Bordj El Emir Abdelkader", "Lazharia", "Layoune", "Ouled Bessem"],
  "39": ["El Oued", "Robbah", "Oued El Alenda", "Bayadha", "Guemar", "Reguiba", "Hassi Khalifa", "Debila", "Taleb Larbi", "Magrane", "Trifaoui", "Kouinin", "Hamraia"],
  "40": ["Khenchela", "Kais", "El Hamma", "Rremila", "Ain Touila", "Babar", "Chechar", "Ouled Rechache", "Yabous", "Baghai", "El Mahmal", "Taouzient"],
  "41": ["Souk Ahras", "Sedrata", "Hanancha", "Machroha", "Taoura", "Merahna", "M'Daourouch", "Oued Keberit", "Zaarouria", "Ouled Driss", "Drea", "Terraguelt"],
  "42": ["Tipaza", "Menaceur", "Larhat", "Douaouda", "Bourkika", "Ahmer El Ain", "Khemisti", "Cherchell", "Gouraya", "Hadjout", "Bousmail", "Fouka", "Koléa", "Nador", "Sidi Ghiles", "Damous", "Messelmoun", "Attatba"],
  "43": ["Mila", "Chigara", "Sidi Merouane", "Teleghma", "Oued Endja", "Tadjenanet", "Chelghoum Said", "Grarem Gouga", "Rouached", "Ferdjioua", "Zeghaia", "Terrai Bainen", "El Mechira"],
  "44": ["Ain Defla", "Miliana", "Boumedfaa", "Khemis Miliana", "Hammam Righa", "El Attaf", "Djendel", "Bordj Emir Khaled", "El Abadia", "Djelida", "Arib", "Rouina", "Bathia", "El Amra"],
  "45": ["Naama", "Mecheria", "Ain Sefra", "Tiout", "Moghrar", "Asla", "Djeniene Bourezg", "Sfissifa"],
  "46": ["Ain Temouchent", "Hammam Bouhadjar", "Beni Saf", "El Maleh", "Oulhaca El Gheraba", "Aoubellil", "Ain El Kietal", "Chaabat El Leham", "Terga", "El Amria", "Aghlal"],
  "47": ["Ghardaia", "El Atteuf", "Bounoura", "Zelfana", "Metlili", "El Guerrara", "Berriane", "Sebseb", "Mansoura"],
  "48": ["Relizane", "Oued Rhiou", "Bendaoud", "Sidi M'Hamed Ben Ali", "Mazouna", "Ammi Moussa", "El Matmar", "Yellel", "Zemmora", "Djidioua", "Ain Tarek", "Hamri", "Ouarizane"],
  "49": ["El M'Ghair", "Djamaa", "Oum El Touyour", "Sidi Khelil", "Still", "M'Rara"],
  "50": ["El Meniaa", "Hassi Gara", "Hassi Fehal"],
  "51": ["Ouled Djellal", "Sidi Khaled", "Ras El Miaad", "Besbes", "Doucen"],
  "52": ["Bordj Baji Mokhtar", "Timiaouine"],
  "53": ["Beni Abbes", "Tamtert", "Igli", "El Ouata", "Tababelt", "Kerzaz", "Ksabi", "Timoudi"],
  "54": ["Timimoun", "Aougrout", "Deldoul", "Charouine", "Ksar Kaddour", "Ouled Said", "Talmine"],
  "55": ["Touggourt", "Nezla", "Tebesbest", "Zaouia El Abidia", "El Hadjira", "Megarine", "Temacine", "El Allia", "Blidet Amor"],
  "56": ["Djanet", "Bordj El Haouas"],
  "57": ["In Salah", "In Ghar", "Foggaret Azzaouia"],
  "58": ["In Guezzam", "Tin Zaouatine"],
};

// Local Caching Engine
const memoryCache = {
  countries: null as CountryOption[] | null,
  states: new Map<string, StateOption[]>(),
  cities: new Map<string, CityOption[]>(),
};

/**
 * Get all worldwide countries formatted cleanly
 */
export function getWorldwideCountries(): CountryOption[] {
  if (memoryCache.countries) {
    return memoryCache.countries;
  }

  try {
    const rawCountries = Country.getAllCountries();
    const formatted: CountryOption[] = rawCountries.map((c: ICountry) => {
      let currencyName = c.currency || "USD";
      if (c.isoCode === "DZ") currencyName = "DA";

      return {
        code: c.isoCode,
        name: c.name,
        currency: currencyName,
        currencySymbol: c.currency || "$",
        flag: c.flag,
        phonecode: c.phonecode,
      };
    });

    // Ensure Algeria is prominently featured or listed cleanly
    const algeriaIndex = formatted.findIndex((c) => c.code === "DZ");
    if (algeriaIndex !== -1) {
      formatted[algeriaIndex].currency = "DA";
    }

    memoryCache.countries = formatted;
    return formatted;
  } catch (err) {
    console.warn("Fallback to basic country list:", err);
    const fallbackList: CountryOption[] = [
      { code: "DZ", name: "Algeria", currency: "DA" },
      { code: "FR", name: "France", currency: "EUR" },
      { code: "TN", name: "Tunisia", currency: "TND" },
      { code: "MA", name: "Morocco", currency: "MAD" },
      { code: "US", name: "United States", currency: "USD" },
      { code: "CA", name: "Canada", currency: "CAD" },
      { code: "GB", name: "United Kingdom", currency: "GBP" },
      { code: "AE", name: "United Arab Emirates", currency: "AED" },
      { code: "SA", name: "Saudi Arabia", currency: "SAR" },
    ];
    memoryCache.countries = fallbackList;
    return fallbackList;
  }
}

/**
 * Get States or Wilayas for a specific Country
 */
export function getStatesByCountryCode(countryCode: string): StateOption[] {
  const upperCode = (countryCode || "DZ").toUpperCase();

  if (memoryCache.states.has(upperCode)) {
    return memoryCache.states.get(upperCode)!;
  }

  // Special handling for Algeria -> load all 58 Wilayas
  if (upperCode === "DZ" || upperCode === "ALGERIA") {
    memoryCache.states.set(upperCode, ALGERIA_58_WILAYAS);
    return ALGERIA_58_WILAYAS;
  }

  try {
    const rawStates = State.getStatesOfCountry(upperCode);
    if (!rawStates || rawStates.length === 0) {
      // Fallback state if country has no administrative states
      const fallbackState: StateOption[] = [
        {
          code: upperCode,
          name: "Main Region",
          formattedName: "Main Region",
          countryCode: upperCode,
        },
      ];
      memoryCache.states.set(upperCode, fallbackState);
      return fallbackState;
    }

    const formatted: StateOption[] = rawStates.map((s: IState) => ({
      code: s.isoCode || s.name,
      name: s.name,
      formattedName: s.name,
      countryCode: upperCode,
    }));

    memoryCache.states.set(upperCode, formatted);
    return formatted;
  } catch (err) {
    console.warn("Error getting states for country:", countryCode, err);
    return [];
  }
}

function normalizeCityKey(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-_'\s]+/g, " ");
}

function dedupeAndSortCities(cities: CityOption[]): CityOption[] {
  const map = new Map<string, CityOption>();
  for (const c of cities) {
    if (!c.name) continue;
    const trimmedName = c.name.trim();
    const key = normalizeCityKey(trimmedName);
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, { ...c, name: trimmedName });
    } else {
      const existing = map.get(key)!;
      const existingHasAccent = /[\u00C0-\u024F]/.test(existing.name);
      const newHasAccent = /[\u00C0-\u024F]/.test(trimmedName);
      if (existingHasAccent && !newHasAccent) {
        map.set(key, { ...c, name: trimmedName });
      }
    }
  }
  const result = Array.from(map.values());
  result.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }));
  return result;
}

/**
 * Get Cities or Communes for a specific State/Wilaya in a Country
 */
export function getCitiesByState(countryCode: string, stateCodeOrName: string): CityOption[] {
  const upperCountry = (countryCode || "DZ").toUpperCase();
  const cacheKey = `${upperCountry}_${stateCodeOrName}`;

  if (memoryCache.cities.has(cacheKey)) {
    return memoryCache.cities.get(cacheKey)!;
  }

  // Algeria communes lookup
  if (upperCountry === "DZ" || upperCountry === "ALGERIA") {
    // Determine Wilaya ID (e.g. "06", "16", or extracted from "06 - Bejaia")
    let wilayaId = stateCodeOrName;
    if (wilayaId.includes(" - ")) {
      wilayaId = wilayaId.split(" - ")[0].trim();
    } else {
      // Find matching wilaya by name if code is not numeric
      const matchedWilaya = ALGERIA_58_WILAYAS.find(
        (w) => w.code === wilayaId || w.name.toLowerCase() === wilayaId.toLowerCase()
      );
      if (matchedWilaya) {
        wilayaId = matchedWilaya.code;
      }
    }

    // Standardize padded code e.g. "6" -> "06"
    if (wilayaId.length === 1) wilayaId = `0${wilayaId}`;

    // Combine static communes map with country-state-city package cities if available
    const communesList = ALGERIA_COMMUNES_MAP[wilayaId] || [
      `${stateCodeOrName} Center`,
      "Central Municipality",
    ];

    const cityList: CityOption[] = communesList.map((communeName) => ({
      code: communeName,
      name: communeName,
      stateCode: wilayaId,
      countryCode: "DZ",
    }));

    try {
      const pkgCities = City.getCitiesOfState("DZ", wilayaId) || City.getCitiesOfState("DZ", stateCodeOrName);
      if (pkgCities && pkgCities.length > 0) {
        pkgCities.forEach((c: ICity) => {
          if (c.name) {
            cityList.push({
              code: c.name,
              name: c.name,
              stateCode: wilayaId,
              countryCode: "DZ",
            });
          }
        });
      }
    } catch {
      // Ignore fallback
    }

    const formattedCities = dedupeAndSortCities(cityList);

    memoryCache.cities.set(cacheKey, formattedCities);
    return formattedCities;
  }

  // Worldwide cities lookup using country-state-city
  try {
    const rawCities = City.getCitiesOfState(upperCountry, stateCodeOrName);
    if (rawCities && rawCities.length > 0) {
      const formattedCities = dedupeAndSortCities(
        rawCities.map((c: ICity) => ({
          code: c.name,
          name: c.name,
          stateCode: stateCodeOrName,
          countryCode: upperCountry,
        }))
      );
      memoryCache.cities.set(cacheKey, formattedCities);
      return formattedCities;
    }

    // Fallback: search all cities in the country if state-specific cities are not found
    const countryCities = City.getCitiesOfCountry(upperCountry);
    if (countryCities && countryCities.length > 0) {
      const matching = dedupeAndSortCities(
        countryCities
          .filter((c: ICity) => !c.stateCode || c.stateCode === stateCodeOrName)
          .map((c: ICity) => ({
            code: c.name,
            name: c.name,
            stateCode: stateCodeOrName,
            countryCode: upperCountry,
          }))
      );

      if (matching.length > 0) {
        memoryCache.cities.set(cacheKey, matching);
        return matching;
      }
    }

    // Graceful fallback city
    const fallbackCity: CityOption[] = [
      {
        code: `${stateCodeOrName} Center`,
        name: `${stateCodeOrName} Center`,
        stateCode: stateCodeOrName,
        countryCode: upperCountry,
      },
    ];
    memoryCache.cities.set(cacheKey, fallbackCity);
    return fallbackCity;
  } catch (err) {
    console.warn("Error getting cities:", countryCode, stateCodeOrName, err);
    return [
      {
        code: "Central City",
        name: "Central City",
        stateCode: stateCodeOrName,
        countryCode: upperCountry,
      },
    ];
  }
}

export interface DetectedLocation {
  countryCode: string;
  countryName: string;
  stateCode?: string;
  stateName?: string;
  cityName?: string;
}

/**
 * Detect full location (country, state/region, city) by IP address
 */
export async function detectUserLocationByIP(): Promise<DetectedLocation> {
  // 1. Try ipapi.co
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        return {
          countryCode: String(data.country_code).toUpperCase(),
          countryName: data.country_name || "",
          stateCode: data.region_code || "",
          stateName: data.region || data.region_name || "",
          cityName: data.city || "",
        };
      }
    }
  } catch {
    // fallback
  }

  // 2. Try ipwho.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch("https://ipwho.is/", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.country_code) {
        return {
          countryCode: String(data.country_code).toUpperCase(),
          countryName: data.country || "",
          stateCode: data.region_code || "",
          stateName: data.region || "",
          cityName: data.city || "",
        };
      }
    }
  } catch {
    // fallback
  }

  // Fallback default: Algeria
  return {
    countryCode: "DZ",
    countryName: "Algeria",
    stateCode: "16",
    stateName: "16 - Alger",
    cityName: "Alger",
  };
}

/**
 * Auto-detect user's country code via browser locale/timezone or free ip API
 */
export async function detectUserCountryCode(): Promise<string> {
  const loc = await detectUserLocationByIP();
  return loc.countryCode || "DZ";
}
