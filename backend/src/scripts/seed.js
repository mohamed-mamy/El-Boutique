/**
 * Seed script — creates the single Admin user if not already present.
 * 
 * Usage: npm run seed
 * 
 * Reads credentials from environment variables:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */

require('dotenv').config();

const mongoose = require('mongoose');
const Admin = require('../models/Admin.model');
const Settings = require('../models/Settings.model');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL || 'admin@elboutique.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const name = process.env.ADMIN_NAME || 'Admin';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`⚠️  Admin already exists: ${email}`);
      console.log('   Skipping admin seed. No changes made.');
    } else {
      const admin = await Admin.create({ name, email, password });
      console.log(`✅ Admin created successfully:`);
      console.log(`   Name:  ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
    }

    // Seed settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        storeName: 'El Boutique',
      });
      console.log('✅ Default settings created successfully.');
    } else {
      console.log('⚠️  Settings already exist. Skipping settings seed.');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
