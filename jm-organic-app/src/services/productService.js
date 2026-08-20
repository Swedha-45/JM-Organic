// src/services/productService.js
import { productAPI } from './api';

// In-memory cache for products & queries
const queryCache = new Map();
const singleProductCache = new Map();
const CACHE_TTL_MS = 60000; // 60 seconds

export const clearProductsCache = () => {
  queryCache.clear();
  singleProductCache.clear();
};

// ✅ Get all products
export const getProducts = async (params = {}) => {
  const cacheKey = JSON.stringify(params);
  const now = Date.now();

  if (queryCache.has(cacheKey)) {
    const entry = queryCache.get(cacheKey);
    if (now - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
  }

  try {
    const response = await productAPI.getAll(params);
    const productsList = response.products || [];
    
    queryCache.set(cacheKey, { timestamp: now, data: productsList });

    // Pre-populate singleProductCache
    productsList.forEach(p => {
      const pid = p.id || p._id;
      if (pid) {
        singleProductCache.set(pid.toString(), { timestamp: now, data: p });
      }
    });

    return productsList;
  } catch (error) {
    console.error('Error fetching products:', error);
    return queryCache.has(cacheKey) ? queryCache.get(cacheKey).data : [];
  }
};

// ✅ Get all products (async - alias for getProducts)
export const getAllProductsAsync = async (params = {}) => {
  return getProducts(params);
};

// ✅ Get all products (alias for backward compatibility)
export const getAllProducts = async (params = {}) => {
  return getProducts(params);
};

// ✅ Get featured products
export const getFeaturedProducts = async () => {
  return getProducts({ featured: true });
};

// ✅ Get product by ID
export const getProductById = async (id) => {
  if (!id) return null;
  const productIdStr = id.toString();
  const now = Date.now();

  if (singleProductCache.has(productIdStr)) {
    const entry = singleProductCache.get(productIdStr);
    if (now - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
  }

  try {
    const response = await productAPI.getById(id);
    const product = response.product || null;
    if (product) {
      singleProductCache.set(productIdStr, { timestamp: now, data: product });
    }
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return singleProductCache.has(productIdStr) ? singleProductCache.get(productIdStr).data : null;
  }
};

// ✅ Get product by ID (async - alias)
export const getProductByIdAsync = async (id) => {
  return getProductById(id);
};

// ✅ Search products
export const searchProducts = async (query) => {
  try {
    const response = await productAPI.getAll({ search: query });
    return response.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// ✅ Get active products (in stock)
export const getActiveProducts = async () => {
  try {
    const products = await getProducts();
    return products.filter(p => p.stock > 0);
  } catch (error) {
    console.error('Error fetching active products:', error);
    return [];
  }
};

// ✅ Add product (Admin)
export const addProduct = async (productData) => {
  try {
    clearProductsCache();
    const response = await productAPI.create(productData);
    return response.product || null;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// ✅ Update product (Admin)
export const updateProduct = async (id, productData) => {
  try {
    clearProductsCache();
    const response = await productAPI.update(id, productData);
    return response.product || null;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// ✅ Delete product (Admin)
export const deleteProduct = async (id) => {
  try {
    clearProductsCache();
    await productAPI.delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ✅ Reduce stock (when order is placed)
export const reduceStock = async (items) => {
  try {
    // For each item, update stock
    for (const item of items) {
      const product = await getProductById(item.productId || item._id);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await updateProduct(item.productId || item._id, { stock: newStock });
      }
    }
    return true;
  } catch (error) {
    console.error('Error reducing stock:', error);
    throw error;
  }
};

// ✅ Update product stock
export const updateStock = async (productId, quantity) => {
  try {
    const product = await getProductById(productId);
    if (product) {
      const newStock = Math.max(0, product.stock - quantity);
      await updateProduct(productId, { stock: newStock });
    }
    return true;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

// ✅ Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const products = await getProducts();
    return products.filter(p => p.category === category);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

// ✅ Search products by name
export const searchProductsByName = async (name) => {
  return searchProducts(name);
};

// ✅ Get product count
export const getProductCount = async () => {
  try {
    const products = await getProducts();
    return products.length;
  } catch (error) {
    console.error('Error getting product count:', error);
    return 0;
  }
};

// ✅ Get low stock products (for admin)
export const getLowStockProducts = async (threshold = 10) => {
  try {
    const products = await getProducts();
    return products.filter(p => p.stock < threshold);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
};