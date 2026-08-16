// pages/ReviewsPage.jsx
import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  Plus, 
  X
} from 'lucide-react';
import { getAllProducts } from '../../services/productService';
import { useTranslation } from 'react-i18next';

// Reviews data with Tamil translations
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
    comment: 'The aroma when opening the bottle is incredible — pure coconut aroma just like my grandmother used to make. Perfect for cooking and my hair care routine. Fast delivery to Coimbatore.',
    commentTa: 'பாட்டில் திறக்கும் போது வாசனை நம்பமுடியாதது - என் பாட்டி செய்தது போல தூய தேங்காய் வாசனை. சமையல் மற்றும் என் முடி பராமரிப்பு வழக்கத்திற்கு ஏற்றது. கோயம்புத்தூருக்கு விரைவான டெலிவரி.',
    verified: true,
    likes: 42,
    image: 'https://images.unsplash.com/photo-1611171711912-3c9d1ce8d0f5?w=600&q=80'
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
    comment: 'Ordered 10 fresh coconuts for our family. Every single one was full of sweet water. You can really tell they were harvested directly from Pollachi farms.',
    commentTa: 'எங்கள் குடும்பத்திற்கு 10 புதிய தேங்காய்களை ஆர்டர் செய்தோம். ஒவ்வொன்றும் இனிப்பான தண்ணீரால் நிரம்பியிருந்தது. அவை பொள்ளாச்சி பண்ணைகளில் இருந்து நேரடியாக அறுவடை செய்யப்பட்டவை என்பதை உண்மையில் சொல்ல முடியும்.',
    verified: true,
    likes: 29,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80'
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
    comment: 'We switched from store bought refined oils to JM Organic Kadalai Ennai. Sambar and poriyal taste so much richer now!',
    commentTa: 'கடையில் வாங்கிய சுத்திகரிக்கப்பட்ட எண்ணெய்களில் இருந்து JM Organic கடலை எண்ணெய்க்கு மாறினோம். இப்போது சாம்பார் மற்றும் பொரியல் மிகவும் சுவையாக உள்ளது!',
    verified: true,
    likes: 18,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80'
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
    comment: 'Purchased 25L drum for our bakery in Bangalore. Very clean oil, no sediment, sturdy packaging drum.',
    commentTa: 'எங்கள் பெங்களூர் பேக்கரிக்கு 25L டிரம் வாங்கினோம். மிகவும் சுத்தமான எண்ணெய், வண்டல் இல்லை, உறுதியான பேக்கேஜிங் டிரம்.',
    verified: true,
    likes: 11,
    image: null
  }
];

const ReviewsPage = () => {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [filterRating, setFilterRating] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // New review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newProduct, setNewProduct] = useState('100% Cold-Pressed Coconut Oil (Wood-Pressed)');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newLocation, setNewLocation] = useState('Coimbatore');

  const products = getAllProducts();

  // Get translated review data
  const getTranslatedReview = (review) => {
    return {
      ...review,
      displayAuthor: isTamil ? (review.authorTa || review.author) : review.author,
      displayLocation: isTamil ? (review.locationTa || review.location) : review.location,
      displayDate: isTamil ? (review.dateTa || review.date) : review.date,
      displayProduct: isTamil ? (review.productNameTa || review.productName) : review.productName,
      displayTitle: isTamil ? (review.titleTa || review.title) : review.title,
      displayComment: isTamil ? (review.commentTa || review.comment) : review.comment,
    };
  };

  const handleLike = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newAuthor || !newTitle || !newComment) return;

    const created = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      authorTa: newAuthor,
      location: newLocation,
      locationTa: newLocation,
      rating: Number(newRating),
      date: 'Just now',
      dateTa: 'இப்போதுதான்',
      productName: newProduct,
      productNameTa: newProduct,
      title: newTitle,
      titleTa: newTitle,
      comment: newComment,
      commentTa: newComment,
      verified: true,
      likes: 0,
      image: null
    };

    setReviews([created, ...reviews]);
    setShowModal(false);

    // Reset form
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
  };

  const filteredReviews = reviews.filter(r => {
    if (filterRating === '5') return r.rating === 5;
    if (filterRating === '4') return r.rating === 4;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F3F7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block">
              {t('customerReviews')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-950 mt-2">
              {t('reviewsPageTitle')}
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              {t('reviewsPageSubtitle')}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-md hover:bg-emerald-950 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t('writeAReview')}</span>
          </button>
        </div>

        {/* Rating Overview Cards */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Left Score Card */}
            <div className="text-center md:text-left md:border-r border-gray-200 md:pr-8">
              <div className="text-5xl font-black text-emerald-900">4.9</div>
              <div className="flex justify-center md:justify-start text-amber-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs font-bold text-gray-500">
                {t('basedOn')} 1,420+ {t('verifiedOrders')}
              </div>
            </div>

            {/* Middle Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="w-12 text-emerald-800">5 {t('stars')}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-700 rounded-full w-[92%]" />
                </div>
                <span className="w-10 text-right text-gray-500">92%</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="w-12 text-emerald-800">4 {t('stars')}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-700 rounded-full w-[6%]" />
                </div>
                <span className="w-10 text-right text-gray-500">6%</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="w-12 text-emerald-800">3 {t('stars')}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-700 rounded-full w-[2%]" />
                </div>
                <span className="w-10 text-right text-gray-500">2%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === 'all' 
                ? 'bg-emerald-900 text-white' 
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t('allReviews')} ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating('5')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === '5' 
                ? 'bg-emerald-900 text-white' 
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ★ 5 {t('stars')}
          </button>
          <button
            onClick={() => setFilterRating('4')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
              filterRating === '4' 
                ? 'bg-emerald-900 text-white' 
                : 'bg-white text-emerald-900 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            ★ 4 {t('stars')}
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((rev) => {
            const tRev = getTranslatedReview(rev);
            return (
              <div key={rev.id} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {tRev.displayAuthor.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-emerald-900">{tRev.displayAuthor}</span>
                        {rev.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {t('verified')}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{tRev.displayLocation} • {tRev.displayDate}</div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product Badge Tag */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {t('product')}: {tRev.displayProduct}
                  </span>
                </div>

                {/* Title & Comment */}
                <h3 className="text-base font-extrabold text-emerald-900 mt-3">{tRev.displayTitle}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{tRev.displayComment}</p>

                {/* Review Attached Image */}
                {rev.image && (
                  <div className="mt-4">
                    <img
                      src={rev.image}
                      alt="Customer review photo"
                      className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
                    />
                  </div>
                )}

                {/* Helpful Like Button */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(rev.id)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 rounded-full transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{t('helpful')} ({rev.likes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Form for Writing a Review */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-display font-extrabold text-emerald-950">
                {t('writeAReview')}
              </h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                {t('writeReviewSubtitle')}
              </p>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    {t('yourName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder={t('namePlaceholder')}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    {t('selectProduct')}
                  </label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    {t('starRating')}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    {t('reviewTitle')}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t('titlePlaceholder')}
                    className="w-full bg-gray-50 px-4 py-3 rounded-full text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    {t('detailedReview')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('commentPlaceholder')}
                    className="w-full bg-gray-50 px-4 py-3 rounded-2xl text-sm font-semibold text-emerald-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-900 hover:bg-emerald-950 text-white py-3.5 rounded-full font-extrabold text-sm shadow-md transition-all"
                >
                  {t('submitReview')}
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