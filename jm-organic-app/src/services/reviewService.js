// services/reviewService.js
//
// Reviews are submitted by customers (status: 'pending'), then an admin
// approves or rejects them. An approved review can additionally be
// "featured" — that's what makes it eligible to show in the Home page
// Testimonials section. Approved-but-not-featured reviews are meant to
// show on the product's own page once that's wired in.

const STORAGE_KEY = 'jm_reviews';

const SEED_REVIEWS = [
  {
    id: 'r1',
    productId: 'p1',
    productName: 'Cold Pressed Coconut Oil 5L',
    customerName: 'Priya Subramaniam',
    role: 'Home Chef, Chennai',
    rating: 5,
    quote:
      'Switched to JM cold-pressed coconut oil 6 months ago. My cholesterol dropped 12 points and the food tastes so much better. The 5L bottle lasts my family 3 months.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'approved',
    featuredOnHome: true,
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'r2',
    productId: 'p5',
    productName: 'Bulk Coconut Oil 50L',
    customerName: 'Karthik Rajan',
    role: 'Restaurant Owner, Coimbatore',
    rating: 5,
    quote:
      'We order 50L of coconut oil every month for our restaurant. JM gives us GST invoices, same-day delivery in Coimbatore, and the quality is absolutely consistent.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'approved',
    featuredOnHome: true,
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'r3',
    productId: 'p4',
    productName: 'Raw Organic Groundnuts',
    customerName: 'Meenakshi Devi',
    role: 'Nutritionist, Madurai',
    rating: 5,
    quote:
      'I recommend JM Organic groundnuts to all my clients who need high-protein snacks. The nutrition data on their dashboard matches our lab tests exactly.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'approved',
    featuredOnHome: true,
    createdAt: '2026-06-15T10:00:00.000Z',
  },
];

function readAll() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return SEED_REVIEWS;
  }
}

function writeAll(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// Called from a product page's "Write a Review" form.
export function submitReview({ productId, productName, customerName, rating, quote, avatar }) {
  const reviews = readAll();
  const newReview = {
    id: `r${Date.now()}`,
    productId,
    productName,
    customerName,
    role: 'Verified Buyer',
    rating,
    quote,
    avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}`,
    status: 'pending',
    featuredOnHome: false,
    createdAt: new Date().toISOString(),
  };
  writeAll([newReview, ...reviews]);
  return newReview;
}

export function getAllReviews() {
  return readAll();
}

export function getPendingReviews() {
  return readAll().filter((r) => r.status === 'pending');
}

export function getApprovedReviewsForProduct(productId) {
  return readAll().filter(
    (r) => r.status === 'approved' && r.productId === productId
  );
}

// Used by Home page Testimonials — only approved + explicitly featured reviews.
export function getFeaturedReviews(limit = 3) {
  return readAll()
    .filter((r) => r.status === 'approved' && r.featuredOnHome)
    .slice(0, limit);
}

export function approveReview(id, featureOnHome = false) {
  const reviews = readAll().map((r) =>
    r.id === id ? { ...r, status: 'approved', featuredOnHome: featureOnHome } : r
  );
  writeAll(reviews);
}

export function rejectReview(id) {
  const reviews = readAll().map((r) =>
    r.id === id ? { ...r, status: 'rejected' } : r
  );
  writeAll(reviews);
}

export function toggleFeature(id) {
  const reviews = readAll().map((r) =>
    r.id === id ? { ...r, featuredOnHome: !r.featuredOnHome } : r
  );
  writeAll(reviews);
}

export function deleteReview(id) {
  writeAll(readAll().filter((r) => r.id !== id));
}