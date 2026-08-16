// utils/tamilTranslator.js
// Utility for automatic English to Tamil translation & transliteration for admin products & site dynamic content.

const PRODUCT_DICTIONARY = {
  // Products & Oils
  'cold pressed coconut oil': 'மரச்செக்கு தேங்காய் எண்ணெய்',
  'virgin coconut oil': 'கன்னித் தேங்காய் எண்ணெய்',
  'groundnut oil': 'மரச்செக்கு கடலை எண்ணெய்',
  'peanut oil': 'மரச்செக்கு கடலை எண்ணெய்',
  'cold pressed groundnut oil': 'மரச்செக்கு கடலை எண்ணெய்',
  'organic cold-pressed groundnut oil': 'இயற்கை மரச்செக்கு கடலை எண்ணெய்',
  'sesame oil': 'மரச்செக்கு நல்லெண்ணெய்',
  'gingelly oil': 'மரச்செக்கு நல்லெண்ணெய்',
  'fresh tender coconuts': 'பண்ணை இளநீர் (10 எண்கள்)',
  'tender coconut': 'பண்ணை இளநீர்',
  'raw groundnuts': 'பச்சை வேர்க்கடலை',
  'roasted groundnuts': 'வறுத்த வேர்க்கடலை',
  'bulk coconut oil': 'மொத்த தேங்காய் எண்ணெய்',
  'organic turmeric powder': 'இயற்கை மஞ்சள் தூள்',
  'turmeric powder': 'மஞ்சள் தூள்',
  'organic brown rice': 'இயற்கை கைக்குத்தல் அரிசி',
  'brown rice': 'கைக்குத்தல் அரிசி',
  'cow ghee': 'தூய்மையான பசு நெய்',
  'ghee': 'பசு நெய்',
  'organic honey': 'இயற்கை மலைத்தேன்',
  'honey': 'இயற்கை தேன்',
  'palm jaggery': 'கருப்பட்டி',
  'jaggery': 'நாட்டுச் சர்க்கரை',
  'black pepper': 'கருமிளகு',
  'pepper': 'மிளகு',
  'mustard seeds': 'கடுகு',
  'cardamom': 'ஏலக்காய்',

  // Categories
  'oils': 'எண்ணெய்கள்',
  'fresh': 'புதிய விளைபொருட்கள்',
  'fresh coconuts': 'பண்ணை இளநீர்',
  'nuts': 'பருப்புகள் & கொட்டைகள்',
  'spices': 'மசாலா பொருட்கள்',
  'grains': 'தானியங்கள்',
  'staples': 'அத்தியாவசிய பொருட்கள்',
  'bulk orders': 'மொத்த ஆர்டர்கள்',
  'all': 'அனைத்தும்',

  // Statuses
  'delivered': 'நிறைவடைந்தது',
  'processing': 'செயலாக்கத்தில்',
  'shipped': 'அனுப்பப்பட்டது',
  'pending': 'நிலுவையில்',
  'cancelled': 'ரத்து செய்யப்பட்டது',
  'active': 'செயலில் உள்ளது',
  'low': 'குறைந்த இருப்பு',
  'out': 'இருப்பில் இல்லை',
  'out of stock': 'இருப்பில் இல்லை',
  'in stock': 'இருப்பில் உள்ளது',

  // Units
  '1 litre': '1 லிட்டர்',
  '5 litres': '5 லிட்டர்',
  '25 litres': '25 லிட்டர்',
  '1 l': '1 லிட்டர்',
  '5 l': '5 லிட்டர்',
  '1 kg': '1 கிலோ',
  '2 kg': '2 கிலோ',
  '5 kg': '5 கிலோ',
  '500g': '500 கிராம்',
  '250g': '250 கிராம்',
  '10 pcs': '10 எண்கள்',
  'units': 'எண்கள்',
  'items': 'பொருட்கள்',

  // Badges & Common Phrases
  'best seller': 'அதிக விற்பனை',
  'pure': '100% தூய்மையானது',
  'new': 'புதியது',
  'organic': 'இயற்கை',
  'wood pressed': 'மரச்செக்கு',
  'overview': 'டாஷ்போர்டு பார்வை',
  'dashboard': 'டாஷ்போர்டு',
  'products': 'பொருட்கள்',
  'orders': 'ஆர்டர்கள்',
  'analytics': 'பகுப்பாய்வு',
  'logout': 'வெளியேறு',
  'back to shop': 'கடைக்குத் திரும்பு'
};

const COMMON_WORDS_MAP = {
  'cold': 'குளிர்ந்த',
  'pressed': 'செக்கு',
  'oil': 'எண்ணெய்',
  'organic': 'இயற்கை',
  'pure': 'தூய',
  'fresh': 'புதிய',
  'raw': 'பச்சை',
  'roasted': 'வறுத்த',
  'powder': 'தூள்',
  'rice': 'அரிசி',
  'coconut': 'தேங்காய்',
  'groundnut': 'கடலை',
  'sesame': 'நல்லெண்ணெய்',
  'ghee': 'நெய்',
  'honey': 'தேன்',
  'turmeric': 'மஞ்சள்',
  'jaggery': 'சர்க்கரை',
  'seeds': 'விதைகள்',
  'wood': 'மர',
  'farm': 'பண்ணை',
  'natural': 'இயற்கையான'
};

/**
 * Auto-translates English text to Tamil.
 * Used for static labels & dynamic products added by Admin.
 */
export function autoTranslateToTamil(text) {
  if (!text || typeof text !== 'string') return '';

  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();

  // 1. Direct dictionary lookup
  if (PRODUCT_DICTIONARY[lowerText]) {
    return PRODUCT_DICTIONARY[lowerText];
  }

  // 2. Partial dictionary word replacement
  let words = cleanText.split(' ');
  let translatedWords = words.map(word => {
    const lowerWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (COMMON_WORDS_MAP[lowerWord]) {
      return COMMON_WORDS_MAP[lowerWord];
    }
    return word;
  });

  const joined = translatedWords.join(' ');
  if (joined !== cleanText) {
    return joined;
  }

  // 3. Fallback: return cleaned text without ugly suffix if it's general text
  return cleanText;
}

export function getTamilProductDescription(enDesc) {
  if (!enDesc) return 'தமிழ்நாடு பண்ணைகளில் இருந்து நேரடியாக பெறப்பட்ட 100% இயற்கை தயாரிப்பு.';
  if (enDesc.toLowerCase().includes('coconut')) {
    return 'பாரம்பரிய முறையில் 24 மணி நேரத்திற்குள் பண்ணை தேங்காய்களிலிருந்து எடுக்கப்பட்ட 100% தூய மரச்செக்கு எண்ணெய்.';
  }
  if (enDesc.toLowerCase().includes('groundnut')) {
    return 'இரசாயனம் இல்லாத இயற்கை நிலக்கடலையில் இருந்து தயாரிக்கப்பட்ட உயர்தர மரச்செக்கு எண்ணெய்.';
  }
  if (enDesc.toLowerCase().includes('sesame')) {
    return 'கருப்பட்டி சேர்த்து மரச்செக்கில் ஆட்டப்பட்ட பாரம்பரிய நல்லெண்ணெய்.';
  }
  return `${enDesc} (100% இயற்கை மற்றும் இரசாயனமற்ற தயாரிப்பு)`;
}
