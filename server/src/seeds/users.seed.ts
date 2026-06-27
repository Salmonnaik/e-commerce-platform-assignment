import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/enterprise-ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    const testUsers = [
      {
        name: 'John Customer',
        email: 'customer@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
      {
        name: 'Jane Seller',
        email: 'seller@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'SELLER',
        status: 'ACTIVE',
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    ];

    const createdUsers = await User.insertMany(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users:`);
    createdUsers.forEach((user) => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedUsers();
