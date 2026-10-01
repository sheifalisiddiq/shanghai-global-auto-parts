import type { TranslationKey } from "@/lib/i18n/translations";

export interface BlogPost {
  slug: string;
  title: string;
  category: "Fitment & VIN" | "Sourcing & Original" | "Maintenance" | "Operations & QC" | "Logistics & Trade";
  excerpt: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  image: string;
  tags: string[];
  featured?: boolean;
  content: BlogContent;
  ar: BlogPostAr;
}

export interface BlogContent {
  intro: string;
  sections: {
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }[];
  conclusion: string;
  keyTakeaways: string[];
}

export interface BlogPostAr {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  authorRole: string;
  tags: string[];
  content: BlogContent;
}

export type BlogCategory = BlogPost["category"];

export const blogCategories: BlogCategory[] = [
  "Fitment & VIN",
  "Sourcing & Original",
  "Maintenance",
  "Operations & QC",
  "Logistics & Trade",
];

/** Stable category id -> i18n key suffix. */
export const blogCategoryKey: Record<BlogCategory, TranslationKey> = {
  "Fitment & VIN": "blog.cat.fitment",
  "Sourcing & Original": "blog.cat.sourcing",
  Maintenance: "blog.cat.maintenance",
  "Operations & QC": "blog.cat.operations",
  "Logistics & Trade": "blog.cat.logistics",
};

export interface LocalizedBlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  date: string;
  readTime: string;
  author: { name: string; role: string };
  image: string;
  tags: string[];
  featured?: boolean;
  content: BlogContent;
}

/** Returns a post with all display text in the requested language. */
export function localizePost(
  post: BlogPost,
  language: string,
): LocalizedBlogPost {
  if (language !== "ar") return post;
  const { ar } = post;
  return {
    slug: post.slug,
    title: ar.title,
    category: post.category,
    excerpt: ar.excerpt,
    date: ar.date,
    readTime: ar.readTime,
    author: { name: post.author.name, role: ar.authorRole },
    image: post.image,
    tags: ar.tags,
    featured: post.featured,
    content: ar.content,
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: "vin-identification-guide",
    title: "Ultimate Guide to Identifying Original Chinese Auto Parts by VIN",
    category: "Fitment & VIN",
    excerpt:
      "Avoid costly returns and fitment delays. Learn how decoding the 17-character VIN prevents wrong-part dispatches for Jetour, Changan, Geely, and Chery.",
    date: "September 15, 2026",
    readTime: "5 min read",
    author: {
      name: "Li Wei",
      role: "Head of Technical Cataloging",
    },
    image: "/images/products/engine/category.jpg",
    featured: true,
    tags: ["VIN Lookup", "Fitment", "Changan", "Jetour", "Geely", "Auto Parts"],
    content: {
      intro:
        "In the fast-moving GCC automotive market, Chinese vehicle brands like Jetour, Changan, Geely, Chery, Haval, BYD, and MG are rapidly taking center stage. However, workshop managers and fleet operators frequently run into a common obstacle: ensuring part compatibility before order placement.",
      sections: [
        {
          heading: "Why VIN Verification is Critical for Chinese Vehicles",
          paragraphs: [
            "Unlike some legacy vehicle platforms that maintain identical part specifications across multi-year runs, Chinese automakers frequently introduce micro-updates during mid-cycle refreshes. Engine sensors, brake pad dimensions, and suspension mounting brackets can vary even within the same model year.",
            "Using the 17-character Vehicle Identification Number (VIN) allows technical sales desks to query official Electronic Parts Catalogs (EPC) and retrieve the exact factory assembly code.",
          ],
          bulletPoints: [
            "Positions 1-3 (WMI): Identifies manufacturer and country of origin (e.g., L6T for Geely, LS5 for Changan).",
            "Positions 4-8: Specifies engine series, body type, and trim variant.",
            "Position 10: Model year indicator essential for identifying supersessions.",
            "Positions 12-17: Serial production number required for exact part revision matching.",
          ],
        },
        {
          heading: "Common Misconceptions in Part Ordering",
          paragraphs: [
            "Relying solely on vehicle model names (e.g., 'Jetour T2' or 'Changan CS95') is one of the leading causes of part returns. Two vehicles manufactured just months apart may utilize different alternator mounting brackets or steering rack tie rods.",
            "Always capture a clear photograph of the chassis VIN plate located on the lower driver-side windshield or inner door pillar, and forward it to your parts distributor prior to order confirmation.",
          ],
        },
      ],
      conclusion:
        "At Shanghai Global Auto Parts, our sales desk verifies 100% of order inquiries against official manufacturer databases before dispatching items from our Sharjah and Abu Dhabi warehouses.",
      keyTakeaways: [
        "Never order Chinese brand spare parts using model name alone.",
        "Always provide the complete 17-digit VIN code.",
        "VIN lookup eliminates 98% of wrong-part dispatch errors.",
        "Fast WhatsApp VIN quotes are available 6 days a week from Shanghai Global.",
      ],
    },
    ar: {
      "title": "الدليل الشامل لتحديد قطع غيار السيارات الصينية الأصلية عبر رقم الهيكل (VIN)",
      "excerpt": "تجنّب المرتجعات المكلفة وتأخر التوريد. تعرّف كيف يمنع فك رمز رقم الهيكل (VIN) المكوّن من 17 خانة إرسال القطعة الخاطئة لسيارات Jetour وChangan وGeely وChery.",
      "date": "15 سبتمبر 2026",
      "readTime": "5 دقائق للقراءة",
      "authorRole": "رئيس قسم الفهرسة الفنية",
      "tags": [
        "البحث برقم الهيكل",
        "ملاءمة القطع",
        "Changan",
        "Jetour",
        "Geely",
        "قطع غيار السيارات"
      ],
      "content": {
        "intro": "في سوق السيارات الخليجي سريع النمو، تتصدّر العلامات الصينية مثل Jetour وChangan وGeely وChery وHaval وBYD وMG المشهد بسرعة. غير أن مديري الورش ومشغّلي الأساطيل يواجهون عقبة متكررة، وهي التأكد من توافق القطعة مع السيارة قبل تقديم الطلب.",
        "sections": [
          {
            "heading": "لماذا يُعدّ التحقق من رقم الهيكل ضرورياً للسيارات الصينية",
            "paragraphs": [
              "على عكس بعض المنصات القديمة التي تحافظ على مواصفات القطع نفسها لسنوات متعددة، تُجري الشركات الصينية تحديثات دقيقة متكررة خلال التحديثات النصفية للطراز. فقد تختلف حساسات المحرك وأبعاد تيل الفرامل وحوامل تثبيت نظام التعليق حتى ضمن سنة الطراز نفسها.",
              "يتيح رقم تعريف المركبة (VIN) المكوّن من 17 خانة لفريق المبيعات الفني الاستعلام من كتالوجات القطع الإلكترونية الرسمية (EPC) والحصول على رمز التجميع المصنعي الدقيق."
            ],
            "bulletPoints": [
              "الخانات 1-3 (WMI): تحدد الشركة المصنّعة وبلد المنشأ (مثل L6T لـ Geely وLS5 لـ Changan).",
              "الخانات 4-8: تحدد سلسلة المحرك ونوع الهيكل وفئة التجهيز.",
              "الخانة 10: مؤشر سنة الطراز، وهو أساسي لمعرفة القطع البديلة والمستبدلة.",
              "الخانات 12-17: الرقم التسلسلي للإنتاج، المطلوب لمطابقة نسخة القطعة بدقة."
            ]
          },
          {
            "heading": "مفاهيم خاطئة شائعة عند طلب القطع",
            "paragraphs": [
              "يُعدّ الاعتماد على اسم الطراز فقط (مثل Jetour T2 أو Changan CS95) من أبرز أسباب مرتجعات القطع. فقد تستخدم سيارتان صُنعتا بفارق أشهر قليلة حوامل مولّد كهرباء أو وصلات ذراع توجيه مختلفة.",
              "احرص دائماً على التقاط صورة واضحة للوحة رقم الهيكل الموجودة أسفل الزجاج الأمامي من جهة السائق أو على العمود الداخلي للباب، وأرسلها إلى موزّع القطع قبل تأكيد الطلب."
            ]
          }
        ],
        "conclusion": "في شنغهاي غلوبال لقطع الغيار، يتحقق فريق المبيعات لدينا من 100% من طلبات الاستفسار مقابل قواعد بيانات الشركات المصنّعة الرسمية قبل شحن القطع من مستودعاتنا في الشارقة وأبوظبي.",
        "keyTakeaways": [
          "لا تطلب قطع الغيار للعلامات الصينية بالاعتماد على اسم الطراز وحده.",
          "قدّم دائماً رقم الهيكل (VIN) الكامل المكوّن من 17 خانة.",
          "يلغي البحث برقم الهيكل 98% من أخطاء إرسال القطع الخاطئة.",
          "تتوفر عروض أسعار سريعة عبر واتساب برقم الهيكل 6 أيام في الأسبوع من شنغهاي غلوبال."
        ]
      }
    },
  },
  {
    slug: "oem-vs-aftermarket-chinese-parts",
    title: "Original vs OEM vs Aftermarket: What GCC Garages Need to Know",
    category: "Sourcing & Original",
    excerpt:
      "Break down the differences in durability, pricing, warranty coverage, and factory certifications between Original Chinese auto parts and OEM supplier components.",
    date: "September 08, 2026",
    readTime: "6 min read",
    author: {
      name: "Tariq Mansoor",
      role: "Procurement & Quality Lead",
    },
    image: "/images/products/brakes/category.jpg",
    tags: ["OEM Parts", "Original Parts", "Sourcing", "Brake System", "GCC Garages"],
    content: {
      intro:
        "When sourcing replacement components for Chinese vehicles, garage owners and wholesale buyers often compare three distinct tiers: Original (Branded Box), OEM (Tier-1 Manufacturer), and Commercial Aftermarket.",
      sections: [
        {
          heading: "1. Original Parts (Vehicle Manufacturer Branded)",
          paragraphs: [
            "Original parts come in official automaker packaging (e.g., Jetour Original Parts or Changan OEM Box) complete with anti-counterfeiting holographic seals and factory QR verification.",
            "They guarantee 100% factory fitment and preserve full vehicle warranty, making them the preferred choice for insurance repairs and main dealership servicing.",
          ],
        },
        {
          heading: "2. OEM Tier-1 Supplier Parts",
          paragraphs: [
            "OEM (Original Equipment Manufacturer) components are produced by the exact same tier-1 factories that supply the vehicle assembly line (such as Bosch, Mobis, Brembo China, or Wanxiang).",
            "These parts offer identical quality specifications and materials as Original components, but are packaged under the manufacturer's own brand, offering cost savings of 20% to 35%.",
          ],
        },
      ],
      conclusion:
        "Shanghai Global Auto Parts carries both Original factory-sealed stock and verified Tier-1 OEM alternatives, allowing trade buyers to match customer budget requirements without compromising vehicle safety.",
      keyTakeaways: [
        "Original parts offer original factory packaging and holographic anti-tamper seals.",
        "Tier-1 OEM parts provide identical technical performance at 20-35% lower cost.",
        "Avoid unverified white-label aftermarket components for critical safety systems.",
      ],
    },
    ar: {
      "title": "الأصلي مقابل OEM مقابل البديل التجاري: ما يجب أن تعرفه ورش الخليج",
      "excerpt": "تعرّف على الفروق في المتانة والتسعير وتغطية الضمان والشهادات المصنعية بين قطع الغيار الصينية الأصلية ومكوّنات الموردين OEM.",
      "date": "08 سبتمبر 2026",
      "readTime": "6 دقائق للقراءة",
      "authorRole": "رئيس المشتريات والجودة",
      "tags": [
        "قطع OEM",
        "قطع أصلية",
        "التوريد",
        "نظام الفرامل",
        "ورش الخليج"
      ],
      "content": {
        "intro": "عند توريد قطع الغيار للسيارات الصينية، يقارن أصحاب الورش ومشترو الجملة غالباً بين ثلاث فئات: الأصلي (بعبوة الشركة المصنّعة)، وOEM (مورّد من الفئة الأولى)، والبديل التجاري.",
        "sections": [
          {
            "heading": "1. القطع الأصلية (بعلامة الشركة المصنّعة للمركبة)",
            "paragraphs": [
              "تأتي القطع الأصلية في عبوات الشركة المصنّعة الرسمية (مثل قطع Jetour الأصلية أو عبوة Changan OEM) مع أختام هولوغرام مضادة للتقليد ورمز QR للتحقق من المصنع.",
              "وهي تضمن ملاءمة مصنعية بنسبة 100% وتحافظ على ضمان المركبة كاملاً، ما يجعلها الخيار المفضل لإصلاحات التأمين وصيانة الوكالات الرئيسية."
            ]
          },
          {
            "heading": "2. قطع موردي OEM من الفئة الأولى",
            "paragraphs": [
              "تُنتج مكوّنات OEM (الشركة المصنّعة للمعدات الأصلية) في المصانع نفسها من الفئة الأولى التي تورّد خط تجميع المركبة (مثل Bosch وMobis وBrembo China وWanxiang).",
              "توفر هذه القطع المواصفات والمواد نفسها التي تتميز بها القطع الأصلية، لكنها تُعبّأ تحت علامة المصنّع نفسه، مع وفر في التكلفة يتراوح بين 20% و35%."
            ]
          }
        ],
        "conclusion": "توفر شنغهاي غلوبال لقطع الغيار مخزوناً أصلياً مختوماً من المصنع وبدائل OEM موثّقة من الفئة الأولى، ما يتيح لمشتري التجارة مواءمة ميزانية العميل دون المساس بسلامة المركبة.",
        "keyTakeaways": [
          "تتميز القطع الأصلية بعبوة المصنع الأصلية وأختام الهولوغرام المانعة للعبث.",
          "توفر قطع OEM من الفئة الأولى أداءً فنياً مطابقاً بتكلفة أقل بنسبة 20-35%.",
          "تجنّب القطع البديلة مجهولة المصدر في أنظمة السلامة الحرجة."
        ]
      }
    },
  },
  {
    slug: "jetour-changan-maintenance-parts",
    title: "Top 10 Fast-Moving Maintenance Parts for Jetour, Changan & Haval",
    category: "Maintenance",
    excerpt:
      "Explore the most frequently requested service items across GCC fleets – from ceramic brake pads and oil filters to suspension arms and cooling thermostats.",
    date: "August 29, 2026",
    readTime: "4 min read",
    author: {
      name: "Omar Al-Zahra",
      role: "GCC Fleet Operations Specialist",
    },
    image: "/images/about/factory-line.jpg",
    tags: ["Maintenance", "Jetour T2", "Changan CS95", "Haval H6", "Brake Pads"],
    content: {
      intro:
        "With the explosive growth of Chinese SUVs across UAE, Saudi Arabia, and Qatar roads, service centers require high-inventory availability for routine maintenance parts.",
      sections: [
        {
          heading: "Essential Service & Wear Items",
          paragraphs: [
            "High ambient temperatures in the GCC put extreme strain on engine cooling systems, air filtration, and brake friction materials.",
            "Keeping fast-moving maintenance parts in stock prevents extended vehicle downtime for rental fleets and commercial transport operators.",
          ],
          bulletPoints: [
            "Ceramic Front & Rear Brake Pad Sets (Heat resistant up to 650°C).",
            "High-Efficiency Cabin Air & Engine Air Filters.",
            "Water Pump Assemblies & Low-Temp Cooling Thermostats.",
            "Ignition Coils & Iridium Spark Plugs.",
            "Front Lower Suspension Control Arms & Stabilizer Links.",
          ],
        },
      ],
      conclusion:
        "Shanghai Global maintains deep inventory stock for all top 10 fast-moving maintenance items in our Sharjah distribution center.",
      keyTakeaways: [
        "GCC heat accelerates wear on cooling components and rubber bushings.",
        "Stocking fast-moving service kits reduces turnaround time for garages.",
        "Bulk wholesale packages are available with same-day GCC dispatch.",
      ],
    },
    ar: {
      "title": "أهم 10 قطع صيانة سريعة الدوران لسيارات Jetour وChangan وHaval",
      "excerpt": "اكتشف بنود الخدمة الأكثر طلباً في أساطيل الخليج، من تيل الفرامل السيراميك وفلاتر الزيت إلى أذرع التعليق وثرموستات التبريد.",
      "date": "29 أغسطس 2026",
      "readTime": "4 دقائق للقراءة",
      "authorRole": "أخصائي عمليات أساطيل الخليج",
      "tags": [
        "الصيانة",
        "Jetour T2",
        "Changan CS95",
        "Haval H6",
        "تيل الفرامل"
      ],
      "content": {
        "intro": "مع النمو الكبير لسيارات الدفع الرباعي الصينية على طرق الإمارات والسعودية وقطر، تحتاج مراكز الخدمة إلى توافر مخزون كبير من قطع الصيانة الدورية.",
        "sections": [
          {
            "heading": "بنود الخدمة والاستهلاك الأساسية",
            "paragraphs": [
              "تضع درجات الحرارة المرتفعة في الخليج ضغطاً شديداً على أنظمة تبريد المحرك وتنقية الهواء ومواد احتكاك الفرامل.",
              "يحول توفير قطع الصيانة سريعة الدوران في المخزون دون توقف المركبات لفترات طويلة في أساطيل التأجير ومشغّلي النقل التجاري."
            ],
            "bulletPoints": [
              "أطقم تيل الفرامل السيراميك الأمامية والخلفية (مقاومة للحرارة حتى 650 درجة مئوية).",
              "فلاتر هواء المقصورة وهواء المحرك عالية الكفاءة.",
              "مجموعات مضخة الماء وثرموستات التبريد منخفضة الحرارة.",
              "كويلات الإشعال وشمعات الإشعال إيريديوم.",
              "أذرع التحكم السفلية الأمامية للتعليق ووصلات عمود التوازن."
            ]
          }
        ],
        "conclusion": "تحتفظ شنغهاي غلوبال بمخزون وافر من جميع بنود الصيانة العشرة الأسرع دوراناً في مركز التوزيع بالشارقة.",
        "keyTakeaways": [
          "تسرّع حرارة الخليج تآكل مكونات التبريد وجلبات المطاط.",
          "يقلل توفير أطقم الخدمة سريعة الدوران زمن التسليم للورش.",
          "تتوفر باقات الجملة بكميات كبيرة مع شحن في اليوم نفسه داخل دول الخليج."
        ]
      }
    },
  },
  {
    slug: "warehouse-quality-inspection",
    title: "Preventing Wrong-Part Deliveries: Our 5-Step Quality Assurance Protocol",
    category: "Operations & QC",
    excerpt:
      "A look inside Shanghai Global's warehouse workflows – how barcode scanning, physical dimension checks, and protective packaging guarantee 99.8% dispatch accuracy.",
    date: "August 18, 2026",
    readTime: "4 min read",
    author: {
      name: "Chen Gang",
      role: "Warehouse Operations Manager",
    },
    image: "/images/warehouse/qc-technician.jpg",
    tags: ["Quality Control", "Warehouse", "Inspection", "GCC Logistics"],
    content: {
      intro:
        "Dispatching an incorrect auto part results in wasted freight costs, workshop lift downtime, and customer dissatisfaction. Here is how our warehouse team eliminates dispatch errors.",
      sections: [
        {
          heading: "The 5-Step Inspection System",
          paragraphs: [
            "Every inbound container arriving at our Sharjah facility undergoes rigorous verification before cataloging into our central inventory database.",
          ],
          bulletPoints: [
            "1. Inbound Manifest Audit against factory packing lists.",
            "2. Barcode & Hologram Scanning for original authenticity verification.",
            "3. Digital Vernier Calliper Measurements for critical dimensions.",
            "4. Anti-Shock Protective Packaging for glass and electronic modules.",
            "5. Final Dispatch Double-Check by Senior Warehouse Controller.",
          ],
        },
      ],
      conclusion:
        "Our rigorous protocol maintains a 99.8% accurate fulfillment rate across local UAE deliveries and export sea/air freight shipments.",
      keyTakeaways: [
        "Every item is scanned and physically inspected before boxing.",
        "Specialized protective packaging safeguards sensitive sensors and glass.",
        "99.8% accuracy rate across all GCC order dispatches.",
      ],
    },
    ar: {
      "title": "منع تسليم القطع الخاطئة: بروتوكول ضمان الجودة المكوّن من 5 خطوات",
      "excerpt": "نظرة داخل سير العمل في مستودعات شنغهاي غلوبال، وكيف يضمن مسح الباركود وفحص الأبعاد الفعلية والتغليف الواقي دقة شحن تبلغ 99.8%.",
      "date": "18 أغسطس 2026",
      "readTime": "4 دقائق للقراءة",
      "authorRole": "مدير عمليات المستودعات",
      "tags": [
        "مراقبة الجودة",
        "المستودعات",
        "الفحص",
        "لوجستيات الخليج"
      ],
      "content": {
        "intro": "يؤدي إرسال قطعة غيار خاطئة إلى هدر تكاليف الشحن وتعطّل رافعة الورشة وعدم رضا العميل. إليكم كيف يقضي فريق المستودع لدينا على أخطاء الشحن.",
        "sections": [
          {
            "heading": "نظام الفحص المكوّن من 5 خطوات",
            "paragraphs": [
              "تخضع كل حاوية واردة إلى منشأتنا في الشارقة لتحقق صارم قبل إدراجها في قاعدة بيانات المخزون المركزية."
            ],
            "bulletPoints": [
              "1. تدقيق بيان الشحنة الواردة مقابل قوائم التعبئة الصادرة من المصنع.",
              "2. مسح الباركود والهولوغرام للتحقق من أصالة القطع الأصلية.",
              "3. قياس الأبعاد الحرجة بواسطة القدمة ذات الورنية الرقمية.",
              "4. تغليف واقٍ مضاد للصدمات للزجاج والوحدات الإلكترونية.",
              "5. مراجعة نهائية مزدوجة قبل الشحن بواسطة مراقب المستودع الأول."
            ]
          }
        ],
        "conclusion": "يحافظ بروتوكولنا الصارم على معدل تنفيذ دقيق بنسبة 99.8% في عمليات التسليم المحلية داخل الإمارات وشحنات التصدير البحرية والجوية.",
        "keyTakeaways": [
          "يُمسح كل صنف ويُفحص فعلياً قبل تعبئته.",
          "يحمي التغليف الواقي المتخصص الحساسات والزجاج الحساس.",
          "معدل دقة 99.8% في جميع شحنات الطلبات داخل دول الخليج."
        ]
      }
    },
  },
  {
    slug: "gcc-export-logistics-guide",
    title: "How We Transport Chinese Vehicle Parts Across UAE, Qatar & GCC Borders",
    category: "Logistics & Trade",
    excerpt:
      "Understanding border customs clearances, overland land transport schedules, and express air cargo routes for auto parts trade between UAE, Qatar, and Saudi Arabia.",
    date: "August 04, 2026",
    readTime: "5 min read",
    author: {
      name: "Khalid Rahman",
      role: "Head of International Trade & Logistics",
    },
    image: "/images/products/transmission/category.jpg",
    tags: ["GCC Logistics", "Export", "Customs Clearance", "Land Freight"],
    content: {
      intro:
        "Efficient cross-border logistics is the backbone of regional auto parts wholesale. Shanghai Global operates streamlined transport networks connecting our UAE hubs to Qatar, KSA, Oman, and Kuwait.",
      sections: [
        {
          heading: "Land Freight vs Air Express Cargo",
          paragraphs: [
            "For routine replenishment stock, overland land freight trucks provide cost-effective 48 to 72-hour delivery across GCC borders.",
            "For urgent breakdown cases (Vehicle Off Road - VOR), express air freight ensures door-to-door delivery within 24 hours.",
          ],
        },
      ],
      conclusion:
        "All export orders include complete Certificates of Origin (COO), HS-Code documentation, and customs clearance support.",
      keyTakeaways: [
        "Overland land freight delivers across GCC within 48-72 hours.",
        "Express VOR air cargo available for emergency repairs.",
        "Full customs documentation included with every export shipment.",
      ],
    },
    ar: {
      "title": "كيف ننقل قطع السيارات الصينية عبر حدود الإمارات وقطر ودول الخليج",
      "excerpt": "فهم إجراءات التخليص الجمركي على الحدود وجداول النقل البري وخطوط الشحن الجوي السريع لتجارة قطع الغيار بين الإمارات وقطر والسعودية.",
      "date": "04 أغسطس 2026",
      "readTime": "5 دقائق للقراءة",
      "authorRole": "رئيس التجارة الدولية واللوجستيات",
      "tags": [
        "لوجستيات الخليج",
        "التصدير",
        "التخليص الجمركي",
        "الشحن البري"
      ],
      "content": {
        "intro": "تُعدّ اللوجستيات العابرة للحدود الكفؤة عماد تجارة قطع الغيار بالجملة في المنطقة. وتدير شنغهاي غلوبال شبكات نقل منظمة تربط مراكزنا في الإمارات بقطر والسعودية وسلطنة عُمان والكويت.",
        "sections": [
          {
            "heading": "الشحن البري مقابل الشحن الجوي السريع",
            "paragraphs": [
              "بالنسبة لمخزون التجديد الدوري، توفر شاحنات الشحن البري توصيلاً اقتصادياً خلال 48 إلى 72 ساعة عبر حدود دول الخليج.",
              "أما في حالات الأعطال العاجلة (مركبة متوقفة عن العمل - VOR)، فيضمن الشحن الجوي السريع التوصيل من الباب إلى الباب خلال 24 ساعة."
            ]
          }
        ],
        "conclusion": "تتضمن جميع طلبات التصدير شهادات المنشأ (COO) ووثائق رمز النظام المنسق (HS Code) ودعم التخليص الجمركي كاملاً.",
        "keyTakeaways": [
          "يصل الشحن البري إلى دول الخليج خلال 48-72 ساعة.",
          "يتوفر الشحن الجوي السريع لحالات VOR للإصلاحات الطارئة.",
          "تُرفق وثائق الجمارك كاملة مع كل شحنة تصدير."
        ]
      }
    },
  },
  {
    slug: "byd-ev-hybrid-spare-parts",
    title: "Electric & Hybrid Spares: Essential Parts for BYD & Geely EV Fleets",
    category: "Maintenance",
    excerpt:
      "As EV adoption grows across the GCC, discover key replacement components for BYD Atto 3, Tang, Seal, and Geely Geometry models – from thermal management pumps to suspension links.",
    date: "July 22, 2026",
    readTime: "5 min read",
    author: {
      name: "Zhang Wei",
      role: "EV Systems Technical Specialist",
    },
    image: "/images/products/electrical/category.jpg",
    tags: ["BYD", "EV Parts", "Hybrid", "Geely Geometry", "Thermal Management"],
    content: {
      intro:
        "New Energy Vehicles (NEVs) from BYD, Geely, and MG represent a rapidly growing segment in GCC taxi fleets and private ownership. While EVs eliminate traditional oil changes, they require specialized maintenance components.",
      sections: [
        {
          heading: "Key EV Maintenance & Body Components",
          paragraphs: [
            "Electric vehicles operate under heavier curb weights due to battery packs, increasing wear on suspension components, tires, and brake systems.",
            "Battery thermal management systems require high-grade electric coolant pumps, specialized sensors, and sealed heat exchangers.",
          ],
          bulletPoints: [
            "Electric Water Pumps & Battery Cooling Radiators.",
            "Heavy-Duty Suspension Struts & Reinforced Control Arms.",
            "Regenerative Brake Pads & Low-Noise Discs.",
            "High-Voltage Charging Socket Modules & Harnesses.",
          ],
        },
      ],
      conclusion:
        "Shanghai Global Auto Parts provides full catalog support for BYD (Atto 3, Han, Tang, Seal) and Geely EV/PHEV models.",
      keyTakeaways: [
        "EVs place higher stress on suspension and brake components.",
        "Battery cooling pumps and heat exchangers are critical service items.",
        "Complete spare parts availability for BYD & Geely NEV models.",
      ],
    },
    ar: {
      "title": "قطع الغيار للسيارات الكهربائية والهجينة: الأساسيات لأساطيل BYD وGeely الكهربائية",
      "excerpt": "مع تزايد اعتماد السيارات الكهربائية في الخليج، تعرّف على أبرز مكوّنات الاستبدال لطرازات BYD Atto 3 وTang وSeal وGeely Geometry، من مضخات إدارة الحرارة إلى وصلات التعليق.",
      "date": "22 يوليو 2026",
      "readTime": "5 دقائق للقراءة",
      "authorRole": "أخصائي فني لأنظمة السيارات الكهربائية",
      "tags": [
        "BYD",
        "قطع السيارات الكهربائية",
        "هجين",
        "Geely Geometry",
        "إدارة الحرارة"
      ],
      "content": {
        "intro": "تمثل مركبات الطاقة الجديدة (NEVs) من BYD وGeely وMG شريحة سريعة النمو في أساطيل التاكسي والملكية الخاصة بالخليج. ورغم أن السيارات الكهربائية لا تحتاج إلى تغيير الزيت التقليدي، فإنها تتطلب مكوّنات صيانة متخصصة.",
        "sections": [
          {
            "heading": "أهم مكوّنات الصيانة والهيكل للسيارات الكهربائية",
            "paragraphs": [
              "تعمل السيارات الكهربائية بوزن فارغ أكبر بسبب حزم البطاريات، ما يزيد التآكل في مكونات التعليق والإطارات وأنظمة الفرامل.",
              "تتطلب أنظمة إدارة حرارة البطارية مضخات تبريد كهربائية عالية الجودة وحساسات متخصصة ومبادلات حرارية محكمة الإغلاق."
            ],
            "bulletPoints": [
              "مضخات المياه الكهربائية ومشعّات تبريد البطارية.",
              "مساعدات تعليق شديدة التحمل وأذرع تحكم معزّزة.",
              "تيل فرامل لنظام الكبح التجديدي وأقراص منخفضة الضجيج.",
              "وحدات مقبس الشحن عالي الجهد والضفائر الكهربائية."
            ]
          }
        ],
        "conclusion": "توفر شنغهاي غلوبال لقطع الغيار دعماً كاملاً للكتالوج لطرازات BYD (Atto 3 وHan وTang وSeal) وطرازات Geely الكهربائية والهجينة القابلة للشحن.",
        "keyTakeaways": [
          "تضع السيارات الكهربائية ضغطاً أكبر على مكونات التعليق والفرامل.",
          "تُعدّ مضخات تبريد البطارية والمبادلات الحرارية من بنود الخدمة الحرجة.",
          "توافر كامل لقطع الغيار لطرازات BYD وGeely من مركبات الطاقة الجديدة."
        ]
      }
    },
  },
];
