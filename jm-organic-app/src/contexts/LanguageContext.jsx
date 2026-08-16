// contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n';
import { autoTranslateToTamil } from '../utils/tamilTranslator';

const LanguageContext = createContext();

const UI_TRANSLATIONS = {
  en: {
    // Hero Section
    heroTagline: '100% COLD-PRESSED · FARM TO DOORSTEP',
    heroSubtitle: 'Coconut oil, fresh coconuts, and groundnuts sourced directly from Tamil Nadu farms. Transparent market pricing — no middleman markup.',
    search: 'Search',
    oils: 'Oils',
    freshCoconuts: 'Fresh Coconuts',
    bulkOrders: 'Bulk Orders',
    coconutOil1L: 'Coconut Oil 1L',
    bulk25L: 'Bulk 25L',
    avgCoconutOil: 'AVG. COCONUT OIL /L',
    organicProducts: 'ORGANIC PRODUCTS',
    certifiedPure: 'CERTIFIED PURE',
    happyFamilies: 'HAPPY FAMILIES',
    
    // Basic & Navigation
    shop: 'Shop',
    nutrition: 'Nutrition & Lab',
    reviews: 'Reviews',
    admin: 'Admin',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    myProfile: 'My Profile',
    cart: 'Cart',
    allProducts: 'All Products',
    categories: 'Categories',
    searchPlaceholder: 'Search for organic products...',
    addToCart: 'Add to Cart',
    added: 'Added!',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    price: 'Price',
    viewDetails: 'View Details',
    home: 'Home',
    products: 'Products',
    lowStock: 'Low Stock',
    
    // Home Page
    pureHarvest: 'Pure harvest. Direct to home.',
    heroSub: 'Fresh, traceable organic produce from Tamil Nadu farms',
    ourProducts: 'Our Products',
    freshTraceable: 'Fresh, traceable organic produce from Tamil Nadu farms',
    fssaiCertified: 'FSSAI Certified',
    hundredOrganic: '100% Organic',
    farmTraced: 'Farm Traced',
    exploreProducts: 'Explore Products',
    whyUs: 'Why Us',
    organicSelection: 'Our Organic Selection',
    farmDirectHome: 'Directly from Tamil Nadu farms to your home',
    
    // Why Choose Us
    directFromTamilNaduFarms: 'Direct from Tamil Nadu Farms',
    farmSourceDescription: 'Every product comes from within 200km of our facility. Scan the QR code on your order to track your product to certified partner farms in Coimbatore & Pollachi.',
    ecoImpactCalculator: 'Eco-Impact Calculator',
    ecoImpactDescription: 'Every purchase saves water, reduces carbon, and supports regenerative agriculture in South India.',
    carbonFootprintSaved: 'Carbon Saved',
    carbonPerBottle: '0.8 kg CO₂ / bottle',
    localFarmersSupported: 'Local Farmers Supported',
    organicFarms: '24+ Organic Farms',
    packaging: 'Packaging',
    recyclableGlassTin: '100% Recyclable Glass & Tin',
    whyChooseSubtitle: 'Discover why thousands trust JM Organic for their daily nutrition',
    shopNow: 'Shop Now',
    
    // Bulk Orders
    bulkOrdersTagline: 'For Restaurants, Bakeries & Retailers',
    wholesaleHeading: 'Wholesale & Bulk Supply: 5L to 100L',
    wholesaleDescription: 'Direct B2B supply of pure wood-pressed coconut oil. 18% volume discount, dedicated account management, GST invoices, and priority dispatch.',
    volumeSavings: 'Volume Savings',
    batchCapacity: 'Batch Capacity',
    getWholesaleQuote: 'Get Wholesale Quote',
    
    // Stats
    happyFamiliesLabel: 'Happy Families',
    fssaiPure: 'FSSAI Pure',
    certifiedLabel: '100% Certified',
    farmToHome: 'Farm to Home',
    
    // Checkout & Cart
    quickCheckout: 'Proceed to Checkout',
    totalAmount: 'Total Amount',
    deliveryAddress: 'Delivery Address',
    placeOrder: 'Place Order',
    orderSuccess: 'Order Placed Successfully!',
    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'FREE',
    grandTotal: 'Grand Total',
    fullName: 'Full Name',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    pincode: 'Pincode',
    cashOnDelivery: 'Cash on Delivery',
    onlinePayment: 'Online Payment',
    
    // Admin Panel
    adminPortal: 'Admin Dashboard',
    adminPanel: 'Admin Panel',
    addNewProduct: 'Add New Product',
    saveProduct: 'Save Product',
    editProduct: 'Edit Product',
    productName: 'Product Name',
    category: 'Category',
    stock: 'Stock',
    badgeTag: 'Badge Tag',
    actions: 'Actions',
    overview: 'Overview',
    orders: 'Orders',
    analytics: 'Analytics',
    dashboard: 'Dashboard',
    backToShop: 'Back to Shop',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    catalogStockManagement: 'Catalog & Stock Management',
    orderManagement: 'Order Management',
    salesPerformance: 'Sales & Revenue Performance',
    recentOrders: 'Recent Orders',
    viewAllOrders: 'View all orders →',
    productTitle: 'Product Title',
    tamilTitle: 'Tamil Title (தமிழ்)',
    priceLabel: 'Price (₹)',
    unitLabel: 'Unit',
    stockQty: 'Stock Qty',
    imageUrl: 'Image URL',
    availability: 'Availability',
    selectQuantity: 'Select Quantity',
    productOverview: 'Product Overview',
    nutritionFacts: 'Nutrition Facts (per 100g)',
    youMayAlsoLike: 'You May Also Like',
    hundredPure: '100% Pure',
    farmExpress: 'Farm Express',
    easyReturns: 'Easy Returns',
    
    // Products Page
    popularity: 'Popularity',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    highestRated: 'Highest Rated',
    sort: 'Sort',
    filters: 'Filters',
    noResultsFound: 'No products found matching your criteria',
    clearAllFilters: 'Clear all filters',
    priceRange: 'Price Range',
    productType: 'Product Type',
    coldPressed: 'Cold Pressed',
    noPreservatives: 'No Preservatives',
    virgin: 'Virgin',
    
    // Authentication
    signInHeader: 'Sign In to Your Account',
    createAccountHeader: 'Create Your Account',
    emailOrPhone: 'Email or Phone',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccountBtn: 'Create My Account →',
    alreadyRegistered: 'Already registered?',
    signInHere: 'Sign In here →',
    or: 'or',
    dontHaveAccount: "Don't have an account?",
    registerHere: 'Register here →',
    
    // Common
    fssaiCertifiedLabel: 'FSSAI Certified',
    hundredColdPressed: '100% Cold-Pressed',
    organicQualityGuarantee: '100% Organic Quality Guarantee',
    directFarmSourcing: 'Direct Farm Sourcing',
    fssaiApprovedLab: 'FSSAI APPROVED LAB ANALYSIS',
    
    // Footer
    footerAbout: 'About Us',
    footerDescription: 'JM Organic brings pure, traceable organic produce directly from Tamil Nadu farms to your home.',
    footerQuickLinks: 'Quick Links',
    footerContact: 'Contact Us',
    footerRights: 'All rights reserved',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    
    // Newsletter
    newsletterTitle: 'Subscribe to Our Newsletter',
    newsletterSubtitle: 'Get the latest updates on new products and special offers',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    
    // Product Detail
    productNotFound: 'Product Not Found',
    productNotFoundDesc: 'The product you\'re looking for might have been moved or removed.',
    units: 'units',
    noChemicals: 'Zero solvent extraction or artificial chemical additives',
    richInMCT: 'Rich in Healthy Medium Chain Triglycerides (MCTs)',
    idealForCooking: 'Ideal for traditional cooking, hair care, and skin hydration',
    fssaiLabTested: 'FSSAI certified and lab tested for heavy metals and purity',
    energyCalories: 'Energy / Calories',
    totalFattyAcids: 'Total Fatty Acids',
    lauricAcid: 'Lauric Acid (MCT)',
    transFats: 'Trans Fats',
    zero: 'Zero'
  },
  ta: {
    // Hero Section
    heroTagline: '100% மரச்செக்கு · பண்ணையிலிருந்து உங்கள் வாசலுக்கு',
    heroSubtitle: 'தமிழ்நாடு பண்ணைகளிலிருந்து நேரடியாக பெறப்பட்ட மரச்செக்கு தேங்காய் எண்ணெய், இளநீர் மற்றும் கடலை எண்ணெய். நேர்மையான சந்தை விலை - நடுவர் இல்லை.',
    search: 'தேடுக',
    oils: 'எண்ணெய்கள்',
    freshCoconuts: 'புதிய தேங்காய்',
    bulkOrders: 'பெரிய ஆர்டர்கள்',
    coconutOil1L: 'தேங்காய் எண்ணெய் 1L',
    bulk25L: 'பெரிய 25L',
    avgCoconutOil: 'சராசரி தேங்காய் எண்ணெய் /L',
    organicProducts: 'இயற்கை பொருட்கள்',
    certifiedPure: '100% சான்றளிக்கப்பட்டது',
    happyFamilies: 'மகிழ்ச்சியான குடும்பங்கள்',
    
    // Basic & Navigation
    shop: 'கடை',
    nutrition: 'ஊட்டச்சத்து & பரிசோதனை',
    reviews: 'வாடிக்கையாளர் மதிப்பீடுகள்',
    admin: 'நிர்வாகி',
    signIn: 'உள்நுழைக',
    signOut: 'வெளியேறு',
    myProfile: 'என் சுயவிவரம்',
    cart: 'கூடை',
    allProducts: 'அனைத்து பொருட்கள்',
    categories: 'பிரிவுகள்',
    searchPlaceholder: 'இயற்கை பொருட்களுக்கு தேடுங்கள்...',
    addToCart: 'கூடையில் சேர்',
    added: 'சேர்க்கப்பட்டது!',
    buyNow: 'உடனே வாங்க',
    inStock: 'இருப்பில் உள்ளது',
    outOfStock: 'இருப்பில் இல்லை',
    price: 'விலை',
    viewDetails: 'விவரங்களை காண்க',
    home: 'முகப்பு',
    products: 'பொருட்கள்',
    lowStock: 'குறைந்த இருப்பு',
    
    // Home Page
    pureHarvest: 'தூய அறுவடை. நேரடி விநியோகம்.',
    heroSub: 'தமிழ்நாடு பண்ணைகளில் இருந்து நேரடியாக வரும் இயற்கை பொருட்கள்',
    ourProducts: 'எங்கள் பொருட்கள்',
    freshTraceable: 'தமிழ்நாடு பண்ணைகளில் இருந்து நேரடியாக வரும் இயற்கை பொருட்கள்',
    fssaiCertified: 'FSSAI சான்றளிக்கப்பட்டது',
    hundredOrganic: '100% இயற்கை',
    farmTraced: 'பண்ணை வழி அறியப்பட்டது',
    exploreProducts: 'பொருட்களைப் பார்க்க',
    whyUs: 'எங்களை ஏன் தேர்வு செய்ய வேண்டும்',
    organicSelection: 'எங்கள் இயற்கை தயாரிப்புகள்',
    farmDirectHome: 'தமிழ்நாடு பண்ணைகளில் இருந்து நேரடியாக உங்கள் வீட்டிற்கு',
    
    // Why Choose Us
    directFromTamilNaduFarms: 'தமிழ்நாடு பண்ணைகளில் இருந்து நேரடி',
    farmSourceDescription: 'ஒவ்வொரு பொருளும் எங்கள் வசதிக்கு 200 கி.மீ க்குள் இருந்து வரும். உங்கள் ஆர்டரில் QR குறியீட்டை ஸ்கேன் செய்து, கோயம்பூர் & பொலாச்சி-யில் சான்றளிக்கப்பட்ட பங்குதாரர் கோவைகளுக்கு உங்கள் பொருளைக் கண்டுபிடிக்க முடியும்.',
    ecoImpactCalculator: 'ஈக்கோ-தாக்கம் கணக்கெடுப்பு',
    ecoImpactDescription: 'ஒவ்வொரு கொள்முதலும் நீரை சேமிக்கிறது, கார்பனை குறைக்கிறது, மற்றும் தென் இந்தியாவில் மறுஉற்பத்தி விவசாயத்தை ஆதரிக்கிறது.',
    carbonFootprintSaved: 'கார்பன் சேமிக்கப்பட்டது',
    carbonPerBottle: '0.8 கிலோ CO₂ / பாட்டில்',
    localFarmersSupported: 'உள்ளூர் விவசாயிகள் ஆதரிக்கப்பட்டவர்கள்',
    organicFarms: '24+ இயற்கை பண்ணைகள்',
    packaging: 'பொதிதல்',
    recyclableGlassTin: '100% மீண்டும் பயன்படுத்தக்கூடிய கண்ணாடி & டின்',
    whyChooseSubtitle: 'JM இயற்கையை ஏன் ஆயிரக்கணக்கானோர் நம்புகிறார்கள் என்பதைக் கண்டறியவும்',
    shopNow: 'இப்போது ஷாப்பிங் செய்க',
    
    // Bulk Orders
    bulkOrdersTagline: 'உணவகங்கள், பேக்கரி & சில்லறை விற்பனையாளர்களுக்கு',
    wholesaleHeading: 'மொத்த விற்பனை & பெரிய வழங்கல்: 5L முதல் 100L',
    wholesaleDescription: 'தூய மரச்செக்கு தேங்காய் எண்ணெய்யின் நேரடி B2B வழங்கல். 18% அளவு தள்ளுபடி, அர்ப்பணிக்கப்பட்ட கணக்கு மேலாண்மை, GST விலைப்பட்டியல், மற்றும் முன்னுரிமை அனுப்பீடு.',
    volumeSavings: 'அளவு சேமிப்பு',
    batchCapacity: 'குவியல் திறன்',
    getWholesaleQuote: 'மொத்த விற்பனை மேற்கோள் பெற',
    
    // Stats
    happyFamiliesLabel: 'மகிழ்ச்சியான குடும்பங்கள்',
    fssaiPure: 'FSSAI தூய்மை',
    certifiedLabel: '100% சான்றளிக்கப்பட்டது',
    farmToHome: 'பண்ணை முதல் வீட்டுக்கு',
    
    // Checkout & Cart
    quickCheckout: 'செக்-அவுட் தொடர்க',
    totalAmount: 'மொத்தத் தொகை',
    deliveryAddress: 'டெலிவரி முகவரி',
    placeOrder: 'ஆர்டர் செய்க',
    orderSuccess: 'ஆர்டர் வெற்றிகரமாக செய்யப்பட்டது!',
    shoppingCart: 'உங்கள் கூடை',
    emptyCart: 'உங்கள் கூடை காலியாக உள்ளது',
    continueShopping: 'தொடர்ந்து ஷாப்பிங் செய்க',
    subtotal: 'கூட்டுத் தொகை',
    shipping: 'டெலிவரி கட்டணம்',
    free: 'இலவசம்',
    grandTotal: 'மொத்த தொகை',
    fullName: 'முழு பெயர்',
    phone: 'தொலைபேசி எண்',
    address: 'முகவரி',
    city: 'நகரம்',
    pincode: 'அஞ்சல் குறியீடு',
    cashOnDelivery: 'பொருள் வந்ததும் பணம் செலுத்துங்கள்',
    onlinePayment: 'ஆன்லைன் மூலம் பணம் செலுத்துங்கள்',
    
    // Admin Panel
    adminPortal: 'நிர்வாகி டாஷ்போர்டு',
    adminPanel: 'நிர்வாகி பேனல்',
    addNewProduct: 'புதிய பொருள் சேர்க்க',
    saveProduct: 'பொருளை சேமிக்க',
    editProduct: 'பொருளை திருத்துக',
    productName: 'பொருள் பெயர்',
    category: 'பிரிவு',
    stock: 'இருப்பு',
    badgeTag: 'பேட்ஜ்',
    actions: 'செயல்கள்',
    overview: 'டாஷ்போர்டு பார்வை',
    orders: 'ஆர்டர்கள்',
    analytics: 'பகுப்பாய்வு',
    dashboard: 'டாஷ்போர்டு',
    backToShop: 'கடைக்குத் திரும்பு',
    totalRevenue: 'மொத்த வருவாய்',
    totalOrders: 'மொத்த ஆர்டர்கள்',
    catalogStockManagement: 'பொருட்கள் & இருப்பு மேலாண்மை',
    orderManagement: 'ஆர்டர் மேலாண்மை',
    salesPerformance: 'விற்பனை & வருவாய் செயல்திறன்',
    recentOrders: 'சமீபத்திய ஆர்டர்கள்',
    viewAllOrders: 'அனைத்து ஆர்டர்களையும் பார்க்க →',
    productTitle: 'பொருள் பெயர் (ஆங்கிலம்)',
    tamilTitle: 'தமிழ் பெயர் (தமிழ்)',
    priceLabel: 'விலை (₹)',
    unitLabel: 'அளவு / அலகு',
    stockQty: 'இருப்பு அளவு',
    imageUrl: 'படம் URL',
    availability: 'இருப்பு நிலை',
    selectQuantity: 'அளவைத் தேர்ந்தெடுக்கவும்',
    productOverview: 'பொருள் விவரங்கள்',
    nutritionFacts: 'ஊட்டச்சத்து விவரங்கள் (100g க்கு)',
    youMayAlsoLike: 'நீங்கள் விரும்பக்கூடிய பிற பொருட்கள்',
    hundredPure: '100% தூய்மையானது',
    farmExpress: 'வேகமான விநியோகம்',
    easyReturns: 'எளிதான வருவாய்',
    
    // Products Page
    popularity: 'பிரபலம்',
    priceLowHigh: 'விலை: குறைந்த முதல் உயர்',
    priceHighLow: 'விலை: உயர் முதல் குறைந்த',
    highestRated: 'மிக உயர்ந்த மதிப்பீடு',
    sort: 'வகைப்படுத்து',
    filters: 'வடிப்பிகள்',
    noResultsFound: 'உங்கள் அளவுகோல்களுடன் பொருட்கள் கிடைக்கவில்லை',
    clearAllFilters: 'அனைத்து வடிப்பிகளையும் நீக்குக',
    priceRange: 'விலை வரம்பு',
    productType: 'பொருளின் வகை',
    coldPressed: 'மரச்செக்கு',
    noPreservatives: 'பாதுகாப்பு இல்லை',
    virgin: 'கன்னிய',
    
    // Authentication
    signInHeader: 'உங்கள் கணக்கில் உள்நுழைக',
    createAccountHeader: 'புதிய கணக்கை உருவாக்கவும்',
    emailOrPhone: 'மின்னஞ்சல் அல்லது தொலைபேசி',
    password: 'கடவுச்சொல்',
    confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    createAccountBtn: 'எனது கணக்கை உருவாக்கவும் →',
    alreadyRegistered: 'ஏற்கனவே பதிவு செய்துள்ளீர்களா?',
    signInHere: 'இங்கே உள்நுழையவும் →',
    or: 'அல்லது',
    dontHaveAccount: 'கணக்கு இல்லையா?',
    registerHere: 'இங்கே பதிவு செய்க →',
    
    // Common
    fssaiCertifiedLabel: 'FSSAI சான்றளிக்கப்பட்டது',
    hundredColdPressed: '100% மரச்செக்கு',
    organicQualityGuarantee: '100% இயற்கை தரம் உறுதி',
    directFarmSourcing: 'நேரடி பண்ணை மூலாதாரம்',
    fssaiApprovedLab: 'FSSAI அனுமதிக்கப்பட்ட லேப் பகுப்பாய்வு',
    
    // Footer
    footerAbout: 'எங்களை பற்றி',
    footerDescription: 'JM இயற்கை தமிழ்நாடு பண்ணைகளில் இருந்து நேரடியாக உங்கள் வீட்டிற்கு தூய, அறியக்கூடிய இயற்கை பொருட்களை கொண்டுவருகிறது.',
    footerQuickLinks: 'விரைவு இணைப்புகள்',
    footerContact: 'எங்களை தொடர்பு கொள்ள',
    footerRights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
    footerPrivacy: 'தனியுரிமை கொள்கை',
    footerTerms: 'சேவை விதிமுறைகள்',
    
    // Newsletter
    newsletterTitle: 'எங்கள் செய்திமடலுக்கு குழுசேரவும்',
    newsletterSubtitle: 'புதிய பொருட்கள் மற்றும் சிறப்பு சலுகைகள் பற்றிய சமீபத்திய புதுப்பிப்புகளைப் பெறுங்கள்',
    emailPlaceholder: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    subscribe: 'பதிவு செய்க',
    
    // Product Detail
    productNotFound: 'பொருள் கிடைக்கவில்லை',
    productNotFoundDesc: 'நீங்கள் தேடும் பொருள் நகர்த்தப்பட்டிருக்கலாம் அல்லது அகற்றப்பட்டிருக்கலாம்.',
    units: 'அலகுகள்',
    noChemicals: 'எந்தவிதமான கரைப்பான் பிரித்தெடுத்தல் அல்லது செயற்கை இரசாயன சேர்க்கைகள் இல்லை',
    richInMCT: 'ஆரோக்கியமான மீடியம் சேன் ட்ரைகிளிசரைடுகள் (MCT) நிறைந்தது',
    idealForCooking: 'பாரம்பரிய சமையல், முடி பராமரிப்பு மற்றும் தோல் ஈரப்பதத்திற்கு ஏற்றது',
    fssaiLabTested: 'FSSAI சான்றளிக்கப்பட்டது மற்றும் கன உலோகங்கள் மற்றும் தூய்மைக்காக ஆய்வகத்தில் சோதிக்கப்பட்டது',
    energyCalories: 'ஆற்றல் / கலோரிகள்',
    totalFattyAcids: 'மொத்த கொழுப்பு அமிலங்கள்',
    lauricAcid: 'லாரிக் அமிலம் (MCT)',
    transFats: 'டிரான்ஸ் கொழுப்புகள்',
    zero: 'பூஜ்யம்'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('jm_language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('jm_language', language);
    if (i18n.changeLanguage) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (keyOrText) => {
    if (!keyOrText) return '';
    if (language === 'en') {
      return UI_TRANSLATIONS.en[keyOrText] || keyOrText;
    }
    if (UI_TRANSLATIONS.ta[keyOrText]) {
      return UI_TRANSLATIONS.ta[keyOrText];
    }
    const foundKey = Object.keys(UI_TRANSLATIONS.en).find(
      k => UI_TRANSLATIONS.en[k].toLowerCase() === String(keyOrText).toLowerCase()
    );
    if (foundKey && UI_TRANSLATIONS.ta[foundKey]) {
      return UI_TRANSLATIONS.ta[foundKey];
    }
    return autoTranslateToTamil(keyOrText);
  };

  const translateText = (englishText, tamilText) => {
    if (language === 'ta') {
      return tamilText || t(englishText) || autoTranslateToTamil(englishText);
    }
    return englishText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export default LanguageContext;