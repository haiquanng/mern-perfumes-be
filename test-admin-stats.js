/**
 * Test script for Admin Stats API
 * This script will create a test admin user, login, and fetch stats
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api';

async function testAdminStats() {
  try {
    console.log('🧪 Testing Admin Stats API...\n');

    // Step 1: Try to login with existing admin
    console.log('1️⃣ Attempting to login as admin...');
    let loginResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@perfumes.com',
        password: 'Admin123!'
      })
    });

    let loginData = await loginResponse.json();

    // If login fails, try to register
    if (!loginResponse.ok) {
      console.log('   Admin not found, creating new admin account...');

      // Note: You'll need to manually set isAdmin: true in database
      const registerResponse = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Admin User',
          email: 'admin@perfumes.com',
          password: 'Admin123!'
        })
      });

      if (!registerResponse.ok) {
        console.log('❌ Failed to create admin account');
        return;
      }

      console.log('   ⚠️  IMPORTANT: Manually set isAdmin: true in database for this user!');
      console.log('   Run: db.members.updateOne({email: "admin@perfumes.com"}, {$set: {isAdmin: true}})');
      return;
    }

    console.log('   ✅ Logged in successfully');

    // Extract cookies
    const cookies = loginResponse.headers.get('set-cookie');
    const token = cookies?.match(/access_token=([^;]+)/)?.[1];

    if (!token && !loginData.token) {
      console.log('❌ No token received');
      return;
    }

    // Step 2: Fetch stats
    console.log('\n2️⃣ Fetching admin stats...');
    const statsResponse = await fetch(`${BASE_URL}/admin/stats`, {
      headers: {
        'Cookie': `access_token=${token || loginData.token}`
      }
    });

    if (!statsResponse.ok) {
      const error = await statsResponse.json();
      console.log('❌ Failed to fetch stats:', error);
      return;
    }

    const stats = await statsResponse.json();
    console.log('   ✅ Stats fetched successfully\n');

    // Display stats nicely
    console.log('📊 OVERVIEW STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   👥 Total Users:         ${stats.overview.totalUsers}`);
    console.log(`   🧴 Total Products:      ${stats.overview.totalProducts}`);
    console.log(`   🏷️  Total Brands:        ${stats.overview.totalBrands}`);
    console.log(`   💬 Total Comments:      ${stats.overview.totalComments}`);
    console.log(`   ⭐ Average Rating:      ${stats.overview.averageRatingAcrossAllProducts}/5`);
    console.log(`   📈 Products w/ Ratings: ${stats.overview.productsWithRatings}`);
    console.log(`   🆕 Recent Users (7d):   ${stats.overview.recentUsersCount}`);

    console.log('\n⭐ TOP RATED PRODUCTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    stats.topRatedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.brand}) - ⭐ ${product.rating}`);
    });

    console.log('\n💬 MOST REVIEWED PRODUCTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    stats.mostReviewedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.brand}) - ${product.commentCount} reviews, ⭐ ${product.rating}`);
    });

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAdminStats();
}
