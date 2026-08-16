// pages/admin/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addProduct } from '../../services/productService';
import { autoTranslateToTamil } from '../../utils/tamilTranslator';
import { ArrowLeft, Image as ImageIcon, Sparkles, CheckCircle2, Upload } from 'lucide-react';

const PRESET_IMAGES = [
  { name: 'Coconut Oil', url: 'https://images.unsplash.com/photo-1611171711912-3c9d1ce8d0f5?w=800&q=80' },
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
    image: 'https://images.unsplash.com/photo-1611171711912-3c9d1ce8d0f5?w=800&q=80'
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
      setProduct((prev) => ({ ...prev, image: ev.target.result }));
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
    <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline mb-2">
            <ArrowLeft size={14} /> Back to Products Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-emerald-950">Add New Organic Product</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Product details and media images will immediately reflect across the catalog.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-brand-border/80 shadow-md">
        
        {/* Photo Upload & Preview Section */}
        <div className="space-y-3 bg-[#F3F7F2] p-5 rounded-2xl border border-brand-border/60">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider">
              Product Photo / Media *
            </label>
            <div className="flex bg-white/80 p-0.5 rounded-lg border border-emerald-300 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-2.5 py-1 rounded-md transition-colors ${uploadMode === 'file' ? 'bg-emerald-900 text-white' : 'text-emerald-900'}`}
              >
                Upload Device Media
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`px-2.5 py-1 rounded-md transition-colors ${uploadMode === 'url' ? 'bg-emerald-900 text-white' : 'text-emerald-900'}`}
              >
                Image URL
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-2xl bg-emerald-100 overflow-hidden border border-emerald-200 shrink-0 relative shadow-sm flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt="Product preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-emerald-800 text-[10px] font-bold">
                  <ImageIcon size={24} />
                  <span>No Image</span>
                </div>
              )}
              {product.badge && (
                <span className="absolute top-1.5 left-1.5 bg-emerald-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full">
              {uploadMode === 'file' ? (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-400 bg-white rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors text-center">
                  <Upload size={20} className="text-emerald-800 mb-1" />
                  <span className="text-xs font-bold text-emerald-900">Click to upload photo from media/device</span>
                  <span className="text-[10px] text-muted-foreground">PNG, JPG, WEBP formats</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <input
                  type="url"
                  required
                  value={product.image}
                  onChange={(e) => setProduct({ ...product, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-white px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              )}

              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Or select a photo preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setProduct({ ...product, image: preset.url })}
                      className="text-[11px] font-bold text-emerald-900 bg-white border border-emerald-200 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="e.g. Cold Pressed Coconut Oil"
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Product Description *
            </label>
            <textarea
              required
              rows={3}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="Traditionally cold-pressed from farm-fresh coconuts within 24 hours of harvest — no heat, no chemicals."
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Nutrition Facts & Health Benefits
            </label>
            <input
              type="text"
              value={product.nutrition}
              onChange={(e) => setProduct({ ...product, nutrition: e.target.value })}
              placeholder="Energy: 884 kcal, Lauric Acid: 51.2%, Rich in MCTs, Zero Trans Fats"
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Pricing, Unit, Stock & Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-brand-border/60">
          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full bg-[#F3F7F2] px-3 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Oils">Oils</option>
              <option value="Fresh Coconuts">Fresh Coconuts</option>
              <option value="Bulk Orders">Bulk Orders</option>
              <option value="Staples">Staples</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              required
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              placeholder="180"
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Discount Price (₹)
            </label>
            <input
              type="number"
              value={product.discountPrice}
              onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })}
              placeholder="220"
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Stock Qty *
            </label>
            <input
              type="number"
              required
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              placeholder="25"
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Unit Size *
            </label>
            <input
              type="text"
              required
              value={product.unit}
              onChange={(e) => setProduct({ ...product, unit: e.target.value })}
              placeholder="e.g. 1 Litre, 5 Litres, 500g, 5 kg"
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
              Badge Tag
            </label>
            <input
              type="text"
              value={product.badge}
              onChange={(e) => setProduct({ ...product, badge: e.target.value })}
              placeholder="e.g. BEST SELLER, PURE, FRESH, ORGANIC"
              className="w-full bg-[#F3F7F2] px-4 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-full border border-brand-border text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-900 text-white px-8 py-3.5 rounded-full hover:bg-emerald-950 transition-all font-extrabold text-xs shadow-md flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{submitting ? 'Saving to Database...' : 'Save Product'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;