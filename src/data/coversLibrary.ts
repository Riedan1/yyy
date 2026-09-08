// High-quality character library of 12 distinct 3D / stylized characters
export interface LibraryCharacter {
  id: string;
  name: string;
  src: string;
  bg: string;
  panel: string;
}

export const CHARACTER_LIBRARY: LibraryCharacter[] = [
  { id: "char1", name: "Cute Sunset Astronaut", src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png", bg: "#F4845F", panel: "#F79B7F" },
  { id: "char2", name: "Kawaii Matcha Elf", src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png", bg: "#6BBF7A", panel: "#85CC92" },
  { id: "char3", name: "Bubblegum Fairy Queen", src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png", bg: "#E882B4", panel: "#ED9DC4" },
  { id: "char4", name: "Neon Blue Voyager", src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png", bg: "#6EB5FF", panel: "#8DC4FF" },
  { id: "char5", name: "Magical Lunar Empress", src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&h=600&q=80", bg: "#2e1065", panel: "#8b5cf6" },
  { id: "char6", name: "Steampunk Mech Aviator", src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&h=600&q=80", bg: "#451a03", panel: "#f59e0b" },
  { id: "char7", name: "Vaporwave Neon Android", src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&h=600&q=80", bg: "#1e1b4b", panel: "#6366f1" },
  { id: "char8", name: "Solar Punk Tech Druid", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=600&q=80", bg: "#064e3b", panel: "#10b981" },
  { id: "char9", name: "Retro Cyberpunk Hacker", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=600&q=80", bg: "#0f172a", panel: "#06b6d4" },
  { id: "char10", name: "Holographic Bunny Hop", src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=600&q=80", bg: "#4c1d95", panel: "#ec4899" },
  { id: "char11", name: "Cosmic Nebula Kitten", src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&h=600&q=80", bg: "#1e1b4b", panel: "#a78bfa" },
  { id: "char12", name: "Golden Phoenix Deity", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&h=600&q=80", bg: "#7c2d12", panel: "#ea580c" }
];

export interface LibraryCover {
  id: string;
  title: string;
  category: string;
  src: string;
}

export const COVER_LIBRARY: LibraryCover[] = [
  // 1. Tech & Gaming (Computers, Phones, Gaming, Electronics)
  { id: "tech-1", title: "Cyberpunk City Grid", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-2", title: "Retro Arcade Neon", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-3", title: "Mechanical Keyboard Close", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-4", title: "Gamer Battlestation Setup", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-5", title: "Motherboard Circuits Glow", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-6", title: "VR Headset Light Trail", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-7", title: "Abstract Blue Digital Wave", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-8", title: "Sleek Carbon Tech Texture", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-9", title: "Futuristic Synthwave Sun", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-10", title: "Abstract Liquid Metal", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-11", title: "Console Controller Close", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-12", title: "Neon Cable Management", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1555538995-7ccc8300228b?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-13", title: "Sleek Professional Laptop workspace", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-14", title: "Sleek Smartphone Close-Up", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-15", title: "High-End Dual Monitors", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-16", title: "Developer Coding Workstation", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-17", title: "Smartphone with Colorful UI Screen", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-18", title: "Modern PC Build Internal RGB Glow", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-19", title: "Professional Mobile Electronics Workspace", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "tech-20", title: "Premium Tablet and Stylus", category: "Tech & Gaming", src: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 2. Fashion & Boutique (Men, Women, Kids, Clothes, Apparels)
  { id: "fash-1", title: "Minimal Wardrobe Display", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-2", title: "Hanger Clothes Collection", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-3", title: "Aesthetic Fabric Textures", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-4", title: "Trendy Sneaker Grid", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-5", title: "Sunlit Cotton Rack", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-6", title: "Classic Watch & Accessories", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-7", title: "Sleek Leather Handbags", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-8", title: "Denim Jackets Stack", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-9", title: "Designer Glasses Frame", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-10", title: "Elegant Men's Suits Collection", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-11", title: "Women's High-End Boutique Rack", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-12", title: "Elegant Dress Collection", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-13", title: "Cozy Autumn Knitwear & Sweaters", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-14", title: "Adorable Kids Fashion Rack", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-15", title: "Kids Cute Clothes & Pastel Accessories", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-16", title: "Premium Men's Shoes and Boots", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-17", title: "Luxury Apparel Selection", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-18", title: "Fashion Designer Curation Studio", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-19", title: "Modern Organic Cotton Shirts", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "fash-20", title: "Luxury Gold Rings & Jewelry Showcase", category: "Fashion & Boutique", src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 3. Cosmetics & Beauty (Perfume, Skincare, Beauty Products)
  { id: "cos-1", title: "Pink Pastel Lipsticks", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-2", title: "Aesthetic Serum Dropper", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-3", title: "Organic Clay Mask Scoop", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-4", title: "Botanical Skin Therapy", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-5", title: "Luxury Bath Oils Grid", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-6", title: "Eyeshadow Palette Palette", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-7", title: "Skincare Bottles Shadow", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-8", title: "Luxury Perfume Flacon Close-Up", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-9", title: "Sleek Fragrance Bottle On Marble", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-10", title: "Aromatic Golden Scent Mist", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-11", title: "Rose Petals & Luxury Perfume Extract", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-12", title: "Makeup Brushes Professional Bundle", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-13", title: "Premium Organic Lip Balm & Cream", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-14", title: "Organic Essential Oil Drop", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "cos-15", title: "Aesthetic Cosmetic Layout", category: "Cosmetics & Beauty", src: "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 4. Business & Professional (Office, Coworking, Agency, Stationery, Work)
  { id: "bus-1", title: "Modern Collaborative Workspace", category: "Business & Professional", src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-2", title: "Corporate Skyscraper Architectural Facade", category: "Business & Professional", src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-3", title: "Aesthetic Office Stationery Setup", category: "Business & Professional", src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-4", title: "Creative Brainstorming Meeting Desk", category: "Business & Professional", src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-5", title: "Elegant Leather Journal & Pen", category: "Business & Professional", src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-6", title: "Sleek Coworking Lounge Setup", category: "Business & Professional", src: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-7", title: "Team Brainstorm Board & Sticky Notes", category: "Business & Professional", src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-8", title: "High-End Executive Boardroom", category: "Business & Professional", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-9", title: "Aesthetic Architect Office Blueprint", category: "Business & Professional", src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "bus-10", title: "Minimalist Modern Desk Essentials", category: "Business & Professional", src: "https://images.unsplash.com/photo-1488998427799-e3362ce97f3f?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 5. Traditional & Culture (Algerian, Arab, Oriental, Crafts, Pottery, Tapestry)
  { id: "trad-1", title: "Traditional Handcrafted Pottery Jars", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-2", title: "Exquisite Traditional Arab Spices", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-3", title: "Traditional Moorish Geometric Mosaic", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-4", title: "Algerian Handwoven Woolen Rugs", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-5", title: "Handcarved Antique Oriental Copper Teapots", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1565192647048-f997ded879f9?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-6", title: "Vibrant Weaving Colorful Threads", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-7", title: "Moroccan Architectural Patio Decor", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-8", title: "Shining Arabic Lanterns & Glowing Lamps", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-9", title: "Intricate Traditional Metal Engravings", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "trad-10", title: "Sleek Oriental Tea Glasses & Silverware", category: "Traditional & Culture", src: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 6. Medical & Healthcare (Clinics, Doctor Stethoscope, Pharmacy, Devices)
  { id: "med-1", title: "Stethoscope on Desk", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-2", title: "Modern Healthcare Clinic Workspace", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-3", title: "Professional Medical Equipment Setup", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1584515901187-601442177d16?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-4", title: "Dental Clinic Advanced Chair & Tools", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-5", title: "Advanced Laboratory Scientific Research", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-6", title: "Pills and Pharmacy Bottles", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1587854692152-cbe660dbbc88?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-7", title: "Warm Clinic Reception Lobby Design", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-8", title: "Wellness Consultation Spa Workspace", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-9", title: "Sleek Medical Stethoscope Closeup", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1530026405186-ed1ea400c3af?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "med-10", title: "Surgical Tools and Blue Clinic Sterile Field", category: "Medical & Healthcare", src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 7. Sports & Fitness
  { id: "sport-1", title: "Sleek Running Tracks Grid", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-2", title: "Pilates Yoga Mat Cork", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-3", title: "Black Iron Dumbbells", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-4", title: "Smart Watch Running Stats", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-5", title: "Gym Equipment and Weight Stack", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-6", title: "Splashing Deep Blue Swimming Pool", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-7", title: "Sunlit Green Tennis Court", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-8", title: "Outdoor Mountain Trail Hiking Pathway", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-9", title: "Heavy Boxing Bag in Dark Gym", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1544033527-b192daee1f5b?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "sport-10", title: "Professional Indoor Basketball Court", category: "Sports & Fitness", src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 8. Food, Bakery & Coffee
  { id: "food-1", title: "Pouring Coffee Droplets", category: "Food, Bakery & Coffee", src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "food-2", title: "Fresh Croissant Pastry", category: "Food, Bakery & Coffee", src: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "food-3", title: "Gourmet Wood Pizza Pie", category: "Food, Bakery & Coffee", src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "food-4", title: "Artisanal Sourdough Crumb", category: "Food, Bakery & Coffee", src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "food-5", title: "Aromatic Spice Spoonfuls", category: "Food, Bakery & Coffee", src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 9. Flowers, Crafts & Gifts
  { id: "flow-1", title: "Pastel Flower Bouquet", category: "Flowers, Crafts & Gifts", src: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "flow-2", title: "Sunlit Eucalyptus Branches", category: "Flowers, Crafts & Gifts", src: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "flow-3", title: "Aesthetic Cotton Blossoms", category: "Flowers, Crafts & Gifts", src: "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "flow-4", title: "Vibrant Fresh Tulips Garden", category: "Flowers, Crafts & Gifts", src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "flow-5", title: "Handcrafted Ceramics Clay", category: "Flowers, Crafts & Gifts", src: "https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 10. Furniture, Home & Decor
  { id: "home-1", title: "Sleek Modern Chair Couch", category: "Furniture, Home & Decor", src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "home-2", title: "Cozy Living Room Glow", category: "Furniture, Home & Decor", src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "home-3", title: "Aesthetic Potted Houseplants", category: "Furniture, Home & Decor", src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "home-4", title: "Sunlit Linen Bedroom Pillow", category: "Furniture, Home & Decor", src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&h=400&q=80" },

  // 11. Minimalist & Abstract
  { id: "min-1", title: "Soft Beige Sand Ripples", category: "Minimalist & Abstract", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "min-2", title: "Warm Sunbeams On Concrete", category: "Minimalist & Abstract", src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "min-3", title: "Abstract Soft Peach Clay", category: "Minimalist & Abstract", src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&h=400&q=80" },
  { id: "min-4", title: "Sage Green Aesthetic Wall", category: "Minimalist & Abstract", src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&h=400&q=80" }
];
