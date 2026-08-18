// src/utils/imageUtils.js

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80';

export const FALLBACK_SVG_DATA_URL = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23e2e8f0"/><path d="M150 100 C120 70, 80 100, 150 180 C220 100, 180 70, 150 100 Z" fill="%2315803d"/><text x="50%" y="75%" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23334155" text-anchor="middle">JM Organic</text></svg>';

/**
 * Returns a valid product image URL or default placeholder
 * @param {string} image 
 * @returns {string}
 */
export const getProductImage = (image) => {
  if (!image || typeof image !== 'string') {
    return DEFAULT_PRODUCT_IMAGE;
  }
  
  const trimmed = image.trim();
  
  if (
    !trimmed ||
    trimmed === 'default-product.jpg' ||
    trimmed.startsWith('default-') ||
    trimmed === 'undefined' ||
    trimmed === 'null'
  ) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  // Handle broken base64 strings if too short
  if (trimmed.startsWith('data:image') && trimmed.length < 50) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  return trimmed;
};

/**
 * Image onError event handler
 * @param {Event} e 
 */
export const handleImageError = (e) => {
  if (!e || !e.target) return;

  if (e.target.src === FALLBACK_SVG_DATA_URL) {
    return;
  }

  if (e.target.src === DEFAULT_PRODUCT_IMAGE || e.target.src.includes('unsplash.com')) {
    e.target.src = FALLBACK_SVG_DATA_URL;
  } else {
    e.target.src = DEFAULT_PRODUCT_IMAGE;
  }
};
