#!/usr/bin/env node

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import { Member } from '../models/Member.js';
import { Brand } from '../models/Brand.js';
import { Perfume } from '../models/Perfume.js';
import { Comment } from '../models/Comment.js';
import { sampleBrands, samplePerfumes, sampleUsers, sampleComments } from '../data/sampleData.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to database
await connectDB();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Member.deleteMany({});
    await Brand.deleteMany({});
    await Perfume.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed brands
    const brands = await Brand.insertMany(sampleBrands);
    console.log(`✅ Seeded ${brands.length} brands`);

    // Seed users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    const users = await Member.insertMany(hashedUsers);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed perfumes with brand references
    const perfumesWithBrands = samplePerfumes.map((perfume, index) => ({
      ...perfume,
      brand: brands[index % brands.length]._id
    }));
    const perfumes = await Perfume.insertMany(perfumesWithBrands);
    console.log(`✅ Seeded ${perfumes.length} perfumes`);

    // Seed comments with user and perfume references
    const commentsWithRefs = sampleComments.map((comment, index) => ({
      ...comment,
      author: users[index % users.length]._id,
      perfume: perfumes[index % perfumes.length]._id
    }));
    const comments = await Comment.insertMany(commentsWithRefs);
    console.log(`✅ Seeded ${comments.length} comments`);

    // Update perfumes with comment references and calculate average ratings
    for (let i = 0; i < perfumes.length; i++) {
      const perfumeComments = comments.filter(
        comment => comment.perfume.toString() === perfumes[i]._id.toString()
      );
      
      const commentIds = perfumeComments.map(comment => comment._id);
      const averageRating = perfumeComments.reduce((sum, comment) => sum + comment.rating, 0) / perfumeComments.length;

      await Perfume.findByIdAndUpdate(perfumes[i]._id, {
        comments: commentIds,
        averageRating: averageRating || 0
      });
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Brands: ${brands.length}`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Perfumes: ${perfumes.length}`);
    console.log(`- Comments: ${comments.length}`);
    console.log('\n👤 Admin credentials:');
    console.log('Email: admin@perfumestore.com');
    console.log('Password: admin123');
    console.log('\n👥 Test user credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: alex@example.com | Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
await seedDatabase();
process.exit(0);
