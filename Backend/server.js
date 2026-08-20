const express = require('express');
const mongoose = require('mongoose'); // ✅ Add this!
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedRoutes = require('./routes/seedRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Disable powered-by header & enable strong ETags for instant 304 cache validation
app.disable('x-powered-by');
app.set('etag', 'strong');

// Enable Gzip Compression for low payload sizes and faster data transfer latency
app.use(compression());

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Keep-Alive", "timeout=65");
  if (req.method === 'GET' && req.path.startsWith('/api/products')) {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  }
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'JM Organic API is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Base: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  });

  // ✅ Admin user check
  try {
    const User = require('./models/user');
    const admin = await User.findOne({ email: 'admin@jmorganic.in' });
    if (admin) {
      console.log('✅ Admin user found in MongoDB:', admin.email);
    } else {
      console.log('⚠️ Admin user not found');
    }
  } catch (error) {
    console.error('❌ Error checking admin:', error.message);
  }
}).catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});