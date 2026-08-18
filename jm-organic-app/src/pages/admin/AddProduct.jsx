// pages/admin/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addProduct } from '../../services/productService';
import { autoTranslateToTamil } from '../../utils/tamilTranslator';
import { ArrowLeft, Image as ImageIcon, Sparkles, CheckCircle2, Upload } from 'lucide-react';

const PRESET_IMAGES = [
  { name: 'Coconut Oil', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80' },
  { name: 'Virgin Coconut Oil', url: 'https://images.unsplash.com/photo-1620756236360-4a70a1623936?w=800&q=80' },
  { name: 'Tender Coconut', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80' },
  { name: 'Groundnuts', url: 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=800&q=80' },
  { name: 'Turmeric Powder', url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80' },
  { name: 'Brown Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80' }
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadMode, setUploadMode] = useState('file');

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'Oils',
    nutrition: 'Energy: 884 kcal, MCT Lauric Acid: 51.2%, Trans Fat: 0g',
    price: '',
    discountPrice: '',
    unit: '1 Litre',
    stock: '25',
    badge: 'PURE',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
  });

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setProduct((prev) => ({ ...prev, image: compressedBase64 }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const tamilName = autoTranslateToTamil(product.name);
      const tamilDescription = autoTranslateToTamil(product.description);
      const nutritionTa = autoTranslateToTamil(product.nutrition);

      await addProduct({
        ...product,
        tamilName,
        nameTa: tamilName,
        tamilDescription,
        descriptionTa: tamilDescription,
        nutritionTa,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : 0,
        stock: Number(product.stock || 0),
        isFeatured: true
      });
      setSuccessMsg('Product added successfully!');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (error) {
      alert('Error adding product: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link 
            to="/admin/products" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-green-900 hover:text-green-950 transition-colors mb-3 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Back to Products Catalog</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">Add New Organic Product</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Fill in the spacious form below. Details update live across the user catalog and store inventory.
          </p>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm animate-fade-in">
          <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form Container with Spacious Padding & Clear Hierarchy */}
      <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200/80 shadow-sm space-y-8">
        
        {/* Photo Upload & Preview Section */}
        <div className="space-y-4 bg-gray-50/80 p-6 sm:p-8 rounded-3xl border border-gray-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
              Product Image / Media *
            </label>
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs font-bold w-fit">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${uploadMode === 'file' ? 'bg-green-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${uploadMode === 'url' ? 'bg-green-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Image URL
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-6 pt-2">
            {/* Image Preview Box */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-white overflow-hidden border-2 border-gray-200 shrink-0 relative shadow-sm flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt="Product preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-bold gap-1">
                  <ImageIcon size={28} />
                  <span>No Image</span>
                </div>
              )}
              {product.badge && (
                <span className="absolute top-2 left-2 bg-green-900 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Input Controls */}
            <div className="flex-1 flex flex-col justify-between space-y-4 w-full">
              {uploadMode === 'file' ? (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-green-300 bg-white rounded-2xl cursor-pointer hover:bg-green-50/50 hover:border-green-500 transition-all text-center group flex-1">
                  <Upload size={24} className="text-green-800 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-gray-900">Click or Drag & Drop photo from device</span>
                  <span className="text-xs text-gray-500 mt-1">Supports High Resolution JPG, PNG, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500">Image Web Address</label>
                  <input
                    type="url"
                    required
                    value={product.image}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>
              )}

              {/* Quick Presets */}
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Or pick a preset organic photo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setProduct({ ...product, image: preset.url })}
                      className="text-xs font-bold text-green-900 bg-white border border-green-200 hover:bg-green-100/80 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Information Section */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. Basic Information
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="e.g. Cold Pressed Pure Coconut Oil"
              className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Product Description *
            </label>
            <textarea
              required
              rows={4}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="Traditionally cold-pressed from farm-fresh sun-dried coconuts within 24 hours of harvest — 100% natural, unrefined, zero heat, and free from chemicals or preservatives."
              className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Nutrition & Key Health Highlights
            </label>
            <input
              type="text"
              value={product.nutrition}
              onChange={(e) => setProduct({ ...product, nutrition: e.target.value })}
              placeholder="Energy: 884 kcal, Lauric Acid: 51.2%, Rich in MCTs, Zero Trans Fats"
              className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
            />
          </div>
        </div>

        {/* Pricing, Category, Stock & Unit Details Grid */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            2. Pricing & Inventory Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm cursor-pointer"
              >
                <option value="Oils">Oils</option>
                <option value="Fresh Coconuts">Fresh Coconuts</option>
                <option value="Bulk Orders">Bulk Orders</option>
                <option value="Staples">Staples</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                placeholder="180"
                className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Original MRP (₹)
              </label>
              <input
                type="number"
                value={product.discountPrice}
                onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })}
                placeholder="220"
                className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                placeholder="25"
                className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Unit Size / Volume *
              </label>
              <input
                type="text"
                required
                value={product.unit}
                onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                placeholder="e.g. 1 Litre, 5 Litres, 500g, 5 kg"
                className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Badge Tag Pill
              </label>
              <input
                type="text"
                value={product.badge}
                onChange={(e) => setProduct({ ...product, badge: e.target.value })}
                placeholder="e.g. BEST SELLER, PURE, FRESH, ORGANIC"
                className="w-full bg-white px-4 py-3.5 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <Link
            to="/admin/products"
            className="px-6 py-3.5 rounded-2xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-900 text-white px-9 py-3.5 rounded-2xl hover:bg-green-950 transition-all font-extrabold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} className="text-amber-400" />
            <span>{submitting ? 'Saving to Database...' : 'Save Product'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;