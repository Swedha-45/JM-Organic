// pages/ReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { productAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// ============================================================
// COMPONENT
// ============================================================

const ReviewsPage = () => {
  // ✅ Use the same auth properties as ProfilePage
  const { user: currentUser, isAuthenticated: userLoggedIn, loading: authLoading } = useAuth();

  // ==========================================================
  // STATES
  // ==========================================================

  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState(null);

  // Review form
  const [newAuthor, setNewAuthor] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newLocation, setNewLocation] = useState('Coimbatore');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================================
  // API BASE URL
  // ==========================================================

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // ==========================================================
  // DEBUG: Log currentUser data
  // ==========================================================

  useEffect(() => {
    console.log('=== Auth Debug ===');
    console.log('userLoggedIn:', userLoggedIn);
    console.log('currentUser:', currentUser);
    console.log('currentUser?.displayName:', currentUser?.displayName);
    console.log('currentUser?.name:', currentUser?.name);
    console.log('currentUser?.firstName:', currentUser?.firstName);
    console.log('currentUser?.lastName:', currentUser?.lastName);
    console.log('currentUser?.email:', currentUser?.email);
  }, [currentUser, userLoggedIn]);

  // ==========================================================
  // AUTO-FILL USER DATA
  // ==========================================================

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('Auth is loading...');
      return;
    }

    console.log('Auth loaded. userLoggedIn:', userLoggedIn);
    console.log('currentUser:', currentUser);

    if (currentUser) {
      console.log('Attempting to auto-fill name...');
      
      // Try multiple possible name fields
      let userName = '';
      
      if (currentUser.displayName) {
        userName = currentUser.displayName;
      } else if (currentUser.name) {
        userName = currentUser.name;
      } else if (currentUser.fullName) {
        userName = currentUser.fullName;
      } else if (currentUser.firstName && currentUser.lastName) {
        userName = `${currentUser.firstName} ${currentUser.lastName}`;
      } else if (currentUser.firstName) {
        userName = currentUser.firstName;
      } else if (currentUser.email) {
        // Fallback: use email username
        userName = currentUser.email.split('@')[0];
      }
      
      console.log('Auto-filled name:', userName);
      
      if (userName) {
        setNewAuthor(userName);
      } else {
        // If no name found, try to get from localStorage
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.name) {
              setNewAuthor(parsedUser.name);
            } else if (parsedUser.firstName && parsedUser.lastName) {
              setNewAuthor(`${parsedUser.firstName} ${parsedUser.lastName}`);
            } else if (parsedUser.firstName) {
              setNewAuthor(parsedUser.firstName);
            }
          }
        } catch (e) {
          console.log('No user in localStorage');
        }
      }

      // Auto-fill location
      let location = '';
      if (currentUser.location) {
        location = currentUser.location;
      } else if (currentUser.city) {
        location = currentUser.city;
      } else if (currentUser.address?.city) {
        location = currentUser.address.city;
      }
      
      console.log('Auto-filled location:', location);
      
      if (location) {
        setNewLocation(location);
      }
    } else {
      console.log('No currentUser found');
    }
  }, [currentUser, userLoggedIn, authLoading]);

  // ==========================================================
  // FETCH REVIEWS FROM BACKEND
  // ==========================================================

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/reviews`);
      const data = await response.json();
      
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      } else {
        setReviews(getFallbackReviews());
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews(getFallbackReviews());
      setError('Could not load reviews from server. Using sample reviews.');
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // ==========================================================
  // FALLBACK REVIEWS
  // ==========================================================

  const getFallbackReviews = () => {
    return [
      {
        id: 'rev-1',
        author: 'Kavitha Ramasamy',
        location: 'Coimbatore, Tamil Nadu',
        rating: 5,
        date: 'Aug 08, 2026',
        productName: '100% Cold-Pressed Coconut Oil (Wood-Pressed)',
        title: 'Authentic Marachekku Coconut Oil smell!',
        comment: 'The aroma when opening the bottle is incredible — pure coconut aroma just like my grandmother used to make. Perfect for cooking and my hair care routine.',
        verified: true,
        likes: 42,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'rev-2',
        author: 'Siddharth V.',
        location: 'Chennai, Tamil Nadu',
        rating: 5,
        date: 'Jul 28, 2026',
        productName: 'Fresh Tender Coconuts (Farm Direct Batch)',
        title: 'Super sweet water and fresh malai!',
        comment: 'Ordered 10 fresh coconuts for our family. Every single one was full of sweet water.',
        verified: true,
        likes: 29,
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80'
      },
      {
        id: 'rev-3',
        author: 'Deepa Sundaram',
        location: 'Madurai, Tamil Nadu',
        rating: 5,
        date: 'Jul 15, 2026',
        productName: 'Organic Cold-Pressed Groundnut Oil (Kadalai Ennai)',
        title: 'Zero chemicals, true farm taste!',
        comment: 'We switched from store bought refined oils to JM Organic Kadalai Ennai. Sambar and poriyal taste so much richer now!',
        verified: true,
        likes: 18,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80'
      },
      {
        id: 'rev-4',
        author: 'Anand Kumar',
        location: 'Bangalore, Karnataka',
        rating: 4,
        date: 'Jul 02, 2026',
        productName: 'Commercial Bulk Coconut Oil Drum (25L)',
        title: 'Excellent quality for our bakery unit',
        comment: 'Purchased 25L drum for our bakery in Bangalore. Very clean oil, no sediment, sturdy packaging drum.',
        verified: true,
        likes: 11,
        image: null
      }
    ];
  };

  // ==========================================================
  // LOAD PRODUCTS & REVIEWS
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoadingProducts(true);

      try {
        const productResponse = await productAPI.getAll({ status: 'active' });
        
        if (productResponse.success && productResponse.products) {
          const products = productResponse.products;
          if (isMounted) {
            setProductList(Array.isArray(products) ? products : []);
            if (products.length > 0) {
              setNewProduct(products[0].name || '');
            }
          }
        } else {
          const fallbackProducts = [
            { _id: '1', name: '100% Cold-Pressed Coconut Oil (Wood-Pressed)' },
            { _id: '2', name: 'Fresh Tender Coconuts (Farm Direct Batch)' },
            { _id: '3', name: 'Organic Cold-Pressed Groundnut Oil' },
            { _id: '4', name: 'Commercial Bulk Coconut Oil Drum (25L)' }
          ];
          if (isMounted) {
            setProductList(fallbackProducts);
            setNewProduct(fallbackProducts[0].name);
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
        const fallbackProducts = [
          { _id: '1', name: '100% Cold-Pressed Coconut Oil (Wood-Pressed)' },
          { _id: '2', name: 'Fresh Tender Coconuts (Farm Direct Batch)' },
          { _id: '3', name: 'Organic Cold-Pressed Groundnut Oil' },
          { _id: '4', name: 'Commercial Bulk Coconut Oil Drum (25L)' }
        ];
        if (isMounted) {
          setProductList(fallbackProducts);
          setNewProduct(fallbackProducts[0].name);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchData();
    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================================
  // SUBMIT REVIEW TO BACKEND
  // ==========================================================

  const submitReviewToBackend = async (reviewData) => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  // ==========================================================
  // ADD REVIEW
  // ==========================================================

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!newAuthor.trim() || !newTitle.trim() || !newComment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        author: newAuthor.trim(),
        location: newLocation || 'Coimbatore',
        rating: Number(newRating),
        productName: newProduct || 'Organic Product',
        title: newTitle.trim(),
        comment: newComment.trim(),
        verified: true,
        image: null
      };

      const result = await submitReviewToBackend(reviewData);
      
      if (result.success) {
        await fetchReviews();
        setShowModal(false);
        setNewAuthor('');
        setNewTitle('');
        setNewComment('');
        setNewRating(5);
      } else {
        const created = {
          id: `rev-${Date.now()}`,
          ...reviewData,
          date: 'Just now',
          likes: 0
        };
        setReviews([created, ...reviews]);
        setShowModal(false);
        setNewAuthor('');
        setNewTitle('');
        setNewComment('');
        setNewRating(5);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      const created = {
        id: `rev-${Date.now()}`,
        author: newAuthor.trim(),
        location: newLocation || 'Coimbatore',
        rating: Number(newRating),
        date: 'Just now',
        productName: newProduct || 'Organic Product',
        title: newTitle.trim(),
        comment: newComment.trim(),
        verified: true,
        likes: 0,
        image: null
      };
      setReviews([created, ...reviews]);
      setShowModal(false);
      setNewAuthor('');
      setNewTitle('');
      setNewComment('');
      setNewRating(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================
  // LIKE REVIEW
  // ==========================================================

  const handleLike = async (id) => {
    setReviews((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.map((review) => {
        if (review.id !== id && review._id !== id) return review;
        return { ...review, likes: Number(review.likes || 0) + 1 };
      });
    });

    try {
      await fetch(`${API_URL}/reviews/${id}/like`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  // ==========================================================
  // FILTER REVIEWS
  // ==========================================================

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const filteredReviews = safeReviews.filter((review) => {
    if (!review || typeof review !== 'object') return false;
    if (filterRating === '5') return Number(review.rating) === 5;
    if (filterRating === '4') return Number(review.rating) === 4;
    return true;
  });

  // ==========================================================
  // SAFE PRODUCT LIST
  // ==========================================================

  const safeProductList = Array.isArray(productList) ? productList : [];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#F3F7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block">
              Customer Reviews
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-950 mt-2">
              Verified Farm Reviews & Ratings
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              Read real feedback from over 12,000+ families across South India.
            </p>
            {error && (
              <p className="text-xs text-amber-600 mt-2">{error}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-md hover:bg-emerald-950 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* ====================================================
            RATING OVERVIEW
        ==================================================== */}

        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="text-center md:text-left md:border-r border-gray-200 md:pr-8">
              <div className="text-5xl font-black text-emerald-900">4.9</div>
              <div className="flex justify-center md:justify-start text-amber-400 my-2">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs font-bold text-gray-500">
                Based on {safeReviews.length}+ verified orders
              </div>
            </div>

            <div className="space-y-2">
              {[
                { stars: 5, percent: 92 },
                { stars: 4, percent: 6 },
                { stars: 3, percent: 2 }
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs font-bold">
                  <span className="w-12 text-emerald-800">{item.stars} stars</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="w-10 text-right text-gray-500">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================
            FILTER BUTTONS
        ==================================================== */}

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setFilterRating('all')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === 'all'
                ? 'bg-emerald-900 text-white'
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Reviews ({safeReviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRating('5')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === '5'
                ? 'bg-emerald-900 text-white'
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ★ 5 stars
          </button>
          <button
            type="button"
            onClick={() => setFilterRating('4')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === '4'
                ? 'bg-emerald-900 text-white'
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ★ 4 stars
          </button>
        </div>

        {/* ====================================================
            REVIEWS LIST
        ==================================================== */}

        <div className="space-y-6">
          {isLoadingReviews ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
              <Star className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <h3 className="font-extrabold text-emerald-900">No reviews yet</h3>
              <p className="text-sm text-gray-500 mt-1">Be the first to write a review!</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-emerald-900 text-white px-6 py-2 rounded-full text-xs font-extrabold hover:bg-emerald-950 transition"
              >
                Write a Review
              </button>
            </div>
          ) : (
            filteredReviews.map((review, index) => {
              const rev = review || {};
              const rating = Math.min(5, Math.max(0, Number(rev.rating) || 0));
              const reviewId = rev.id || rev._id || `review-${index}`;

              return (
                <div key={reviewId} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                  {/* Reviewer Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        {(rev.author || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-emerald-900">{rev.author}</span>
                          {rev.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{rev.location} • {rev.date}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star key={starIndex} className={`w-4 h-4 ${starIndex < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Product */}
                  <div className="mt-4">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Product: {rev.productName}
                    </span>
                  </div>

                  {/* Review Title */}
                  <h3 className="text-base font-extrabold text-emerald-900 mt-3">{rev.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">{rev.comment}</p>

                  {/* Image */}
                  {rev.image && (
                    <div className="mt-4">
                      <img
                        src={rev.image}
                        alt="Customer review"
                        loading="lazy"
                        className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
                        onError={(event) => { event.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Like */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleLike(reviewId)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 rounded-full transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({Number(rev.likes || 0)})</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ====================================================
            WRITE REVIEW MODAL
        ==================================================== */}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-display font-extrabold text-emerald-950">
                Write a Review
              </h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Share your experience with our products.
              </p>

              <form onSubmit={handleAddReview} className="space-y-4">
                {/* Name - Auto-filled */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder={authLoading ? "Loading your profile..." : (userLoggedIn ? "Auto-filled from your account" : "Enter your name")}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={authLoading || (!!userLoggedIn && !!newAuthor)}
                  />
                  {authLoading && (
                    <p className="text-xs text-gray-400 mt-1 pl-2">
                      <Loader2 className="w-3 h-3 inline animate-spin mr-1" />
                      Loading profile...
                    </p>
                  )}
                  {!authLoading && userLoggedIn && newAuthor && (
                    <p className="text-xs text-green-600 mt-1 pl-2">
                      ✓ Auto-filled: {newAuthor}
                    </p>
                  )}
                  {!authLoading && userLoggedIn && !newAuthor && (
                    <p className="text-xs text-amber-600 mt-1 pl-2">
                      ⚠️ No name found. Please enter manually.
                    </p>
                  )}
                </div>

                {/* Product */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    Select Product *
                  </label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {isLoadingProducts ? (
                      <option value="">Loading products...</option>
                    ) : safeProductList.length > 0 ? (
                      safeProductList.map((product, index) => {
                        const productName = product?.name || product?.title || product?.productName || 'Unnamed Product';
                        return (
                          <option key={product._id || product.id || index} value={productName}>
                            {productName}
                          </option>
                        );
                      })
                    ) : (
                      <option value="100% Cold-Pressed Coconut Oil (Wood-Pressed)">
                        100% Cold-Pressed Coconut Oil (Wood-Pressed)
                      </option>
                    )}
                  </select>
                </div>

                {/* Location - Auto-filled */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    Your Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder={authLoading ? "Loading..." : "City, State"}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={authLoading}
                  />
                </div>

                {/* Rating */}
                <div>
                  <span className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    Star Rating *
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star className={`w-8 h-8 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Give your review a title"
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    Detailed Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full bg-gray-50 px-4 py-3 rounded-2xl text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-900 hover:bg-emerald-950 text-white py-3.5 rounded-full font-extrabold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewsPage;