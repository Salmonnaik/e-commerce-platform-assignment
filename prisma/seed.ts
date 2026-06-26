import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets, devices, and tech accessories' },
  { name: 'Fashion', slug: 'fashion', description: 'Trending styles, apparel, and accessories' },
  { name: 'Home & Garden', slug: 'home-garden', description: 'Furniture, decor, and outdoor essentials' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear for fitness and active lifestyles' },
  { name: 'Books & Media', slug: 'books-media', description: 'Bestsellers and educational content' },
];

const sellers = [
  { email: 'seller@techvault.com', name: 'TechVault Admin', businessName: 'TechVault Store', businessEmail: 'seller@techvault.com' },
  { email: 'seller@urbanthreads.com', name: 'Urban Threads Admin', businessName: 'Urban Threads', businessEmail: 'seller@urbanthreads.com' },
  { email: 'seller@homcraft.com', name: 'HomeCraft Admin', businessName: 'HomeCraft Living', businessEmail: 'seller@homcraft.com' },
];

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.', price: 149.99, categorySlug: 'electronics', sellerEmail: 'seller@techvault.com', stock: 48, imageSeed: 'headphones' },
  { name: 'Smart Fitness Watch Pro', description: 'Track heart rate, sleep, GPS routes, and 100+ workout modes with AMOLED display.', price: 199.99, categorySlug: 'electronics', sellerEmail: 'seller@techvault.com', stock: 35, imageSeed: 'smartwatch' },
  { name: 'Portable Bluetooth Speaker', description: 'Compact 360° speaker with IPX7 waterproof rating and 12 hours of playtime.', price: 59.99, categorySlug: 'electronics', sellerEmail: 'seller@techvault.com', stock: 72, imageSeed: 'speaker' },
  { name: '4K Ultra HD Monitor 27"', description: 'Crisp 4K HDR display with slim bezels and adjustable stand.', price: 329.99, categorySlug: 'electronics', sellerEmail: 'seller@techvault.com', stock: 18, imageSeed: 'monitor' },
  { name: 'Mechanical Keyboard RGB', description: 'Hot-swappable mechanical keyboard with tactile switches and per-key RGB.', price: 129.99, categorySlug: 'electronics', sellerEmail: 'seller@techvault.com', stock: 22, imageSeed: 'keyboard' },
  { name: 'Classic Denim Jacket', description: 'Timeless medium-wash denim jacket with relaxed fit and metal buttons.', price: 79.99, categorySlug: 'fashion', sellerEmail: 'seller@urbanthreads.com', stock: 40, imageSeed: 'denim-jacket' },
  { name: 'Premium Leather Sneakers', description: 'Minimalist white leather sneakers with cushioned insoles.', price: 119.99, categorySlug: 'fashion', sellerEmail: 'seller@urbanthreads.com', stock: 55, imageSeed: 'sneakers' },
  { name: 'Organic Cotton T-Shirt Pack', description: 'Set of 3 soft organic cotton tees in neutral colors.', price: 44.99, categorySlug: 'fashion', sellerEmail: 'seller@urbanthreads.com', stock: 90, imageSeed: 'tshirts' },
  { name: 'Ceramic Pour-Over Coffee Set', description: 'Handcrafted ceramic dripper, glass carafe, and stainless filter.', price: 54.99, categorySlug: 'home-garden', sellerEmail: 'seller@homcraft.com', stock: 28, imageSeed: 'coffee-set' },
  { name: 'Memory Foam Pillow (Set of 2)', description: 'Cooling gel-infused memory foam pillows with washable covers.', price: 69.99, categorySlug: 'home-garden', sellerEmail: 'seller@homcraft.com', stock: 64, imageSeed: 'pillows' },
  { name: 'Indoor Herb Garden Kit', description: 'Starter kit with LED grow light, pots, and herb seeds.', price: 39.99, categorySlug: 'home-garden', sellerEmail: 'seller@homcraft.com', stock: 45, imageSeed: 'herb-garden' },
  { name: 'Yoga Mat with Carrying Strap', description: 'Non-slip 6mm eco-friendly TPE mat with alignment lines.', price: 34.99, categorySlug: 'sports-outdoors', sellerEmail: 'seller@homcraft.com', stock: 80, imageSeed: 'yoga-mat' },
  { name: 'Stainless Steel Water Bottle 32oz', description: 'Double-wall insulated bottle keeps drinks cold 24h or hot 12h.', price: 29.99, categorySlug: 'sports-outdoors', sellerEmail: 'seller@homcraft.com', stock: 120, imageSeed: 'water-bottle' },
  { name: 'The Art of Product Design', description: 'Practical guide to building user-centered products.', price: 24.99, categorySlug: 'books-media', sellerEmail: 'seller@techvault.com', stock: 100, imageSeed: 'design-book' },
  { name: 'Enterprise E-Commerce Handbook', description: 'Reference for multi-vendor marketplaces, payments, and logistics.', price: 39.99, categorySlug: 'books-media', sellerEmail: 'seller@techvault.com', stock: 75, imageSeed: 'ecommerce-book' },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function imageUrl(seed: string): string {
  return `https://picsum.photos/seed/${seed}/600/600`;
}

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const seller of sellers) {
    const user = await prisma.user.upsert({
      where: { email: seller.email },
      update: { name: seller.name, role: 'SELLER' },
      create: {
        email: seller.email,
        password: passwordHash,
        name: seller.name,
        role: 'SELLER',
      },
    });

    await prisma.seller.upsert({
      where: { userId: user.id },
      update: {
        businessName: seller.businessName,
        businessEmail: seller.businessEmail,
        isVerified: true,
        isActive: true,
      },
      create: {
        userId: user.id,
        businessName: seller.businessName,
        businessEmail: seller.businessEmail,
        isVerified: true,
        isActive: true,
        balance: { create: {} },
      },
    });
  }

  const sellerMap = Object.fromEntries(
    (
      await prisma.seller.findMany({
        include: { user: true },
      })
    ).map((s) => [s.user.email, s.id])
  );

  for (const product of products) {
    const slug = slugify(product.name);
    const categoryId = categoryMap[product.categorySlug];
    const sellerId = sellerMap[product.sellerEmail];

    if (!categoryId || !sellerId) continue;

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId,
        sellerId,
        stock: product.stock,
        images: [imageUrl(product.imageSeed), imageUrl(`${product.imageSeed}-2`)],
        isActive: true,
      },
      create: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        categoryId,
        sellerId,
        stock: product.stock,
        images: [imageUrl(product.imageSeed), imageUrl(`${product.imageSeed}-2`)],
        isActive: true,
        inventory: {
          create: {
            quantity: product.stock,
            available: product.stock,
            reserved: 0,
            lowStockThreshold: 10,
          },
        },
      },
    });
  }

  await prisma.user.upsert({
    where: { email: 'customer@demo.com' },
    update: { name: 'Demo Customer', role: 'CUSTOMER' },
    create: {
      email: 'customer@demo.com',
      password: passwordHash,
      name: 'Demo Customer',
      role: 'CUSTOMER',
    },
  });

  console.log(`Seeded ${products.length} products, ${categories.length} categories, ${sellers.length} sellers.`);
  console.log('Demo login: customer@demo.com / Password123!');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
