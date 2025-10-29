import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Member } from '../models/Member.js';

// Load environment variables
dotenv.config();

/**
 * Create default admin account
 * Email: admin@perfumestore.com
 * Password: admin123
 */
async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Admin credentials
    const adminEmail = 'admin@perfumestore.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin';

    // Check if admin already exists
    const existingAdmin = await Member.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   IsAdmin: ${existingAdmin.isAdmin}`);

      // Update to admin if not already
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('✅ Updated user to admin status');
      }

      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await Member.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      yob: null,
      gender: null
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', adminEmail);
    console.log('🔑 Password: ', adminPassword);
    console.log('👤 Name:     ', adminName);
    console.log('🔰 Role:      Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change this password in production!');
    console.log('\nYou can now login at: http://localhost:4000/api/login\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
