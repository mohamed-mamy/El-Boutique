require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const Admin = require('./models/Admin.model');
const Settings = require('./models/Settings.model');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // If no MONGODB_URI, we are using memory server. Seed default data!
    if (!process.env.MONGODB_URI) {
      console.log('🌱 Seeding memory database...');
      await Admin.create({
        name: 'Admin',
        email: 'admin@elboutique.com',
        password: 'Admin@123'
      });
      await Settings.create({ storeName: 'El Boutique' });
      console.log('✅ Seed complete');
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.stack || error);
    process.exit(1);
  }
};

startServer();




