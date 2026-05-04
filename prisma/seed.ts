// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")
  console.log("═══════════════════════")

  // ========================================
  // 1. إنشاء الأدمن
  // ========================================
  const adminPassword = await bcrypt.hash("admin123456", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@shopnext.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Admin",
      email: "admin@shopnext.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  })
  console.log("✅ Admin created:", admin.email)

  // إنشاء عميل تجريبي
  const userPassword = await bcrypt.hash("user123456", 12)
  const user = await prisma.user.upsert({
    where: { email: "user@shopnext.com" },
    update: {},
    create: {
      name: "أحمد محمد",
      email: "user@shopnext.com",
      password: userPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  })
  console.log("✅ Test user created:", user.email)

  // ========================================
  // 2. إنشاء التصنيفات
  // ========================================
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "إلكترونيات",
      slug: "electronics",
      description: "أحدث الأجهزة الإلكترونية والهواتف الذكية",
      image: "https://placehold.co/400x400/4f46e5/ffffff?text=Electronics",
    },
  })

  const fashion = await prisma.category.upsert({
    where: { slug: "fashion" },
    update: {},
    create: {
      name: "أزياء",
      slug: "fashion",
      description: "أحدث صيحات الموضة والأزياء العصرية",
      image: "https://placehold.co/400x400/dc2626/ffffff?text=Fashion",
    },
  })

  const home = await prisma.category.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      name: "المنزل",
      slug: "home",
      description: "مستلزمات ومفروشات وأجهزة المنزل",
      image: "https://placehold.co/400x400/0891b2/ffffff?text=Home",
    },
  })

  const beauty = await prisma.category.upsert({
    where: { slug: "beauty" },
    update: {},
    create: {
      name: "الجمال والعناية",
      slug: "beauty",
      description: "منتجات العناية بالبشرة والجمال والعطور",
      image: "https://placehold.co/400x400/ec4899/ffffff?text=Beauty",
    },
  })

  const sports = await prisma.category.upsert({
    where: { slug: "sports" },
    update: {},
    create: {
      name: "رياضة",
      slug: "sports",
      description: "مستلزمات وملابس وأجهزة رياضية",
      image: "https://placehold.co/400x400/059669/ffffff?text=Sports",
    },
  })

  const books = await prisma.category.upsert({
    where: { slug: "books" },
    update: {},
    create: {
      name: "كتب",
      slug: "books",
      description: "كتب ورقية وإلكترونية في جميع المجالات",
      image: "https://placehold.co/400x400/b45309/ffffff?text=Books",
    },
  })

  console.log("✅ 6 Categories created")

  // ========================================
  // 3. إنشاء المنتجات
  // ========================================
  const productsData = [
    // ══════════════════════════════
    // 📱 إلكترونيات (6 منتجات)
    // ══════════════════════════════
    {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description:
        "أحدث هاتف من Apple مع شريحة A17 Pro وكاميرا 48MP وإطار تيتانيوم. شاشة Super Retina XDR مقاس 6.7 بوصة مع تقنية ProMotion بمعدل تحديث 120Hz. بطارية تدوم طوال اليوم مع شحن سريع USB-C. يدعم التصوير السينمائي بدقة 4K ووضع الأكشن المحسّن. مقاوم للماء والغبار بمعيار IP68.",
      shortDesc: "الهاتف الأقوى من Apple مع شريحة A17 Pro",
      price: 1199,
      compareAt: 1399,
      stock: 50,
      lowStock: 10,
      categoryId: electronics.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "IPH-15PM-256",
      barcode: "1234567890001",
      weight: 0.221,
      images: [
        "https://placehold.co/600x600/1a1a2e/ffffff?text=iPhone+15+Pro&font=roboto",
        "https://placehold.co/600x600/16213e/ffffff?text=iPhone+Back&font=roboto",
        "https://placehold.co/600x600/0f3460/ffffff?text=iPhone+Side&font=roboto",
      ],
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description:
        "هاتف Samsung الرائد مع قلم S Pen مدمج وكاميرا 200MP وذكاء اصطناعي متقدم Galaxy AI. شاشة Dynamic AMOLED 2X مقاس 6.8 بوصة بسطوع 2600 nit. معالج Snapdragon 8 Gen 3 الأقوى. إطار تيتانيوم متين وتصميم أنيق. يدعم تسجيل فيديو 8K.",
      shortDesc: "الهاتف الذكي الأكثر تطوراً مع Galaxy AI",
      price: 1099,
      compareAt: 1299,
      stock: 35,
      lowStock: 8,
      categoryId: electronics.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "SAM-S24U-256",
      barcode: "1234567890002",
      weight: 0.232,
      images: [
        "https://placehold.co/600x600/1a1a2e/e0e0e0?text=Galaxy+S24&font=roboto",
        "https://placehold.co/600x600/2d2d44/e0e0e0?text=Galaxy+Back&font=roboto",
        "https://placehold.co/600x600/3d3d5c/e0e0e0?text=Galaxy+Camera&font=roboto",
      ],
    },
    {
      name: "MacBook Pro 16 M3 Max",
      slug: "macbook-pro-16-m3-max",
      description:
        "أقوى لابتوب من Apple مع شريحة M3 Max. شاشة Liquid Retina XDR مقاس 16.2 بوصة بسطوع 1600 nit. حتى 40 ساعة عمر بطارية. ذاكرة موحدة حتى 128GB. مثالي للمحترفين في التصميم، المونتاج، البرمجة، والذكاء الاصطناعي. 3 منافذ Thunderbolt 4 ومنفذ HDMI وقارئ بطاقات SD.",
      shortDesc: "أقوى لابتوب للمحترفين والمبدعين",
      price: 2499,
      compareAt: 2799,
      stock: 20,
      lowStock: 5,
      categoryId: electronics.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "MBP-16-M3M",
      barcode: "1234567890003",
      weight: 2.14,
      images: [
        "https://placehold.co/600x600/374151/ffffff?text=MacBook+Pro&font=roboto",
        "https://placehold.co/600x600/4b5563/ffffff?text=MacBook+Open&font=roboto",
        "https://placehold.co/600x600/1f2937/ffffff?text=MacBook+Side&font=roboto",
      ],
    },
    {
      name: "AirPods Pro 2 USB-C",
      slug: "airpods-pro-2",
      description:
        "سماعات لاسلكية مع إلغاء الضوضاء النشط المتقدم وصوت مكاني مخصص. شريحة H2 للأداء الفائق. مقاومة للماء والعرق بمعيار IPX4. عمر بطارية حتى 6 ساعات مع إلغاء الضوضاء. علبة الشحن تدعم USB-C وMagSafe والشحن اللاسلكي.",
      shortDesc: "أفضل سماعات لاسلكية مع إلغاء ضوضاء متقدم",
      price: 249,
      compareAt: 299,
      stock: 100,
      lowStock: 15,
      categoryId: electronics.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "APP-2-USBC",
      barcode: "1234567890004",
      weight: 0.051,
      images: [
        "https://placehold.co/600x600/f9fafb/374151?text=AirPods+Pro&font=roboto",
        "https://placehold.co/600x600/e5e7eb/374151?text=AirPods+Case&font=roboto",
      ],
    },
    {
      name: "iPad Air M2",
      slug: "ipad-air-m2",
      description:
        "تابلت خفيف وقوي مع شريحة M2. شاشة Liquid Retina مقاس 11 بوصة بألوان P3 واسعة. يدعم Apple Pencil Pro وMagic Keyboard. كاميرا خلفية 12MP وكاميرا أمامية مع Center Stage. مثالي للرسم والتعلم والإنتاجية.",
      shortDesc: "القوة والخفة في جهاز واحد مع شريحة M2",
      price: 599,
      compareAt: 699,
      stock: 45,
      lowStock: 10,
      categoryId: electronics.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "IPAD-AIR-M2",
      barcode: "1234567890005",
      weight: 0.462,
      images: [
        "https://placehold.co/600x600/7c3aed/ffffff?text=iPad+Air&font=roboto",
        "https://placehold.co/600x600/8b5cf6/ffffff?text=iPad+Back&font=roboto",
      ],
    },
    {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description:
        "سماعات رأس لاسلكية من Sony مع أفضل إلغاء ضوضاء في العالم. صوت Hi-Res Audio اللاسلكي. تصميم خفيف ومريح وزن 250 جرام فقط. بطارية تدوم 30 ساعة. تقنية Multipoint للاتصال بجهازين في وقت واحد.",
      shortDesc: "أفضل سماعات رأس لاسلكية في العالم",
      price: 349,
      compareAt: 399,
      stock: 40,
      lowStock: 8,
      categoryId: electronics.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "SNY-XM5-BLK",
      barcode: "1234567890006",
      weight: 0.25,
      images: [
        "https://placehold.co/600x600/1a1a2e/ffffff?text=Sony+XM5&font=roboto",
        "https://placehold.co/600x600/2d2d44/ffffff?text=XM5+Folded&font=roboto",
      ],
    },

    // ══════════════════════════════
    // 👕 أزياء (5 منتجات)
    // ══════════════════════════════
    {
      name: "Nike Air Max 270",
      slug: "nike-air-max-270",
      description:
        "حذاء رياضي مريح من Nike بتقنية Air Max لأقصى راحة أثناء المشي والجري. وسادة هوائية كبيرة في الكعب تمتص الصدمات. نعل خارجي مطاطي مقاوم للانزلاق. تصميم عصري يناسب الاستخدام اليومي والرياضة. شبكة علوية تسمح بالتهوية.",
      shortDesc: "راحة فائقة مع تقنية Air Max في كل خطوة",
      price: 150,
      compareAt: 200,
      stock: 80,
      lowStock: 15,
      categoryId: fashion.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "NK-AM270-42",
      barcode: "1234567890007",
      weight: 0.35,
      images: [
        "https://placehold.co/600x600/dc2626/ffffff?text=Nike+Air+Max&font=roboto",
        "https://placehold.co/600x600/ef4444/ffffff?text=Nike+Side&font=roboto",
        "https://placehold.co/600x600/b91c1c/ffffff?text=Nike+Sole&font=roboto",
      ],
    },
    {
      name: "Adidas Ultraboost 23",
      slug: "adidas-ultraboost-23",
      description:
        "حذاء جري احترافي من Adidas مع تقنية Boost للطاقة المرتدة القصوى. نعل Primeknit+ مرن ومريح يتكيف مع شكل القدم. نعل Continental المطاطي للثبات على جميع الأسطح. تصميم مستوحى من الاستدامة بمواد معاد تدويرها.",
      shortDesc: "الأداء الأفضل للجري بتقنية Boost الثورية",
      price: 180,
      compareAt: 220,
      stock: 60,
      lowStock: 12,
      categoryId: fashion.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "AD-UB23-43",
      barcode: "1234567890008",
      weight: 0.31,
      images: [
        "https://placehold.co/600x600/111827/ffffff?text=Ultraboost&font=roboto",
        "https://placehold.co/600x600/1f2937/ffffff?text=Ultraboost+Side&font=roboto",
      ],
    },
    {
      name: "جاكيت جلد كلاسيكي",
      slug: "classic-leather-jacket",
      description:
        "جاكيت جلد طبيعي 100% بتصميم كلاسيكي أنيق لا يخرج عن الموضة. بطانة داخلية ناعمة من القطن للراحة. سحاب YKK عالي الجودة. جيوب خارجية وداخلية متعددة. مناسب لجميع المناسبات من الكاجوال للرسمي.",
      shortDesc: "أناقة كلاسيكية لا تنتهي بجلد طبيعي فاخر",
      price: 299,
      compareAt: 450,
      stock: 25,
      lowStock: 5,
      categoryId: fashion.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "JKT-LTH-BLK",
      barcode: "1234567890009",
      weight: 1.2,
      images: [
        "https://placehold.co/600x600/44403c/ffffff?text=Leather+Jacket&font=roboto",
        "https://placehold.co/600x600/57534e/ffffff?text=Jacket+Back&font=roboto",
      ],
    },
    {
      name: "حقيبة ظهر عصرية",
      slug: "modern-backpack",
      description:
        "حقيبة ظهر عصرية من قماش مقاوم للماء بتصميم أنيق وعملي. جيب مبطن للابتوب حتى 15.6 بوصة. منفذ USB خارجي للشحن. أحزمة كتف مبطنة ومريحة. سعة 25 لتر مع تنظيم داخلي ممتاز.",
      shortDesc: "حقيبة عملية وأنيقة لكل يوم",
      price: 79,
      compareAt: 120,
      stock: 90,
      lowStock: 15,
      categoryId: fashion.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "BKP-MDN-GRY",
      barcode: "1234567890010",
      weight: 0.65,
      images: [
        "https://placehold.co/600x600/475569/ffffff?text=Backpack&font=roboto",
        "https://placehold.co/600x600/64748b/ffffff?text=Backpack+Open&font=roboto",
      ],
    },
    {
      name: "نظارة شمسية Ray-Ban Aviator",
      slug: "rayban-aviator-sunglasses",
      description:
        "نظارة شمسية كلاسيكية من Ray-Ban بتصميم Aviator الأيقوني. عدسات زجاجية G-15 تحمي من أشعة UV بنسبة 100%. إطار معدني خفيف ومتين. تأتي مع علبة وقماشة تنظيف أصلية.",
      shortDesc: "الكلاسيكية التي لا تتقادم",
      price: 159,
      compareAt: 199,
      stock: 55,
      lowStock: 10,
      categoryId: fashion.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "RB-AVI-GLD",
      barcode: "1234567890011",
      weight: 0.031,
      images: [
        "https://placehold.co/600x600/b45309/ffffff?text=Ray-Ban&font=roboto",
        "https://placehold.co/600x600/d97706/ffffff?text=Ray-Ban+Side&font=roboto",
      ],
    },

    // ══════════════════════════════
    // 🏠 المنزل (4 منتجات)
    // ══════════════════════════════
    {
      name: "مكنسة روبوت ذكية",
      slug: "smart-robot-vacuum",
      description:
        "مكنسة روبوت ذكية بتقنية LiDAR للتنقل الدقيق وتخطيط المنزل ثلاثي الأبعاد. تتحكم فيها من تطبيق الموبايل أو الأوامر الصوتية عبر Alexa وGoogle. تشفط وتمسح الأرضيات في نفس الوقت. بطارية تدوم 3 ساعات متواصلة. قاعدة تفريغ ذاتي تتسع لـ 60 يوم.",
      shortDesc: "تنظيف ذكي بدون مجهود مع تقنية LiDAR",
      price: 399,
      compareAt: 599,
      stock: 30,
      lowStock: 5,
      categoryId: home.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "RBT-VAC-001",
      barcode: "1234567890012",
      weight: 3.7,
      images: [
        "https://placehold.co/600x600/0891b2/ffffff?text=Robot+Vacuum&font=roboto",
        "https://placehold.co/600x600/06b6d4/ffffff?text=Vacuum+Top&font=roboto",
      ],
    },
    {
      name: "ماكينة قهوة أوتوماتيكية",
      slug: "automatic-coffee-machine",
      description:
        "ماكينة قهوة أوتوماتيكية بالكامل تطحن وتحضر القهوة بضغطة زر واحدة. خزان مياه 2 لتر قابل للإزالة. مطحنة سيراميك بـ 13 درجة طحن. تحضر إسبريسو وكابتشينو ولاتيه ماكياتو. شاشة لمس ملونة سهلة الاستخدام. نظام تنظيف ذاتي.",
      shortDesc: "قهوة احترافية في بيتك بضغطة زر",
      price: 599,
      compareAt: 799,
      stock: 15,
      lowStock: 3,
      categoryId: home.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "CFE-MCH-001",
      barcode: "1234567890013",
      weight: 8.5,
      images: [
        "https://placehold.co/600x600/78350f/ffffff?text=Coffee+Machine&font=roboto",
        "https://placehold.co/600x600/92400e/ffffff?text=Coffee+Side&font=roboto",
      ],
    },
    {
      name: "مصباح ذكي Philips Hue",
      slug: "philips-hue-smart-bulb",
      description:
        "مصباح ذكي من Philips Hue يدعم 16 مليون لون. يتحكم فيه عبر التطبيق أو الأوامر الصوتية. متوافق مع Apple HomeKit وAlexa وGoogle Home. موفر للطاقة بتقنية LED. عمر افتراضي 25000 ساعة. طقم 3 مصابيح مع Hue Bridge.",
      shortDesc: "أضئ بيتك بـ 16 مليون لون",
      price: 129,
      compareAt: 179,
      stock: 70,
      lowStock: 10,
      categoryId: home.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "PHI-HUE-3PK",
      barcode: "1234567890014",
      weight: 0.45,
      images: [
        "https://placehold.co/600x600/7c3aed/ffffff?text=Philips+Hue&font=roboto",
        "https://placehold.co/600x600/8b5cf6/ffffff?text=Hue+Colors&font=roboto",
      ],
    },
    {
      name: "مقلاة هوائية ديجيتال 8 لتر",
      slug: "digital-air-fryer-8l",
      description:
        "مقلاة هوائية ديجيتال بسعة 8 لتر تكفي العائلة بالكامل. 10 برامج طبخ مسبقة. شاشة لمس ديجيتال سهلة الاستخدام. تطهي بدون زيت أو بقليل منه. سلة طهي مزدوجة لطبخ وجبتين مختلفتين. قوة 1800 واط.",
      shortDesc: "طبخ صحي وسريع بدون زيت",
      price: 149,
      compareAt: 229,
      stock: 40,
      lowStock: 8,
      categoryId: home.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "AFR-DIG-8L",
      barcode: "1234567890015",
      weight: 5.2,
      images: [
        "https://placehold.co/600x600/374151/ffffff?text=Air+Fryer&font=roboto",
        "https://placehold.co/600x600/4b5563/ffffff?text=Air+Fryer+Open&font=roboto",
      ],
    },

    // ══════════════════════════════
    // 💄 الجمال (3 منتجات)
    // ══════════════════════════════
    {
      name: "مجموعة العناية بالبشرة الكورية",
      slug: "korean-skincare-set",
      description:
        "مجموعة متكاملة من 7 منتجات كورية للعناية بالبشرة. تشمل: غسول رغوي، تونر مرطب، سيروم فيتامين C، إسنس الحلزون، كريم عين، كريم مرطب، وواقي شمس SPF50. مكونات طبيعية خالية من البارابين والكحول. مناسبة لجميع أنواع البشرة.",
      shortDesc: "بشرة مشرقة ومثالية في 7 خطوات",
      price: 89,
      compareAt: 150,
      stock: 70,
      lowStock: 10,
      categoryId: beauty.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "SKN-KR-SET7",
      barcode: "1234567890016",
      weight: 1.8,
      images: [
        "https://placehold.co/600x600/ec4899/ffffff?text=Skincare+Set&font=roboto",
        "https://placehold.co/600x600/f472b6/ffffff?text=Skincare+Items&font=roboto",
        "https://placehold.co/600x600/db2777/ffffff?text=Skincare+Detail&font=roboto",
      ],
    },
    {
      name: "عطر فاخر - عود وعنبر",
      slug: "luxury-oud-perfume",
      description:
        "عطر فاخر بمزيج العود الكمبودي والعنبر الطبيعي مع لمسات من الزعفران والورد الطائفي. رائحة شرقية أصيلة تدوم أكثر من 12 ساعة. حجم 100ml في زجاجة كريستال فاخرة. Eau de Parfum بتركيز عالي.",
      shortDesc: "رائحة شرقية فاخرة تدوم طوال اليوم",
      price: 199,
      compareAt: 299,
      stock: 40,
      lowStock: 5,
      categoryId: beauty.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "PRF-OUD-100",
      barcode: "1234567890017",
      weight: 0.35,
      images: [
        "https://placehold.co/600x600/b45309/ffffff?text=Oud+Perfume&font=roboto",
        "https://placehold.co/600x600/d97706/ffffff?text=Perfume+Box&font=roboto",
      ],
    },
    {
      name: "جهاز تجفيف الشعر Dyson Supersonic",
      slug: "dyson-supersonic-hair-dryer",
      description:
        "مجفف شعر Dyson Supersonic بتقنية المحرك الرقمي V9. يجفف الشعر بسرعة بدون حرارة مفرطة. مستشعر ذكي يقيس درجة الحرارة 40 مرة في الثانية. يأتي مع 5 رؤوس مختلفة للتصفيف. تصميم خفيف ومتوازن.",
      shortDesc: "أذكى مجفف شعر في العالم من Dyson",
      price: 429,
      compareAt: 499,
      stock: 20,
      lowStock: 5,
      categoryId: beauty.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "DYS-SS-FUCH",
      barcode: "1234567890018",
      weight: 0.66,
      images: [
        "https://placehold.co/600x600/a21caf/ffffff?text=Dyson+Dryer&font=roboto",
        "https://placehold.co/600x600/c026d3/ffffff?text=Dyson+Set&font=roboto",
      ],
    },

    // ══════════════════════════════
    // ⚽ رياضة (4 منتجات)
    // ══════════════════════════════
    {
      name: "ساعة رياضية ذكية Garmin",
      slug: "garmin-sports-watch",
      description:
        "ساعة رياضية ذكية من Garmin مع GPS مدمج متعدد الأقمار الصناعية. مراقبة نبض القلب وتشبع الأكسجين على مدار الساعة. مقاومة للماء حتى 100 متر. بطارية تدوم 14 يوم في الوضع العادي. تتبع أكثر من 100 رياضة مع خرائط مدمجة.",
      shortDesc: "رفيقك الرياضي الذكي مع GPS متقدم",
      price: 349,
      compareAt: 449,
      stock: 35,
      lowStock: 8,
      categoryId: sports.id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "GRM-SPRT-BLK",
      barcode: "1234567890019",
      weight: 0.053,
      images: [
        "https://placehold.co/600x600/059669/ffffff?text=Garmin+Watch&font=roboto",
        "https://placehold.co/600x600/10b981/ffffff?text=Watch+Side&font=roboto",
      ],
    },
    {
      name: "طقم دامبلز قابل للتعديل",
      slug: "adjustable-dumbbell-set",
      description:
        "طقم دامبلز قابل للتعديل من 2 إلى 24 كجم لكل قطعة. آلية تبديل سريعة بلفة واحدة. تصميم مدمج يوفر مساحة 15 دامبل في واحد. مقبض مريح مضاد للانزلاق مع تبطين مطاطي. مثالي لتمارين القوة في المنزل.",
      shortDesc: "15 وزن مختلف في دامبل واحد",
      price: 299,
      compareAt: 450,
      stock: 20,
      lowStock: 5,
      categoryId: sports.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "DMB-ADJ-24",
      barcode: "1234567890020",
      weight: 24.0,
      images: [
        "https://placehold.co/600x600/475569/ffffff?text=Dumbbells&font=roboto",
        "https://placehold.co/600x600/64748b/ffffff?text=Dumbbell+Set&font=roboto",
      ],
    },
    {
      name: "سجادة يوغا احترافية",
      slug: "professional-yoga-mat",
      description:
        "سجادة يوغا احترافية بسمك 6mm من المطاط الطبيعي. سطح مضاد للانزلاق على كلا الجانبين. صديقة للبيئة وخالية من PVC والمواد السامة. خطوط محاذاة مطبوعة للوضعيات الصحيحة. تأتي مع حزام حمل وحقيبة.",
      shortDesc: "الراحة والثبات في كل وضعية",
      price: 59,
      compareAt: 89,
      stock: 100,
      lowStock: 15,
      categoryId: sports.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "YGA-MAT-PRO",
      barcode: "1234567890021",
      weight: 2.5,
      images: [
        "https://placehold.co/600x600/7c3aed/ffffff?text=Yoga+Mat&font=roboto",
        "https://placehold.co/600x600/8b5cf6/ffffff?text=Yoga+Mat+Roll&font=roboto",
      ],
    },
    {
      name: "حبل قفز ذكي بعداد",
      slug: "smart-jump-rope",
      description:
        "حبل قفز ذكي مع شاشة LED تعرض عدد القفزات والسعرات المحروقة والوقت. كابل فولاذي مغلف بـ PVC قابل للتعديل. مقابض مريحة مع حشوة إسفنجية. بطارية قابلة لإعادة الشحن تدوم 30 يوم. يتصل بتطبيق الهاتف لتتبع التقدم.",
      shortDesc: "تمرين ممتع وذكي مع تتبع الأداء",
      price: 39,
      compareAt: 59,
      stock: 120,
      lowStock: 20,
      categoryId: sports.id,
      isFeatured: false,
      status: "ACTIVE" as const,
      sku: "JMP-ROPE-SM",
      barcode: "1234567890022",
      weight: 0.3,
      images: [
        "https://placehold.co/600x600/0891b2/ffffff?text=Jump+Rope&font=roboto",
        "https://placehold.co/600x600/06b6d4/ffffff?text=Rope+Display&font=roboto",
      ],
    },
  ]

  for (const product of productsData) {
    const { images, ...data } = product

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...data,
        images: {
          create: images.map((url, index) => ({
            url,
            position: index,
          })),
        },
      },
    })
  }
  console.log(`✅ ${productsData.length} Products created`)

  // ========================================
  // 4. إنشاء الكوبونات
  // ========================================
  const couponsData = [
    {
      code: "WELCOME20",
      type: "PERCENTAGE" as const,
      value: 20,
      minPurchase: 50,
      maxDiscount: 100,
      isActive: true,
    },
    {
      code: "SHOP50",
      type: "FIXED" as const,
      value: 50,
      minPurchase: 200,
      maxDiscount: null,
      isActive: true,
    },
    {
      code: "SUMMER30",
      type: "PERCENTAGE" as const,
      value: 30,
      minPurchase: 100,
      maxDiscount: 150,
      isActive: true,
    },
    {
      code: "FIRST10",
      type: "PERCENTAGE" as const,
      value: 10,
      minPurchase: null,
      maxDiscount: 50,
      isActive: true,
    },
    {
      code: "FREESHIP",
      type: "FIXED" as const,
      value: 10,
      minPurchase: 75,
      maxDiscount: null,
      isActive: true,
    },
  ]

  for (const coupon of couponsData) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    })
  }
  console.log(`✅ ${couponsData.length} Coupons created`)

  // ========================================
  // 5. إنشاء عنوان تجريبي للعميل
  // ========================================
  const existingAddress = await prisma.address.findFirst({
    where: { userId: user.id },
  })

  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: user.id,
        name: "أحمد محمد",
        phone: "+201234567890",
        street: "شارع التحرير، عمارة 15، شقة 4",
        city: "القاهرة",
        state: "القاهرة",
        country: "مصر",
        zipCode: "11511",
        isDefault: true,
      },
    })
    console.log("✅ Test address created")
  }

  // ========================================
  // طباعة الملخص
  // ========================================
  console.log("")
  console.log("🎉 ═══════════════════════════════════════")
  console.log("   Seeding Complete!")
  console.log("═══════════════════════════════════════════")
  console.log("")
  console.log("👤 Admin Account:")
  console.log("   📧 Email:    admin@shopnext.com")
  console.log("   🔑 Password: admin123456")
  console.log("")
  console.log("👤 Test User Account:")
  console.log("   📧 Email:    user@shopnext.com")
  console.log("   🔑 Password: user123456")
  console.log("")
  console.log("📊 Data Summary:")
  console.log("   📦 Products:   22")
  console.log("   🏷️ Categories: 6")
  console.log("   🎫 Coupons:    5")
  console.log("   🏠 Addresses:  1")
  console.log("")
  console.log("═══════════════════════════════════════════")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })