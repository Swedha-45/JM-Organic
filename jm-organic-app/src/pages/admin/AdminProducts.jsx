// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon, Sparkles, Flame, Apple, Wheat, Droplet, Beef } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { getAllProductsAsync, addProduct, updateProduct, deleteProduct } from '../../services/productService';
import { autoTranslateToTamil } from '../../utils/tamilTranslator';
import { uploadImage } from '../../services/uploadService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Oils');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('1 Litre');
  const [stock, setStock] = useState('');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('');
  const [uploadMode, setUploadMode] = useState('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // ✅ NEW: Nutrition states - separate fields
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');

  const loadProducts = async () => {
    const list = await getAllProductsAsync();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setCategory('Oils');
    setPrice('');
    setUnit('1 Litre');
    setStock('0');
    setBadge('');
    setImage('');
    // ✅ Reset nutrition fields
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setFiber('');
    setUploadMode('url');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setName(p.name || '');
    setDescription(p.description || '');
    setCategory(p.category || 'Oils');
    setPrice(String(p.price || ''));
    setUnit(p.unit || '1 Litre');
    setStock(String(p.stock !== undefined && p.stock !== null ? p.stock : 0));
    setBadge(p.badge || '');
    setImage(p.image || '');
    // ✅ Load nutrition data
    const nutrition = p.nutritionInfo || {};
    setCalories(nutrition.calories || '');
    setProtein(nutrition.protein || '');
    setCarbs(nutrition.carbs || '');
    setFat(nutrition.fat || '');
    setFiber(nutrition.fiber || '');
    setUploadMode('url');
    setShowModal(true);
  };

  // ✅ FIXED: handleSave with proper validation
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate Name
    if (!name || name.trim() === '') {
      alert('Please enter a product name');
      return;
    }

    // Validate Price
    const priceValue = parseFloat(price);
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price (must be greater than 0)');
      return;
    }

    // Validate Stock
    let stockValue = parseInt(stock);
    if (isNaN(stockValue) || stockValue < 0) {
      stockValue = 0;
    }

    // ✅ Build nutritionInfo object
    const nutritionInfo = {
      calories: calories || '0',
      protein: protein || '0',
      carbs: carbs || '0',
      fat: fat || '0',
      fiber: fiber || '0'
    };

    // Build nutrition string for display
    const nutritionString = `Calories: ${calories || 0} kcal, Protein: ${protein || 0}g, Carbs: ${carbs || 0}g, Fat: ${fat || 0}g, Fiber: ${fiber || 0}g`;

    const finalImage = image || 'https://via.placeholder.com/300x300/15803d/ffffff?text=No+Image';

    const tamilName = autoTranslateToTamil(name);
    const tamilDescription = autoTranslateToTamil(description);

    const payload = {
      name,
      tamilName,
      nameTa: tamilName,
      description,
      tamilDescription,
      descriptionTa: tamilDescription,
      nutrition: nutritionString,
      nutritionInfo, // ✅ Store as object
      category,
      price: priceValue,
      unit: unit || '1 Litre',
      stock: stockValue,
      badge: badge || null,
      image: finalImage,
      tags: ['Cold Pressed', 'Organic'],
      rating: 0,
      reviewCount: 0
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct(payload);
      }
      await loadProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.message || 'Failed to save product. Please check all fields.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      await loadProducts();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Products" />

      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Catalog & Stock Management</h2>
            <p className="text-xs text-gray-500 font-medium">Manage product items, prices, and stock inventory</p>
          </div>
          
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-900 text-white text-xs font-extrabold hover:bg-green-950 transition-all shadow-md"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-200/80">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product Name', 'Category', 'Price', 'Unit', 'Stock', 'Badge', 'Actions'].map((h) => (
                    <th key={h} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.image || 'https://via.placeholder.com/300x300/15803d/ffffff?text=No+Image'} 
                          alt={p.name} 
                          className="w-11 h-11 rounded-2xl object-cover bg-green-50 shrink-0 border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300/15803d/ffffff?text=No+Image';
                          }}
                        />
                        <div>
                          <div className="font-extrabold text-gray-900 text-xs">{p.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">{p.category}</td>
                    <td className="px-6 py-4 text-xs font-black text-green-950">₹{p.price}</td>
                    <td className="px-6 py-4 text-xs text-gray-600 font-medium">{p.unit}</td>
                    <td className="px-6 py-4 text-xs">
                      {p.stock === 0 ? (
                        <span className="text-rose-600 font-extrabold px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200">Out of Stock</span>
                      ) : (
                        <span className="text-gray-900 font-bold">{p.stock} units</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.badge ? (
                        <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-900 text-[10px] font-black uppercase">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-gray-500 hover:text-green-900 transition-colors p-1.5 rounded-lg hover:bg-green-50"
                          title="Edit Product"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-gray-500 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl relative max-h-[92vh] flex flex-col my-auto border border-gray-100 animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {editingId ? 'Edit Product Details' : 'Add New Organic Product'}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {editingId ? 'Update product information' : 'Enter product details below'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-2xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="space-y-6 pt-6 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              
              {/* Image Upload */}
              <div className="bg-gray-50/90 p-5 sm:p-6 rounded-3xl border border-gray-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider">
                    Product Image
                  </label>
                  <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs font-bold w-fit">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-3 py-1 rounded-lg transition-colors ${uploadMode === 'file' ? 'bg-green-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`px-3 py-1 rounded-lg transition-colors ${uploadMode === 'url' ? 'bg-green-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white shrink-0 border-2 border-gray-200 flex items-center justify-center shadow-sm relative">
                    {image ? (
                      <img 
                        src={image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300/15803d/ffffff?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-xs text-gray-400 font-bold gap-1">
                        <ImageIcon size={24} />
                        <span>No Image</span>
                      </div>
                    )}
                    {badge && (
                      <span className="absolute top-1.5 left-1.5 bg-green-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm">
                        {badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    {uploadMode === 'file' ? (
                      <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all text-center ${uploading ? 'border-gray-300 bg-gray-50 cursor-wait' : 'border-green-300 bg-white hover:bg-green-50/60'}`}>
                        <Upload size={20} className={`mb-1 ${uploading ? 'text-gray-400 animate-pulse' : 'text-green-800'}`} />
                        <span className="text-xs font-bold text-gray-900">
                          {uploading ? 'Uploading...' : 'Click to choose image file'}
                        </span>
                        <span className="text-[10px] text-gray-500">PNG, JPG, WEBP (Max 5MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                      />
                    )}

                    {uploadError && (
                      <p className="text-[11px] font-semibold text-red-600">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cold Pressed Coconut Oil"
                  className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm leading-relaxed"
                />
              </div>

              {/* ✅ NEW: Nutrition Section - User Friendly */}
              <div className="bg-green-50/70 p-5 rounded-3xl border border-green-200/80">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-green-700" />
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider">
                    Nutrition Information (per 100g)
                  </label>
                  <span className="text-[10px] text-gray-500 ml-auto">Enter numbers only</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {/* Calories */}
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 mb-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      Calories
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      placeholder="884"
                      className="w-full bg-white px-3 py-2 rounded-xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                    />
                    <span className="text-[8px] text-gray-400">kcal</span>
                  </div>

                  {/* Protein */}
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 mb-1">
                      <Beef className="w-3 h-3 text-red-500" />
                      Protein
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white px-3 py-2 rounded-xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                    />
                    <span className="text-[8px] text-gray-400">g</span>
                  </div>

                  {/* Carbs */}
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 mb-1">
                      <Wheat className="w-3 h-3 text-yellow-600" />
                      Carbs
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white px-3 py-2 rounded-xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                    />
                    <span className="text-[8px] text-gray-400">g</span>
                  </div>

                  {/* Fat */}
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 mb-1">
                      <Droplet className="w-3 h-3 text-blue-500" />
                      Fat
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white px-3 py-2 rounded-xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                    />
                    <span className="text-[8px] text-gray-400">g</span>
                  </div>

                  {/* Fiber */}
                  <div>
                    <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 mb-1">
                      <Apple className="w-3 h-3 text-green-500" />
                      Fiber
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={fiber}
                      onChange={(e) => setFiber(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white px-3 py-2 rounded-xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                    />
                    <span className="text-[8px] text-gray-400">g</span>
                  </div>
                </div>

                {/* Nutrition Preview */}
                {(calories || protein || carbs || fat || fiber) && (
                  <div className="mt-3 p-2 bg-white/80 rounded-xl border border-green-200/60">
                    <p className="text-[10px] font-semibold text-gray-600">
                      <span className="text-green-700">Preview:</span>{' '}
                      {calories && `${calories} kcal`} {protein && `• Protein: ${protein}g`} {carbs && `• Carbs: ${carbs}g`} {fat && `• Fat: ${fat}g`} {fiber && `• Fiber: ${fiber}g`}
                    </p>
                  </div>
                )}
              </div>

              {/* Category, Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm cursor-pointer"
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="180"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 0 || e.target.value === '') {
                        setStock(e.target.value);
                      }
                    }}
                    placeholder="30"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Unit & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Unit Size *</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="1 Litre"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Badge (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="BEST SELLER"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-2xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-green-900 text-white px-8 py-3.5 rounded-2xl text-xs font-extrabold shadow-md hover:bg-green-950 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={16} className="text-amber-400" />
                  <span>{uploading ? 'Uploading...' : 'Save Product'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;