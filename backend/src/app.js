const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route imports
const healthRoute = require('./routes/health.route');
const authRoute = require('./features/auth/auth.route');
const uploadRoute = require('./features/upload/upload.route');
const categoryRoute = require('./features/categories/category.route');
const brandRoute = require('./features/brands/brand.route');
const productRoute = require('./features/products/product.route');
const settingsRoute = require('./features/settings/settings.route');
const orderRoute = require('./features/orders/order.route');
const dashboardRoute = require('./features/dashboard/dashboard.route');

// Middleware imports
const errorHandler = require('./middleware/error.middleware');

const app = express();

// ─── Security ────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// ─── Body Parsing ────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── Routes ──────────────────────────────────────────
app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/brands', brandRoute);
app.use('/api/products', productRoute);
app.use('/api/settings', settingsRoute);
app.use('/api/orders', orderRoute);
app.use('/api/dashboard', dashboardRoute);

// ─── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ────────────────────────────
app.use(errorHandler);

module.exports = app;
