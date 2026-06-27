import type { Category } from '../types/category';
import type { Product } from '../types/product';

export const MOCK_CATEGORY_IDS = {
  electronics: '11111111-1111-1111-1111-111111111101',
  fashion: '11111111-1111-1111-1111-111111111102',
  home: '11111111-1111-1111-1111-111111111103',
  sports: '11111111-1111-1111-1111-111111111104',
  books: '11111111-1111-1111-1111-111111111105',
} as const;

export const MOCK_SELLER_ID = '22222222-2222-2222-2222-222222222201';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: MOCK_CATEGORY_IDS.electronics,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets, devices, and tech accessories',
  },
  {
    id: MOCK_CATEGORY_IDS.fashion,
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trending styles, apparel, and accessories',
  },
  {
    id: MOCK_CATEGORY_IDS.home,
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, decor, and outdoor essentials',
  },
  {
    id: MOCK_CATEGORY_IDS.sports,
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Gear for fitness, camping, and active lifestyles',
  },
  {
    id: MOCK_CATEGORY_IDS.books,
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Bestsellers, guides, and educational content',
  },
];

type MockProductSeed = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  sellerName: string;
  stock: number;
  imageSeed: string;
};

const productSeeds: MockProductSeed[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound for work and travel.',
    price: 149.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 48,
    imageSeed: 'headphones',
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    name: 'Smart Fitness Watch Pro',
    slug: 'smart-fitness-watch-pro',
    description:
      'Track heart rate, sleep, GPS routes, and 100+ workout modes. Water-resistant design with a vibrant AMOLED display.',
    price: 199.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 35,
    imageSeed: 'smartwatch',
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description:
      'Compact speaker with 360° sound, IPX7 waterproof rating, and 12 hours of playtime. Perfect for outdoor adventures.',
    price: 59.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'AudioHub',
    stock: 72,
    imageSeed: 'speaker',
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    name: '4K Ultra HD Monitor 27"',
    slug: '4k-ultra-hd-monitor-27',
    description:
      'Crisp 4K display with HDR support, slim bezels, and adjustable stand. Ideal for designers, gamers, and remote workers.',
    price: 329.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 18,
    imageSeed: 'monitor',
  },
  {
    id: '33333333-3333-3333-3333-333333333305',
    name: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    description:
      'Timeless medium-wash denim jacket with a relaxed fit. Durable cotton blend with reinforced stitching and metal buttons.',
    price: 79.99,
    categoryId: MOCK_CATEGORY_IDS.fashion,
    categoryName: 'Fashion',
    sellerName: 'Urban Threads',
    stock: 40,
    imageSeed: 'denim-jacket',
  },
  {
    id: '33333333-3333-3333-3333-333333333306',
    name: 'Premium Leather Sneakers',
    slug: 'premium-leather-sneakers',
    description:
      'Minimalist white leather sneakers with cushioned insoles and rubber outsole. Versatile style for everyday wear.',
    price: 119.99,
    categoryId: MOCK_CATEGORY_IDS.fashion,
    categoryName: 'Fashion',
    sellerName: 'Urban Threads',
    stock: 55,
    imageSeed: 'sneakers',
  },
  {
    id: '33333333-3333-3333-3333-333333333307',
    name: 'Organic Cotton T-Shirt Pack',
    slug: 'organic-cotton-t-shirt-pack',
    description:
      'Set of 3 soft organic cotton tees in neutral colors. Breathable fabric with a modern slim fit.',
    price: 44.99,
    categoryId: MOCK_CATEGORY_IDS.fashion,
    categoryName: 'Fashion',
    sellerName: 'GreenWear Co.',
    stock: 90,
    imageSeed: 'tshirts',
  },
  {
    id: '33333333-3333-3333-3333-333333333308',
    name: 'Ceramic Pour-Over Coffee Set',
    slug: 'ceramic-pour-over-coffee-set',
    description:
      'Handcrafted ceramic dripper, glass carafe, and stainless filter. Brew barista-quality coffee at home.',
    price: 54.99,
    categoryId: MOCK_CATEGORY_IDS.home,
    categoryName: 'Home & Garden',
    sellerName: 'HomeCraft Living',
    stock: 28,
    imageSeed: 'coffee-set',
  },
  {
    id: '33333333-3333-3333-3333-333333333309',
    name: 'Memory Foam Pillow (Set of 2)',
    slug: 'memory-foam-pillow-set-of-2',
    description:
      'Cooling gel-infused memory foam pillows with removable washable covers. Designed for neck support and better sleep.',
    price: 69.99,
    categoryId: MOCK_CATEGORY_IDS.home,
    categoryName: 'Home & Garden',
    sellerName: 'HomeCraft Living',
    stock: 64,
    imageSeed: 'pillows',
  },
  {
    id: '33333333-3333-3333-3333-333333333310',
    name: 'Indoor Herb Garden Kit',
    slug: 'indoor-herb-garden-kit',
    description:
      'Complete starter kit with LED grow light, pots, soil discs, and basil, parsley, and cilantro seeds.',
    price: 39.99,
    categoryId: MOCK_CATEGORY_IDS.home,
    categoryName: 'Home & Garden',
    sellerName: 'GreenThumb Supply',
    stock: 45,
    imageSeed: 'herb-garden',
  },
  {
    id: '33333333-3333-3333-3333-333333333311',
    name: 'Yoga Mat with Carrying Strap',
    slug: 'yoga-mat-with-carrying-strap',
    description:
      'Non-slip 6mm thick mat made from eco-friendly TPE. Includes alignment lines and a free carrying strap.',
    price: 34.99,
    categoryId: MOCK_CATEGORY_IDS.sports,
    categoryName: 'Sports & Outdoors',
    sellerName: 'ActiveLife Gear',
    stock: 80,
    imageSeed: 'yoga-mat',
  },
  {
    id: '33333333-3333-3333-3333-333333333312',
    name: 'Stainless Steel Water Bottle 32oz',
    slug: 'stainless-steel-water-bottle-32oz',
    description:
      'Double-wall vacuum insulated bottle keeps drinks cold 24h or hot 12h. Leak-proof lid and wide mouth opening.',
    price: 29.99,
    categoryId: MOCK_CATEGORY_IDS.sports,
    categoryName: 'Sports & Outdoors',
    sellerName: 'ActiveLife Gear',
    stock: 120,
    imageSeed: 'water-bottle',
  },
  {
    id: '33333333-3333-3333-3333-333333333313',
    name: 'Camping Hammock with Tree Straps',
    slug: 'camping-hammock-with-tree-straps',
    description:
      'Lightweight parachute nylon hammock rated for 400 lbs. Includes heavy-duty tree straps and stuff sack.',
    price: 49.99,
    categoryId: MOCK_CATEGORY_IDS.sports,
    categoryName: 'Sports & Outdoors',
    sellerName: 'TrailBlaze Outdoors',
    stock: 33,
    imageSeed: 'hammock',
  },
  {
    id: '33333333-3333-3333-3333-333333333314',
    name: 'The Art of Product Design',
    slug: 'the-art-of-product-design',
    description:
      'A practical guide to building user-centered products. Covers research, prototyping, and go-to-market strategy.',
    price: 24.99,
    categoryId: MOCK_CATEGORY_IDS.books,
    categoryName: 'Books & Media',
    sellerName: 'PageTurner Books',
    stock: 100,
    imageSeed: 'design-book',
  },
  {
    id: '33333333-3333-3333-3333-333333333315',
    name: 'Enterprise E-Commerce Handbook',
    slug: 'enterprise-e-commerce-handbook',
    description:
      'Comprehensive reference for multi-vendor marketplaces, payments, logistics, and seller payout systems.',
    price: 39.99,
    categoryId: MOCK_CATEGORY_IDS.books,
    categoryName: 'Books & Media',
    sellerName: 'PageTurner Books',
    stock: 75,
    imageSeed: 'ecommerce-book',
  },
  {
    id: '33333333-3333-3333-3333-333333333316',
    name: 'Mechanical Keyboard RGB',
    slug: 'mechanical-keyboard-rgb',
    description:
      'Hot-swappable mechanical keyboard with tactile switches, per-key RGB lighting, and aluminum frame.',
    price: 129.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 22,
    imageSeed: 'keyboard',
  },
  {
    id: '33333333-3333-3333-3333-333333333317',
    name: 'Wireless Earbuds Pro',
    slug: 'wireless-earbuds-pro',
    description:
      'True wireless earbuds with active noise cancellation, ambient mode, and 8-hour battery life per charge.',
    price: 89.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'AudioHub',
    stock: 150,
    imageSeed: 'earbuds',
  },
  {
    id: '33333333-3333-3333-3333-333333333318',
    name: 'Adjustable Laptop Stand',
    slug: 'adjustable-laptop-stand',
    description:
      'Lightweight aluminum laptop stand with adjustable height and airflow-friendly design for better ergonomics.',
    price: 39.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 64,
    imageSeed: 'laptop-stand',
  },
  {
    id: '33333333-3333-3333-3333-333333333319',
    name: 'Fast USB-C Phone Charger 30W',
    slug: 'fast-usb-c-phone-charger-30w',
    description:
      'Compact 30W USB-C PD charger for fast charging phones and tablets with built-in safety protections.',
    price: 19.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 210,
    imageSeed: 'phone-charger',
  },
  {
    id: '33333333-3333-3333-3333-333333333320',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description:
      'Mesh back office chair with lumbar support, adjustable armrests, and a breathable seat for long work sessions.',
    price: 199.99,
    categoryId: MOCK_CATEGORY_IDS.home,
    categoryName: 'Home & Garden',
    sellerName: 'HomeCraft Living',
    stock: 26,
    imageSeed: 'office-chair',
  },
  {
    id: '33333333-3333-3333-3333-333333333321',
    name: 'Modern Vegetarian Cookbook',
    slug: 'modern-vegetarian-cookbook',
    description:
      'A collection of fresh vegetarian recipes for weeknight dinners and entertaining, with beautiful photography.',
    price: 27.99,
    categoryId: MOCK_CATEGORY_IDS.books,
    categoryName: 'Books & Media',
    sellerName: 'PageTurner Books',
    stock: 140,
    imageSeed: 'cookbook',
  },
  {
    id: '33333333-3333-3333-3333-333333333322',
    name: 'Bluetooth Item Tracker (4-pack)',
    slug: 'bluetooth-item-tracker-4-pack',
    description:
      'Small Bluetooth trackers with replaceable batteries — attach to keys, bags, and luggage to find lost items.',
    price: 34.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 300,
    imageSeed: 'tracker',
  },
  {
    id: '33333333-3333-3333-3333-333333333323',
    name: 'Gaming Mouse Wireless',
    slug: 'gaming-mouse-wireless',
    description:
      'High-precision wireless gaming mouse with customizable DPI, programmable buttons, and long battery life.',
    price: 69.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 85,
    imageSeed: 'gaming-mouse',
  },
  {
    id: '33333333-3333-3333-3333-333333333324',
    name: 'Smart LED Bulb (Color)',
    slug: 'smart-led-bulb-color',
    description:
      'Wi-Fi enabled color-changing LED bulb compatible with major smart home platforms, dimmable with schedules.',
    price: 22.99,
    categoryId: MOCK_CATEGORY_IDS.home,
    categoryName: 'Home & Garden',
    sellerName: 'HomeCraft Living',
    stock: 190,
    imageSeed: 'smart-bulb',
  },
  {
    id: '33333333-3333-3333-3333-333333333325',
    name: 'Screen Protector Pack (3)',
    slug: 'screen-protector-pack-3',
    description:
      'Tempered glass screen protectors with anti-scratch coating and easy-install alignment frame.',
    price: 12.99,
    categoryId: MOCK_CATEGORY_IDS.electronics,
    categoryName: 'Electronics',
    sellerName: 'TechVault Store',
    stock: 420,
    imageSeed: 'screen-protector',
  },
];

function imageUrl(seed: string, width = 600, height = 600): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

function toMockProduct(seed: MockProductSeed): Product & {
  category: { id: string; name: string; slug: string };
  seller: { id: string; businessName: string };
  inventory: { quantity: number; reserved: number; available: number };
} {
  const category = MOCK_CATEGORIES.find((item) => item.id === seed.categoryId)!;

  return {
    id: seed.id,
    name: seed.name,
    slug: seed.slug,
    description: seed.description,
    price: seed.price,
    categoryId: seed.categoryId,
    sellerId: MOCK_SELLER_ID,
    stock: seed.stock,
    images: [
      imageUrl(seed.imageSeed),
      imageUrl(`${seed.imageSeed}-2`, 400, 400),
    ],
    isActive: true,
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
    },
    seller: {
      id: MOCK_SELLER_ID,
      businessName: seed.sellerName,
    },
    inventory: {
      quantity: seed.stock,
      reserved: 0,
      available: seed.stock,
    },
  };
}

export const MOCK_PRODUCTS = productSeeds.map(toMockProduct);

export function getMockProduct(id: string) {
  return MOCK_PRODUCTS.find((product) => product.id === id) ?? null;
}

export function filterMockProducts(filters?: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  let results = [...MOCK_PRODUCTS];

  if (filters?.categoryId) {
    results = results.filter((product) => product.categoryId === filters.categoryId);
  }

  if (filters?.minPrice) {
    results = results.filter((product) => product.price >= filters.minPrice!);
  }

  if (filters?.maxPrice) {
    results = results.filter((product) => product.price <= filters.maxPrice!);
  }

  if (filters?.inStock) {
    results = results.filter((product) => product.stock > 0);
  }

  const sortBy = filters?.sortBy ?? 'createdAt';
  const sortOrder = filters?.sortOrder ?? 'desc';

  results.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'price') {
      comparison = a.price - b.price;
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + limit);

  return {
    products: paginated,
    pagination: {
      page,
      limit,
      total: results.length,
      totalPages: Math.max(1, Math.ceil(results.length / limit)),
    },
  };
}

export function searchMockProducts(params: {
  q: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  const query = params.q.toLowerCase().trim();
  let results = MOCK_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.name.toLowerCase().includes(query)
  );

  if (params.categoryId) {
    results = results.filter((product) => product.categoryId === params.categoryId);
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const start = (page - 1) * limit;

  return {
    products: results.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: results.length,
      totalPages: Math.max(1, Math.ceil(results.length / limit)),
    },
  };
}

export function getMockCategoriesWithCounts() {
  return MOCK_CATEGORIES.map((category) => ({
    ...category,
    productCount: MOCK_PRODUCTS.filter((product) => product.categoryId === category.id).length,
  }));
}
