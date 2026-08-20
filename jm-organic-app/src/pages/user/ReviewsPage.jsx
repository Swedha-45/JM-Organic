// pages/ReviewsPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { useTranslation } from 'react-i18next';

// ============================================================
// INITIAL REVIEWS
// ============================================================

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Kavitha Ramasamy',
    authorTa: 'கவிதா ராமசாமி',
    location: 'Coimbatore, Tamil Nadu',
    locationTa: 'கோயம்புத்தூர், தமிழ்நாடு',
    rating: 5,
    date: 'Aug 08, 2026',
    dateTa: 'ஆகஸ்ட் 08, 2026',
    productName: '100% Cold-Pressed Coconut Oil (Wood-Pressed)',
    productNameTa: '100% மரச்செக்கு தேங்காய் எண்ணெய்',
    title: 'Authentic Marachekku Coconut Oil smell!',
    titleTa: 'உண்மையான மரச்செக்கு தேங்காய் எண்ணெய் வாசனை!',
    comment:
      'The aroma when opening the bottle is incredible — pure coconut aroma just like my grandmother used to make. Perfect for cooking and my hair care routine. Fast delivery to Coimbatore.',
    commentTa:
      'பாட்டில் திறக்கும் போது வாசனை நம்பமுடியாதது - என் பாட்டி செய்தது போல தூய தேங்காய் வாசனை. சமையல் மற்றும் என் முடி பராமரிப்பு வழக்கத்திற்கு ஏற்றது. கோயம்புத்தூருக்கு விரைவான டெலிவரி.',
    verified: true,
    likes: 42,
    image:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'
  },

  {
    id: 'rev-2',
    author: 'Siddharth V.',
    authorTa: 'சித்தார்த் வி.',
    location: 'Chennai, Tamil Nadu',
    locationTa: 'சென்னை, தமிழ்நாடு',
    rating: 5,
    date: 'Jul 28, 2026',
    dateTa: 'ஜூலை 28, 2026',
    productName: 'Fresh Tender Coconuts (Farm Direct Batch)',
    productNameTa: 'புதிய இளநீர் தேங்காய்கள் (பண்ணை நேரடி தொகுதி)',
    title: 'Super sweet water and fresh malai!',
    titleTa: 'இனிப்பான தண்ணீர் மற்றும் புதிய மலாய்!',
    comment:
      'Ordered 10 fresh coconuts for our family. Every single one was full of sweet water. You can really tell they were harvested directly from Pollachi farms.',
    commentTa:
      'எங்கள் குடும்பத்திற்கு 10 புதிய தேங்காய்களை ஆர்டர் செய்தோம். ஒவ்வொன்றும் இனிப்பான தண்ணீரால் நிரம்பியிருந்தது. அவை பொள்ளாச்சி பண்ணைகளில் இருந்து நேரடியாக அறுவடை செய்யப்பட்டவை என்பதை உண்மையில் சொல்ல முடியும்.',
    verified: true,
    likes: 29,
    image:
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80'
  },

  {
    id: 'rev-3',
    author: 'Deepa Sundaram',
    authorTa: 'தீபா சுந்தரம்',
    location: 'Madurai, Tamil Nadu',
    locationTa: 'மதுரை, தமிழ்நாடு',
    rating: 5,
    date: 'Jul 15, 2026',
    dateTa: 'ஜூலை 15, 2026',
    productName: 'Organic Cold-Pressed Groundnut Oil (Kadalai Ennai)',
    productNameTa: 'இயற்கை மரச்செக்கு கடலை எண்ணெய்',
    title: 'Zero chemicals, true farm taste!',
    titleTa: 'பூஜ்ஜிய இரசாயனங்கள், உண்மையான பண்ணை சுவை!',
    comment:
      'We switched from store bought refined oils to JM Organic Kadalai Ennai. Sambar and poriyal taste so much richer now!',
    commentTa:
      'கடையில் வாங்கிய சுத்திகரிக்கப்பட்ட எண்ணெய்களில் இருந்து JM Organic கடலை எண்ணெய்க்கு மாறினோம். இப்போது சாம்பார் மற்றும் பொரியல் மிகவும் சுவையாக உள்ளது!',
    verified: true,
    likes: 18,
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80'
  },

  {
    id: 'rev-4',
    author: 'Anand Kumar',
    authorTa: 'ஆனந்த் குமார்',
    location: 'Bangalore, Karnataka',
    locationTa: 'பெங்களூர், கர்நாடகா',
    rating: 4,
    date: 'Jul 02, 2026',
    dateTa: 'ஜூலை 02, 2026',
    productName: 'Commercial Bulk Coconut Oil Drum (25L)',
    productNameTa: 'வணிக மொத்த தேங்காய் எண்ணெய் டிரம் (25L)',
    title: 'Excellent quality for our bakery unit',
    titleTa: 'எங்கள் பேக்கரி அலகுக்கு சிறந்த தரம்',
    comment:
      'Purchased 25L drum for our bakery in Bangalore. Very clean oil, no sediment, sturdy packaging drum.',
    commentTa:
      'எங்கள் பெங்களூர் பேக்கரிக்கு 25L டிரம் வாங்கினோம். மிகவும் சுத்தமான எண்ணெய், வண்டல் இல்லை, உறுதியான பேக்கேஜிங் டிரம்.',
    verified: true,
    likes: 11,
    image: null
  }
];

// ============================================================
// COMPONENT
// ============================================================

const ReviewsPage = () => {
  const { t, i18n } = useTranslation();

  const isTamil =
    i18n.language === 'ta' ||
    i18n.language?.startsWith('ta-');

  // ==========================================================
  // STATES
  // ==========================================================

  const [reviews, setReviews] = useState(
    Array.isArray(INITIAL_REVIEWS) ? INITIAL_REVIEWS : []
  );

  const [filterRating, setFilterRating] = useState('all');

  const [showModal, setShowModal] = useState(false);

  const [productList, setProductList] = useState([]);

  // Review form
  const [newAuthor, setNewAuthor] = useState('');

  const [newProduct, setNewProduct] = useState(
    '100% Cold-Pressed Coconut Oil (Wood-Pressed)'
  );

  const [newRating, setNewRating] = useState(5);

  const [newTitle, setNewTitle] = useState('');

  const [newComment, setNewComment] = useState('');

  const [newLocation, setNewLocation] = useState('Coimbatore');

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoadingProducts(true);

      try {
        const response = await getProducts();

        console.log('getProducts response:', response);

        /*
          Handle different API response formats:

          1. [
               { name: "Coconut Oil" }
             ]

          2. {
               products: [
                 { name: "Coconut Oil" }
               ]
             }

          3. {
               data: [
                 { name: "Coconut Oil" }
               ]
             }

          4. {
               data: {
                 products: [...]
               }
             }
        */

        let products = [];

        if (Array.isArray(response)) {
          products = response;
        } else if (Array.isArray(response?.products)) {
          products = response.products;
        } else if (Array.isArray(response?.data)) {
          products = response.data;
        } else if (Array.isArray(response?.data?.products)) {
          products = response.data.products;
        }

        // Make absolutely sure state is always an array
        if (isMounted) {
          setProductList(
            Array.isArray(products) ? products : []
          );
        }
      } catch (error) {
        console.error(
          'Error loading products for review form:',
          error
        );

        if (isMounted) {
          setProductList([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================================
  // TRANSLATED REVIEW
  // ==========================================================

  const getTranslatedReview = (review) => {
    if (!review || typeof review !== 'object') {
      return {
        displayAuthor: '',
        displayLocation: '',
        displayDate: '',
        displayProduct: '',
        displayTitle: '',
        displayComment: ''
      };
    }

    return {
      ...review,

      displayAuthor: isTamil
        ? review.authorTa || review.author || ''
        : review.author || '',

      displayLocation: isTamil
        ? review.locationTa || review.location || ''
        : review.location || '',

      displayDate: isTamil
        ? review.dateTa || review.date || ''
        : review.date || '',

      displayProduct: isTamil
        ? review.productNameTa || review.productName || ''
        : review.productName || '',

      displayTitle: isTamil
        ? review.titleTa || review.title || ''
        : review.title || '',

      displayComment: isTamil
        ? review.commentTa || review.comment || ''
        : review.comment || ''
    };
  };

  // ==========================================================
  // LIKE REVIEW
  // ==========================================================

  const handleLike = (id) => {
    setReviews((previousReviews) => {
      if (!Array.isArray(previousReviews)) {
        return [];
      }

      return previousReviews.map((review) => {
        if (review.id !== id) {
          return review;
        }

        return {
          ...review,
          likes: Number(review.likes || 0) + 1
        };
      });
    });
  };

  // ==========================================================
  // ADD REVIEW
  // ==========================================================

  const handleAddReview = (e) => {
    e.preventDefault();

    if (
      !newAuthor.trim() ||
      !newTitle.trim() ||
      !newComment.trim()
    ) {
      return;
    }

    const created = {
      id: `rev-${Date.now()}`,

      author: newAuthor.trim(),
      authorTa: newAuthor.trim(),

      location: newLocation,
      locationTa: newLocation,

      rating: Number(newRating),

      date: 'Just now',
      dateTa: 'இப்போதுதான்',

      productName: newProduct,
      productNameTa: newProduct,

      title: newTitle.trim(),
      titleTa: newTitle.trim(),

      comment: newComment.trim(),
      commentTa: newComment.trim(),

      verified: true,

      likes: 0,

      image: null
    };

    setReviews((previousReviews) => {
      const safeReviews = Array.isArray(previousReviews)
        ? previousReviews
        : [];

      return [created, ...safeReviews];
    });

    setShowModal(false);

    // ========================================================
    // LOCAL STORAGE
    // ========================================================

    try {
      const storedReviews = localStorage.getItem(
        'jm_user_reviews'
      );

      const userReviews = JSON.parse(
        storedReviews || '[]'
      );

      const safeUserReviews = Array.isArray(userReviews)
        ? userReviews
        : [];

      localStorage.setItem(
        'jm_user_reviews',
        JSON.stringify([
          created,
          ...safeUserReviews
        ])
      );
    } catch (error) {
      console.warn(
        'Could not save review to localStorage:',
        error
      );
    }

    // ========================================================
    // BACKEND REVIEW SUBMISSION
    // ========================================================

    try {
      // Dynamic import/require retained for compatibility
      // with your existing project structure.
      const reviewService = require(
        '../../services/reviewService'
      );

      if (
        reviewService &&
        typeof reviewService.submitReview === 'function'
      ) {
        reviewService.submitReview({
          productId: 'p1',
          productName: newProduct,
          customerName: newAuthor.trim(),
          rating: Number(newRating),
          quote: `${newTitle.trim()} - ${newComment.trim()}`
        });
      }
    } catch (error) {
      console.warn(
        'Backend review submission skipped:',
        error
      );
    }

    // ========================================================
    // LIVE EVENT
    // ========================================================

    window.dispatchEvent(
      new Event('reviewSubmitted')
    );

    // ========================================================
    // RESET FORM
    // ========================================================

    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
    setNewRating(5);
  };

  // ==========================================================
  // FILTER REVIEWS
  // ==========================================================

  const safeReviews = Array.isArray(reviews)
    ? reviews
    : [];

  const filteredReviews = safeReviews.filter((review) => {
    if (!review || typeof review !== 'object') {
      return false;
    }

    if (filterRating === '5') {
      return Number(review.rating) === 5;
    }

    if (filterRating === '4') {
      return Number(review.rating) === 4;
    }

    return true;
  });

  // ==========================================================
  // SAFE PRODUCT LIST
  // ==========================================================

  const safeProductList = Array.isArray(productList)
    ? productList
    : [];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#F3F7F2] py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">

      <div className="container mx-auto max-w-5xl">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">

          <div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block">
              {t(
                'customerReviews',
                'Customer Reviews'
              )}
            </span>

            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-950 mt-2">
              {t(
                'reviewsPageTitle',
                'Verified Farm Reviews & Ratings'
              )}
            </h1>

            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              {t(
                'reviewsPageSubtitle',
                'Read real feedback from over 12,000+ families across South India who trust JM Organic for pure cold-pressed oils.'
              )}
            </p>

          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-md hover:bg-emerald-950 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />

            <span>
              {t(
                'writeAReview',
                'Write a Review'
              )}
            </span>
          </button>

        </div>

        {/* ====================================================
            RATING OVERVIEW
        ==================================================== */}

        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

            {/* Score */}

            <div className="text-center md:text-left md:border-r border-gray-200 md:pr-8">

              <div className="text-5xl font-black text-emerald-900">
                4.9
              </div>

              <div className="flex justify-center md:justify-start text-amber-400 my-2">

                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}

              </div>

              <div className="text-xs font-bold text-gray-500">
                {t('basedOn', 'Based on')} 1,420+{' '}
                {t(
                  'verifiedOrders',
                  'verified orders'
                )}
              </div>

            </div>

            {/* Breakdown */}

            <div className="space-y-2">

              {/* 5 Stars */}

              <div className="flex items-center gap-3 text-xs font-bold">

                <span className="w-12 text-emerald-800">
                  5 {t('stars', 'stars')}
                </span>

                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div className="h-full bg-emerald-700 rounded-full w-[92%]" />

                </div>

                <span className="w-10 text-right text-gray-500">
                  92%
                </span>

              </div>

              {/* 4 Stars */}

              <div className="flex items-center gap-3 text-xs font-bold">

                <span className="w-12 text-emerald-800">
                  4 {t('stars', 'stars')}
                </span>

                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div className="h-full bg-emerald-700 rounded-full w-[6%]" />

                </div>

                <span className="w-10 text-right text-gray-500">
                  6%
                </span>

              </div>

              {/* 3 Stars */}

              <div className="flex items-center gap-3 text-xs font-bold">

                <span className="w-12 text-emerald-800">
                  3 {t('stars', 'stars')}
                </span>

                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div className="h-full bg-emerald-700 rounded-full w-[2%]" />

                </div>

                <span className="w-10 text-right text-gray-500">
                  2%
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            FILTER BUTTONS
        ==================================================== */}

        <div className="flex flex-wrap gap-2 mb-6">

          {/* All */}

          <button
            type="button"
            onClick={() => setFilterRating('all')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === 'all'
                ? 'bg-emerald-900 text-white'
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('allReviews', 'All Reviews')} (
            {safeReviews.length}
            )
          </button>

          {/* 5 Star */}

          <button
            type="button"
            onClick={() => setFilterRating('5')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === '5'
                ? 'bg-emerald-900 text-white'
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ★ 5 {t('stars', 'stars')}
          </button>

          {/* 4 Star */}

          <button
            type="button"
            onClick={() => setFilterRating('4')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === '4'
                ? 'bg-emerald-900 text-white'
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ★ 4 {t('stars', 'stars')}
          </button>

        </div>

        {/* ====================================================
            REVIEWS LIST
        ==================================================== */}

        <div className="space-y-6">

          {filteredReviews.length === 0 ? (

            <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">

              <Star className="w-10 h-10 mx-auto text-gray-300 mb-3" />

              <h3 className="font-extrabold text-emerald-900">
                {t(
                  'noReviewsFound',
                  'No reviews found'
                )}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {t(
                  'tryAnotherFilter',
                  'Try another filter or write the first review.'
                )}
              </p>

            </div>

          ) : (

            filteredReviews.map((review, index) => {

              const rev = review || {};

              const tRev =
                getTranslatedReview(rev);

              const rating = Math.min(
                5,
                Math.max(
                  0,
                  Number(rev.rating) || 0
                )
              );

              return (

                <div
                  key={
                    rev.id ||
                    rev._id ||
                    `review-${index}`
                  }
                  className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm"
                >

                  {/* Reviewer Header */}

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">

                    <div className="flex items-center gap-3">

                      {/* Avatar */}

                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">

                        {(tRev.displayAuthor || '?')
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>

                        <div className="flex items-center gap-2 flex-wrap">

                          <span className="font-bold text-sm text-emerald-900">
                            {tRev.displayAuthor}
                          </span>

                          {rev.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">

                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />

                              {t(
                                'verified',
                                'Verified'
                              )}

                            </span>
                          )}

                        </div>

                        <div className="text-xs text-gray-500">
                          {tRev.displayLocation}{' '}
                          •{' '}
                          {tRev.displayDate}
                        </div>

                      </div>

                    </div>

                    {/* Rating */}

                    <div className="flex text-amber-400">

                      {[...Array(5)].map(
                        (_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-4 h-4 ${
                              starIndex < rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        )
                      )}

                    </div>

                  </div>

                  {/* Product */}

                  <div className="mt-4">

                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">

                      {t('product', 'Product')}:{' '}

                      {tRev.displayProduct}

                    </span>

                  </div>

                  {/* Review Title */}

                  <h3 className="text-base font-extrabold text-emerald-900 mt-3">
                    {tRev.displayTitle}
                  </h3>

                  {/* Review Comment */}

                  <p className="text-sm text-gray-600 leading-relaxed mt-2">
                    {tRev.displayComment}
                  </p>

                  {/* Image */}

                  {rev.image && (
                    <div className="mt-4">

                      <img
                        src={rev.image}
                        alt={t(
                          'customerReview',
                          'Customer review'
                        )}
                        loading="lazy"
                        className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            'none';
                        }}
                      />

                    </div>
                  )}

                  {/* Like */}

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">

                    <button
                      type="button"
                      onClick={() =>
                        handleLike(
                          rev.id || rev._id
                        )
                      }
                      className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 rounded-full transition-colors"
                    >

                      <ThumbsUp className="w-4 h-4" />

                      <span>
                        {t(
                          'helpful',
                          'Helpful'
                        )}{' '}
                        (
                        {Number(
                          rev.likes || 0
                        )}
                        )
                      </span>

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

              {/* Close */}

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Title */}

              <h2 className="text-2xl font-display font-extrabold text-emerald-950">

                {t(
                  'writeAReview',
                  'Write a Review'
                )}

              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-6">

                {t(
                  'writeReviewSubtitle',
                  'Share your experience with our products.'
                )}

              </p>

              {/* Form */}

              <form
                onSubmit={handleAddReview}
                className="space-y-4"
              >

                {/* Name */}

                <div>

                  <label
                    htmlFor="rev-author-name"
                    className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    {t(
                      'yourName',
                      'Your Name'
                    )}
                  </label>

                  <input
                    id="rev-author-name"
                    name="authorName"
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) =>
                      setNewAuthor(
                        e.target.value
                      )
                    }
                    placeholder={t(
                      'namePlaceholder',
                      'Enter your name'
                    )}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                </div>

                {/* Product */}

                <div>

                  <label
                    htmlFor="rev-product-select"
                    className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    {t(
                      'selectProduct',
                      'Select Product'
                    )}
                  </label>

                  <select
                    id="rev-product-select"
                    name="productName"
                    value={newProduct}
                    onChange={(e) =>
                      setNewProduct(
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >

                    {/* Loading */}

                    {isLoadingProducts && (
                      <option value="">
                        {t(
                          'loadingProducts',
                          'Loading products...'
                        )}
                      </option>
                    )}

                    {/* API Products */}

                    {!isLoadingProducts &&
                      safeProductList.length > 0 &&
                      safeProductList.map(
                        (product, index) => {

                          const productId =
                            product?._id ||
                            product?.id ||
                            `product-${index}`;

                          const productName =
                            isTamil
                              ? product?.tamilName ||
                                product?.name ||
                                product?.title ||
                                'Unnamed Product'
                              : product?.name ||
                                product?.title ||
                                product?.productName ||
                                'Unnamed Product';

                          return (
                            <option
                              key={productId}
                              value={productName}
                            >
                              {productName}
                            </option>
                          );
                        }
                      )}

                    {/* Fallback */}

                    {!isLoadingProducts &&
                      safeProductList.length === 0 && (
                        <option
                          value={
                            newProduct ||
                            '100% Cold-Pressed Coconut Oil (Wood-Pressed)'
                          }
                        >
                          {newProduct ||
                            '100% Cold-Pressed Coconut Oil (Wood-Pressed)'}
                        </option>
                      )}

                  </select>

                </div>

                {/* Rating */}

                <div>

                  <span className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">

                    {t(
                      'starRating',
                      'Star Rating'
                    )}

                  </span>

                  <div className="flex items-center gap-1">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewRating(star)
                          }
                          className="p-1 hover:scale-110 transition-transform"
                          aria-label={`Rate ${star} stars`}
                        >

                          <Star
                            className={`w-8 h-8 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />

                        </button>

                      )
                    )}

                  </div>

                </div>

                {/* Review Title */}

                <div>

                  <label
                    htmlFor="rev-title-input"
                    className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    {t(
                      'reviewTitle',
                      'Review Title'
                    )}
                  </label>

                  <input
                    id="rev-title-input"
                    name="title"
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) =>
                      setNewTitle(
                        e.target.value
                      )
                    }
                    placeholder={t(
                      'titlePlaceholder',
                      'Give your review a title'
                    )}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                </div>

                {/* Comment */}

                <div>

                  <label
                    htmlFor="rev-comment-input"
                    className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    {t(
                      'detailedReview',
                      'Detailed Review'
                    )}
                  </label>

                  <textarea
                    id="rev-comment-input"
                    name="comment"
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) =>
                      setNewComment(
                        e.target.value
                      )
                    }
                    placeholder={t(
                      'commentPlaceholder',
                      'Tell us about your experience...'
                    )}
                    className="w-full bg-gray-50 px-4 py-3 rounded-2xl text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="w-full bg-emerald-900 hover:bg-emerald-950 text-white py-3.5 rounded-full font-extrabold text-sm shadow-md transition-all"
                >
                  {t(
                    'submitReview',
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