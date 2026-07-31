/**
 * Creates 5 databases, each with a users collection and an admin user.
 * Usage: node src/scripts/create-databases.js
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DB_NAMES = [
  'elboutique_1',
  'elboutique_2',
  'elboutique_3',
  'elboutique_4',
  'elboutique_5',
];

const adminData = {
  name: 'Admin',
  phone: '46335337',
  password: 'Admin@123',
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

const createDatabases = async () => {
  const baseUri = process.env.MONGODB_URI;

  for (const dbName of DB_NAMES) {
    try {
      const dbUri = baseUri.replace(/\/[^/]*$/, `/${dbName}`);
      const conn = await mongoose.createConnection(dbUri).asPromise();

      const User = conn.model('User', userSchema);

      // Check if admin already exists
      const existing = await User.findOne({ phone: adminData.phone });
      if (existing) {
        console.log(`⚠️  ${dbName} — admin already exists (${adminData.phone})`);
      } else {
        await User.create(adminData);
        console.log(`✅ ${dbName} — admin created (phone: ${adminData.phone}, password: ${adminData.password})`);
      }

      await conn.close();
    } catch (err) {
      console.error(`❌ ${dbName} — ${err.message}`);
    }
  }

  console.log('\n🎉 Done!');
  process.exit(0);
};

createDatabases();
