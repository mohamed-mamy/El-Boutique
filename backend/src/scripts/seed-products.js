/**
 * Seed script — Creates categories and products from local images.
 *
 * Usage:
 *   1. Place your images on Desktop (1.jpg to 21.jpg)
 *   2. Run: npm run seed:products
 *
 * If Cloudinary is configured, images are uploaded.
 * Otherwise, products are created without images (add later via admin).
 */

require('dotenv').config();

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category.model');
const Product = require('../models/Product.model');

const IMAGES_DIR = path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop');

// Check if Cloudinary is configured
const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
let cloudinary;
if (cloudinaryConfigured) {
  cloudinary = require('../config/cloudinary');
  console.log('☁️  Cloudinary configured — images will be uploaded.\n');
} else {
  console.log('⚠️  Cloudinary not configured — products will be created without images.\n');
}

const products = [
  // === ملاحف (Snacks) — images 1.jpeg to 10.jpeg ===
  {
    nameAr: 'ملاحف كيهدي',
    nameFr: 'Moulakhaf Kehdi',
    descriptionAr: 'ملاحف كيهدي مقرمشة ولذيذة',
    descriptionFr: 'Moulakhaf Kehdi croustillants et délicieux',
    price: 150,
    imageFile: '1.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'غاز الإيراني',
    nameFr: 'Gaz Irani',
    descriptionAr: 'غاز إيراني أصلي',
    descriptionFr: 'Gaz irani authentique',
    price: 200,
    imageFile: '2.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'ملحف بآسي',
    nameFr: 'Moulakhaf Baasi',
    descriptionAr: 'ملحف بآسي',
    descriptionFr: 'Moulakhaf Baasi',
    price: 150,
    imageFile: '3.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'كاز صباغة الكوارب',
    nameFr: 'Kaz Sabaghet El Kwrb',
    descriptionAr: 'كاز صباغة الكوارب',
    descriptionFr: 'Kaz pour teinture des vêtements',
    price: 100,
    imageFile: '4.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'ملحف غاز',
    nameFr: 'Moulakhaf Gaz',
    descriptionAr: 'ملحف غاز',
    descriptionFr: 'Moulakhaf Gaz',
    price: 150,
    imageFile: '5.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'ملحف غاز',
    nameFr: 'Moulakhaf Gaz',
    descriptionAr: 'ملحف غاز',
    descriptionFr: 'Moulakhaf Gaz',
    price: 150,
    imageFile: '6.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'ملحف غاز',
    nameFr: 'Moulakhaf Gaz',
    descriptionAr: 'ملحف غاز',
    descriptionFr: 'Moulakhaf Gaz',
    price: 150,
    imageFile: '7.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'ملحف غاز',
    nameFr: 'Moulakhaf Gaz',
    descriptionAr: 'ملحف غاز',
    descriptionFr: 'Moulakhaf Gaz',
    price: 150,
    imageFile: '8.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'ملحف غاز',
    nameFr: 'Moulakhaf Gaz',
    descriptionAr: 'ملحف غاز',
    descriptionFr: 'Moulakhaf Gaz',
    price: 150,
    imageFile: '9.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },
  {
    nameAr: 'ملحف غاز',
    nameFr: 'Moulakhaf Gaz',
    descriptionAr: 'ملحف غاز',
    descriptionFr: 'Moulakhaf Gaz',
    price: 150,
    imageFile: '10.jpg',
    categoryAr: 'الملاحف',
    categoryFr: 'Snacks',
  },

  // === شنط نسائية (Women's Bags) — images 11.jpeg to 15.jpeg ===
  {
    nameAr: 'شنطة نسائية',
    nameFr: 'Sac à main femme',
    descriptionAr: 'شنطة نسائية أنيقة',
    descriptionFr: 'Sac à main femme élégant',
    price: 2500,
    imageFile: '11.jpg',
    categoryAr: 'الشنط النسائية',
    categoryFr: 'Sacs à main',
  },
  {
    nameAr: 'شنطة نسائية',
    nameFr: 'Sac à main femme',
    descriptionAr: 'شنطة نسائية أنيقة',
    descriptionFr: 'Sac à main femme élégant',
    price: 2500,
    imageFile: '12.jpg',
    categoryAr: 'الشنط النسائية',
    categoryFr: 'Sacs à main',
  },
  {
    nameAr: 'شنطة نسائية',
    nameFr: 'Sac à main femme',
    descriptionAr: 'شنطة نسائية أنيقة',
    descriptionFr: 'Sac à main femme élégant',
    price: 2500,
    imageFile: '13.jpg',
    categoryAr: 'الشنط النسائية',
    categoryFr: 'Sacs à main',
  },
  {
    nameAr: 'شنطة نسائية',
    nameFr: 'Sac à main femme',
    descriptionAr: 'شنطة نسائية أنيقة',
    descriptionFr: 'Sac à main femme élégant',
    price: 2500,
    imageFile: '14.jpg',
    categoryAr: 'الشنط النسائية',
    categoryFr: 'Sacs à main',
  },
  {
    nameAr: 'شنطة نسائية',
    nameFr: 'Sac à main femme',
    descriptionAr: 'شنطة نسائية أنيقة',
    descriptionFr: 'Sac à main femme élégant',
    price: 2500,
    imageFile: '15.jpg',
    categoryAr: 'الشنط النسائية',
    categoryFr: 'Sacs à main',
  },

  // === كعب نسائي (Women's Heels) — images 16.jpeg to 21.jpeg ===
  {
    nameAr: 'كعب نسائي',
    nameFr: 'Chaussure à talon femme',
    descriptionAr: 'كعب نسائي أنيق',
    descriptionFr: 'Chaussure à talon femme élégante',
    price: 3000,
    imageFile: '16.jpg',
    categoryAr: 'كعب نسائي',
    categoryFr: 'Chaussures à talons',
  },
  {
    nameAr: 'كعب نسائي',
    nameFr: 'Chaussure à talon femme',
    descriptionAr: 'كعب نسائي أنيق',
    descriptionFr: 'Chaussure à talon femme élégante',
    price: 3000,
    imageFile: '17.jpg',
    categoryAr: 'كعب نسائي',
    categoryFr: 'Chaussures à talons',
  },
  {
    nameAr: 'كعب نسائي',
    nameFr: 'Chaussure à talon femme',
    descriptionAr: 'كعب نسائي أنيق',
    descriptionFr: 'Chaussure à talon femme élégante',
    price: 3000,
    imageFile: '18.jpg',
    categoryAr: 'كعب نسائي',
    categoryFr: 'Chaussures à talons',
  },
  {
    nameAr: 'كعب نسائي',
    nameFr: 'Chaussure à talon femme',
    descriptionAr: 'كعب نسائي أنيق',
    descriptionFr: 'Chaussure à talon femme élégante',
    price: 3000,
    imageFile: '19.jpg',
    categoryAr: 'كعب نسائي',
    categoryFr: 'Chaussures à talons',
  },
  {
    nameAr: 'كعب نسائي',
    nameFr: 'Chaussure à talon femme',
    descriptionAr: 'كعب نسائي أنيق',
    descriptionFr: 'Chaussure à talon femme élégante',
    price: 3000,
    imageFile: '20.jpg',
    categoryAr: 'كعب نسائي',
    categoryFr: 'Chaussures à talons',
  },
  {
    nameAr: 'كعب نسائي',
    nameFr: 'Chaussure à talon femme',
    descriptionAr: 'كعب نسائي أنيق',
    descriptionFr: 'Chaussure à talon femme élégante',
    price: 3000,
    imageFile: '21.jpg',
    categoryAr: 'كعب نسائي',
    categoryFr: 'Chaussures à talons',
  },
];

/**
 * Upload a local image file to Cloudinary
 */
const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
  });
};

/**
 * Get or create a category by Arabic/French name
 */
const getOrCreateCategory = async (nameAr, nameFr) => {
  let category = await Category.findOne({ nameAr });
  if (!category) {
    category = await Category.create({ nameAr, nameFr, isActive: true });
    console.log(`  ✅ Category created: ${nameAr} / ${nameFr}`);
  } else {
    console.log(`  ⚠️  Category exists: ${nameAr} / ${nameFr}`);
  }
  return category;
};

const seedProducts = async () => {
  try {
    // Check if images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
      console.log('   Please create the directory and place your images there.');
      console.log(`   mkdir "${IMAGES_DIR}"`);
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete existing products and categories to start fresh
    console.log('🗑️  Deleting old products and categories...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('   Done.\n');

    // Collect unique categories
    const categoryMap = {};
    for (const p of products) {
      const key = p.categoryAr;
      if (!categoryMap[key]) {
        categoryMap[key] = { nameAr: p.categoryAr, nameFr: p.categoryFr };
      }
    }

    // Create categories
    console.log('📁 Creating categories...');
    const categories = {};
    for (const [key, cat] of Object.entries(categoryMap)) {
      categories[key] = await getOrCreateCategory(cat.nameAr, cat.nameFr);
    }
    console.log('');

    // Create products
    console.log('📦 Creating products...\n');
    let created = 0;
    let skipped = 0;

    for (const p of products) {
      // Check if image file exists
      const imagePath = path.join(IMAGES_DIR, p.imageFile);
      if (!fs.existsSync(imagePath)) {
        console.log(`  ❌ Image not found: ${p.imageFile} — skipping "${p.nameAr}"`);
        skipped++;
        continue;
      }

      // Upload image to Cloudinary
      console.log(`  ⬆️  Uploading ${p.imageFile}...`);
      try {
        const uploaded = await uploadToCloudinary(imagePath, 'el-boutique/products');

        // Create product
        const category = categories[p.categoryAr];
        await Product.create({
          nameAr: p.nameAr,
          nameFr: p.nameFr,
          descriptionAr: p.descriptionAr,
          descriptionFr: p.descriptionFr,
          price: p.price,
          quantity: 999,
          category: category._id,
          images: [{ url: uploaded.url, publicId: uploaded.publicId }],
          isActive: true,
          isFeatured: false,
        });

        console.log(`  ✅ Product created: ${p.nameAr} (${p.imageFile})`);
        created++;
      } catch (err) {
        console.log(`  ❌ Failed to upload ${p.imageFile}: ${err.message}`);
        skipped++;
      }
    }

    console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedProducts();
