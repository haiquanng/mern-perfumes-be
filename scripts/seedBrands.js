import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Brand } from '../models/Brand.js';

// Load environment variables
dotenv.config();

const brands = [
  {
    brandName: 'Chanel',
    description: 'French luxury fashion house founded by Gabrielle Chanel',
    country: 'France'
  },
  {
    brandName: 'Dior',
    description: 'French luxury goods company founded by Christian Dior',
    country: 'France'
  },
  {
    brandName: 'Tom Ford',
    description: 'American luxury fashion house founded by Tom Ford',
    country: 'United States'
  },
  {
    brandName: 'Creed',
    description: 'French luxury perfume house founded in 1760',
    country: 'France'
  },
  {
    brandName: 'Maison Margiela',
    description: 'Belgian luxury fashion house founded by Martin Margiela',
    country: 'Belgium'
  },
  {
    brandName: 'Le Labo',
    description: 'New York-based luxury fragrance house',
    country: 'United States'
  },
  {
    brandName: 'Yves Saint Laurent',
    description: 'French luxury fashion house',
    country: 'France'
  },
  {
    brandName: 'Gucci',
    description: 'Italian luxury brand of fashion and leather goods',
    country: 'Italy'
  },
  {
    brandName: 'Versace',
    description: 'Italian luxury fashion company',
    country: 'Italy'
  },
  {
    brandName: 'Hermès',
    description: 'French luxury goods manufacturer',
    country: 'France'
  }
];

async function seedBrands() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing brands
    const deletedCount = await Brand.deleteMany({});
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing brands`);

    // Insert brands
    const insertedBrands = await Brand.insertMany(brands);
    console.log(`✅ Inserted ${insertedBrands.length} brands`);

    console.log('\n📦 Brands seeded successfully!');
    brands.forEach((brand, index) => {
      console.log(`   ${index + 1}. ${brand.brandName} (${brand.country})`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding brands:', error.message);
    process.exit(1);
  }
}

seedBrands();
