require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./src/models/Category");
const Product = require("./src/models/Product");

const MONGO_DB = process.env.MONGO_DB;

const categories = [
  { name: "Vợt Pickleball", slug: "vot-pickleball" },
  { name: "Bóng Pickleball", slug: "bong-pickleball" },
  { name: "Giày Pickleball", slug: "giay-pickleball" },
  { name: "Phụ kiện Pickleball", slug: "phu-kien-pickleball" },
  { name: "Trang phục Pickleball", slug: "trang-phuc-pickleball" },
];

// Products will reference category IDs after insert
const productsData = [
  // === VỢT PICKLEBALL ===
  { name: "Vợt Pickleball Kamito Alpha X 2 Sao Hanoi Cup 2026", slug: "vot-kamito-alpha-x-2-sao", price: 3700000, brand: "Kamito", catSlug: "vot-pickleball", stock: 15, description: "Vợt Pickleball Kamito Alpha X 2 Sao Hanoi Cup 2026 Limited Edition Chính Hãng", specs: { weight: "8.0 oz", coreThickness: "16mm", gripSize: "4 1/4", material: "Carbon Fiber T700" } },
  { name: "Vợt Pickleball Leopard Wave X 2026", slug: "vot-leopard-wave-x-2026", price: 2350000, salePrice: 1950000, brand: "Leopard", catSlug: "vot-pickleball", stock: 20, description: "Vợt Pickleball Leopard Wave X Chính Hãng 2026", specs: { weight: "7.8 oz", coreThickness: "14mm", material: "Fiberglass" } },
  { name: "Vợt Pickleball Prova Ultimate Pro 2026", slug: "vot-prova-ultimate-pro-2026", price: 1190000, salePrice: 950000, brand: "Prova", catSlug: "vot-pickleball", stock: 25, description: "Vợt Pickleball Prova Ultimate Pro 2026 – Chính Hãng", specs: { weight: "7.6 oz", coreThickness: "13mm", material: "PP Honeycomb" } },
  { name: "Vợt Pickleball HighPicks Xprime", slug: "vot-highpicks-xprime", price: 2500000, salePrice: 2100000, brand: "HighPicks", catSlug: "vot-pickleball", stock: 10, description: "Vợt Pickleball HighPicks Xprime – Chính Hãng", specs: { weight: "8.2 oz", coreThickness: "16mm", material: "Carbon Fiber" } },
  { name: "Vợt Pickleball Zocker Aspire Signature", slug: "vot-zocker-aspire-signature", price: 3950000, brand: "Zocker", catSlug: "vot-pickleball", stock: 8, description: "Vợt Pickleball Zocker Aspire Signature x Phúc Huỳnh – Chính Hãng", specs: { weight: "8.0 oz", coreThickness: "16mm", material: "Toray T700 Carbon" } },
  { name: "Vợt Pickleball Balbon Air Power", slug: "vot-balbon-air-power", price: 2300000, salePrice: 1999000, brand: "Balbon", catSlug: "vot-pickleball", stock: 18, description: "Vợt Pickleball Balbon Air Power – Chính Hãng", specs: { weight: "7.9 oz", coreThickness: "14mm", material: "Carbon Fiber" } },
  { name: "Vợt Pickleball Kamito Alpha X Her Power", slug: "vot-kamito-alpha-x-her-power", price: 5200000, salePrice: 3600000, brand: "Kamito", catSlug: "vot-pickleball", stock: 12, description: "Vợt Pickleball Kamito Alpha X Her Power chính hãng", specs: { weight: "7.5 oz", coreThickness: "14mm", material: "Carbon T700" } },
  { name: "Vợt Pickleball Prova Hera Pro 2.5 T700", slug: "vot-prova-hera-pro-25", price: 750000, salePrice: 550000, brand: "Prova", catSlug: "vot-pickleball", stock: 30, description: "Vợt Pickleball Prova Hera Pro 2.5 T700 chính hãng", specs: { weight: "7.4 oz", coreThickness: "13mm", material: "T700 Carbon" } },
  { name: "Vợt Pickleball Soxter Impact Pro 2.0", slug: "vot-soxter-impact-pro-20", price: 4190000, salePrice: 2900000, brand: "Soxter", catSlug: "vot-pickleball", stock: 14, description: "Vợt Pickleball Soxter Impact Pro 2.0 chính hãng", specs: { weight: "8.1 oz", coreThickness: "16mm", material: "Carbon Fiber T800" } },
  { name: "Vợt Pickleball JOOLA Ben Johns Hyperion 3S 16mm", slug: "vot-joola-hyperion-3s-16mm", price: 7790000, salePrice: 5250000, brand: "JOOLA", catSlug: "vot-pickleball", stock: 6, description: "Vợt Pickleball JOOLA Ben Johns Hyperion 3S 16mm chính hãng", specs: { weight: "8.4 oz", coreThickness: "16mm", material: "Carbon Fiber CFS" } },
  { name: "Vợt Pickleball Joola Hyperion Pro IV Asia Colorway", slug: "vot-joola-hyperion-pro-iv-asia", price: 7790000, salePrice: 5250000, brand: "JOOLA", catSlug: "vot-pickleball", stock: 5, description: "Vợt Pickleball Joola Hyperion Pro IV Asia Colorway – Chính Hãng", specs: { weight: "8.2 oz", coreThickness: "14mm", material: "CFS Carbon" } },
  { name: "Vợt Pickleball Joola Hyperion Pro IV Vietnam Colorway", slug: "vot-joola-hyperion-pro-iv-vn", price: 7790000, salePrice: 5250000, brand: "JOOLA", catSlug: "vot-pickleball", stock: 5, description: "Vợt Pickleball Joola Hyperion Pro IV Vietnam Colorway – Chính Hãng", specs: { weight: "8.2 oz", coreThickness: "14mm", material: "CFS Carbon" } },

  // === BÓNG PICKLEBALL ===
  { name: "Bóng Pickleball Joola Primo 3 Quả", slug: "bong-joola-primo-3", price: 250000, brand: "JOOLA", catSlug: "bong-pickleball", stock: 100, description: "Bóng Pickleball Joola Primo chính hãng - Hộp 3 quả", specs: { type: "Outdoor", quantity: "3 quả", material: "Polymer" } },
  { name: "Bóng Pickleball Franklin X-40 Outdoor", slug: "bong-franklin-x40", price: 350000, brand: "Franklin", catSlug: "bong-pickleball", stock: 80, description: "Bóng Pickleball Franklin X-40 Outdoor chính hãng", specs: { type: "Outdoor", quantity: "3 quả", material: "Polymer" } },
  { name: "Bóng Pickleball Passion Indoor 6 Quả", slug: "bong-passion-indoor-6", price: 180000, brand: "Passion", catSlug: "bong-pickleball", stock: 120, description: "Bóng Pickleball Passion Indoor - Hộp 6 quả", specs: { type: "Indoor", quantity: "6 quả", material: "Nhựa mềm" } },
  { name: "Bóng Pickleball Facolos Pro 6 Quả", slug: "bong-facolos-pro-6", price: 200000, brand: "Facolos", catSlug: "bong-pickleball", stock: 90, description: "Bóng Pickleball Facolos Pro 6 quả chính hãng", specs: { type: "Outdoor", quantity: "6 quả" } },

  // === GIÀY PICKLEBALL ===
  { name: "Giày Pickleball ASICS Court FF 3", slug: "giay-asics-court-ff-3", price: 4500000, salePrice: 3800000, brand: "Asics", catSlug: "giay-pickleball", stock: 15, description: "Giày Pickleball ASICS Court FF 3 1041A370-106 chính hãng", specs: { size: "40-45", sole: "FLYTEFOAM", upper: "Mesh" } },
  { name: "Giày Adidas Adizero Ubersonic White Silver", slug: "giay-adidas-ubersonic-white", price: 3800000, salePrice: 3200000, brand: "Adidas", catSlug: "giay-pickleball", stock: 12, description: "Giày Adidas Adizero Ubersonic 'White Silver' IH8103", specs: { size: "39-44", sole: "Adiwear", upper: "Textile" } },
  { name: "Giày Adidas Barricade 13 Lucid Pink", slug: "giay-adidas-barricade-13-pink", price: 4200000, salePrice: 3500000, brand: "Adidas", catSlug: "giay-pickleball", stock: 10, description: "Giày Adidas Barricade 13 'Lucid Pink' JP9842 chính hãng", specs: { size: "36-42", sole: "Adiwear 6", upper: "Synthetic" } },
  { name: "Giày Nike Zoom Vapor Pro 3 HC Womens", slug: "giay-nike-vapor-pro-3-hc", price: 5200000, salePrice: 4500000, brand: "Nike", catSlug: "giay-pickleball", stock: 8, description: "Nike Zoom Vapor Pro 3 HC Womens HV1376-100 chính hãng", specs: { size: "36-42", sole: "Zoom Air", upper: "Flyknit" } },
  { name: "Giày Asics GEL-RESOLUTION X WIDE", slug: "giay-asics-gel-resolution-x", price: 4800000, salePrice: 3900000, brand: "Asics", catSlug: "giay-pickleball", stock: 10, description: "Giày Pickleball Asics GEL-RESOLUTION X WIDE Midnight Cream", specs: { size: "40-45", sole: "GEL Technology", upper: "Mesh" } },
  { name: "Giày Pickleball Lacoste AG LT23 Ultra", slug: "giay-lacoste-ag-lt23-ultra", price: 3600000, brand: "Lacoste", catSlug: "giay-pickleball", stock: 14, description: "Giày Pickleball Lacoste AG LT23 Ultra Trainers 'White Green' chính hãng", specs: { size: "39-44", sole: "EVA", upper: "Leather" } },

  // === PHỤ KIỆN ===
  { name: "Chai Xịt Vệ Sinh Mặt Vợt HASO PRO 100ML", slug: "chai-xit-haso-pro-100ml", price: 150000, brand: "HASO", catSlug: "phu-kien-pickleball", stock: 50, description: "Chai xịt vệ sinh mặt vợt Pickleball HASO PRO 100ML chính hãng" },
  { name: "Cuốn Cán Vợt Pickleball Kamito Pro", slug: "cuon-can-kamito-pro", price: 80000, brand: "Kamito", catSlug: "phu-kien-pickleball", stock: 100, description: "Cuốn cán vợt Pickleball Kamito Pro chống trơn, thấm mồ hôi" },
  { name: "Bó Đầu Gối McDavid M4193", slug: "bo-dau-goi-mcdavid-m4193", price: 890000, brand: "McDavid", catSlug: "phu-kien-pickleball", stock: 20, description: "Bó đầu gối McDavid M4193 – Hỗ trợ chuyên nghiệp, chính hãng Nhật Bản" },
  { name: "Túi Bảo Vệ Mặt Vợt Legendtek", slug: "tui-bao-ve-vot-legendtek", price: 120000, brand: "Legendtek", catSlug: "phu-kien-pickleball", stock: 40, description: "Túi bảo vệ mặt Vợt Pickleball Legendtek chính hãng" },
  { name: "Lưới Pickleball Di Động Zocker", slug: "luoi-pickleball-zocker", price: 2500000, salePrice: 2100000, brand: "Zocker", catSlug: "phu-kien-pickleball", stock: 10, description: "Lưới Pickleball di động Zocker tiêu chuẩn thi đấu" },

  // === TRANG PHỤC ===
  { name: "Áo Polo Pickleball Kamito Nam 2026", slug: "ao-polo-kamito-nam-2026", price: 450000, salePrice: 350000, brand: "Kamito", catSlug: "trang-phuc-pickleball", stock: 40, description: "Áo Polo Pickleball Kamito Nam 2026 thoáng mát, co giãn 4 chiều" },
  { name: "Quần Short Pickleball Adidas Ergo", slug: "quan-short-adidas-ergo", price: 750000, salePrice: 600000, brand: "Adidas", catSlug: "trang-phuc-pickleball", stock: 25, description: "Quần Short Pickleball Adidas Ergo chính hãng, chất liệu AEROREADY" },
  { name: "Mũ Lưỡi Trai Pickleball Nike Dri-FIT", slug: "mu-nike-dri-fit", price: 550000, brand: "Nike", catSlug: "trang-phuc-pickleball", stock: 35, description: "Mũ lưỡi trai Pickleball Nike Dri-FIT chống nắng, thấm mồ hôi" },
  { name: "Balo Pickleball Joola Tour Elite", slug: "balo-joola-tour-elite", price: 1800000, salePrice: 1500000, brand: "JOOLA", catSlug: "trang-phuc-pickleball", stock: 12, description: "Balo Pickleball Joola Tour Elite có ngăn đựng vợt chuyên dụng" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_DB);
    console.log("✅ Connected to MongoDB");

    // 1. Clear old data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared old categories & products");

    // 2. Insert categories
    const insertedCats = await Category.insertMany(categories);
    console.log(`📂 Inserted ${insertedCats.length} categories`);

    // Build slug -> _id map
    const catMap = {};
    insertedCats.forEach((c) => { catMap[c.slug] = c._id; });

    // 3. Insert products
    const products = productsData.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: p.price,
      salePrice: p.salePrice || undefined,
      brand: p.brand || "",
      categories: catMap[p.catSlug] ? [catMap[p.catSlug]] : [],
      image: [],
      stock: p.stock || 10,
      specs: p.specs || {},
    }));

    const insertedProducts = await Product.insertMany(products);
    console.log(`🛒 Inserted ${insertedProducts.length} products`);

    console.log("\n🎉 Seed completed successfully!");
    console.log("\nCategories:");
    insertedCats.forEach((c) => console.log(`  - ${c.name} (${c._id})`));
    console.log(`\nProducts: ${insertedProducts.length} total`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
