// src/services/productService.js
import { productAPI } from './api';

// In-memory cache for products
let cachedProducts = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60000; // 60 seconds

export const clearProductsCache = () => {
  cachedProducts = null;
  lastCacheTime = 0;
};

// ✅ Get all products
export const getProducts = async (params = {}) => {
  const isDefaultQuery = Object.keys(params).length === 0 || (!params.search && !params.category && !params.featured);
  const now = Date.now();

  if (isDefaultQuery && cachedProducts && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedProducts;
  }

  try {
    const response = await productAPI.getAll(params);
    const productsList = response.products || [];
    
    if (isDefaultQuery) {
      cachedProducts = productsList;
      lastCacheTime = now;
    }

    return productsList;
  } catch (error) {
    console.error('Error fetching products:', error);
    return cachedProducts || [];
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
  try {
    const response = await productAPI.getAll({ featured: true });
    return response.products || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// ✅ Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await productAPI.getById(id);
    return response.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
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