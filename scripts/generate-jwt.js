#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Generate a secure JWT secret
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Update .env file with new JWT secret
const updateEnvFile = (jwtSecret) => {
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace JWT_SECRET line
    envContent = envContent.replace(
      /JWT_SECRET=.*/,
      `JWT_SECRET=${jwtSecret}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ JWT secret updated in .env file');
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    process.exit(1);
  }
};

// Main function
const main = () => {
  console.log('🔐 Generating secure JWT secret...');
  
  const jwtSecret = generateJWTSecret();
  console.log('Generated JWT Secret:', jwtSecret);
  
  updateEnvFile(jwtSecret);
  
  console.log('✅ JWT secret generation complete!');
  console.log('💡 You can now start your server with: npm run dev');
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateJWTSecret, updateEnvFile };
