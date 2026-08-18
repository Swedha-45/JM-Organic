import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { getAllProductsAsync, addProduct, updateProduct, deleteProduct } from '../../services/productService';
import { autoTranslateToTamil } from '../../utils/tamilTranslator';

const PRESET_IMAGES = [
  { name: 'Coconut Oil', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80' },
  { name: 'Virgin Coconut Oil', url: 'https://images.unsplash.com/photo-1620756236360-4a70a1623936?w=800&q=80' },
  { name: 'Tender Coconut', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80' },
  { name: 'Groundnuts', url: 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=800&q=80' },
  { name: 'Turmeric Powder', url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80' },
  { name: 'Brown Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80' }
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states (Clean English Inputs Only)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nutrition, setNutrition] = useState('');
  const [category, setCategory] = useState('Oils');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('1 Litre');
  const [stock, setStock] = useState('');
  const [badge, setBadge] = useState('PURE');
  const [image, setImage] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'

  const loadProducts = async () => {
    const list = await getAllProductsAsync();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
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
        setImage(compressedBase64);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDescription('Traditionally cold-pressed from farm-fresh produce — 100% pure and chemical free.');
    setNutrition('Energy: 884 kcal, Lauric Acid: 51.2%, Trans Fat: 0g');
    setCategory('Oils');
    setPrice('180');
    setUnit('1 Litre');
    setStock('30');
    setBadge('NEW');
    setImage('https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80');
    setUploadMode('file');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || '');
    setNutrition(p.nutrition || '');
    setCategory(p.category || 'Oils');
    setPrice(String(p.price));
    setUnit(p.unit || '1 Litre');
    setStock(String(p.stock || 0));
    setBadge(p.badge || 'PURE');
    setImage(p.image || '');
    setUploadMode('file');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const tamilName = autoTranslateToTamil(name);
    const tamilDescription = autoTranslateToTamil(description);
    const nutritionTa = autoTranslateToTamil(nutrition);

    const payload = {
      name,
      tamilName,
      nameTa: tamilName,
      description,
      tamilDescription,
      descriptionTa: tamilDescription,
      nutrition,
      nutritionTa,
      category,
      price: Number(price),
      unit,
      stock: Number(stock),
      badge,
      image,
      tags: ['Cold Pressed', 'Organic'],
      rating: 5.0,
      reviewCount: 1
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await addProduct(payload);
    }

    await loadProducts();
    setShowModal(false);
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
                        <img src={p.image} alt={p.name} className="w-11 h-11 rounded-2xl object-cover bg-green-50 shrink-0 border border-gray-200" />
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
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-900 text-[10px] font-black uppercase">
                        {p.badge || 'ACTIVE'}
                      </span>
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

      {/* Spacious & Comfortable Add / Edit Product Modal */}
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
                  Update inventory catalog parameters comfortable and spacious below.
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

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="space-y-6 pt-6 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              
              {/* Photo Upload & Preview Card */}
              <div className="bg-gray-50/90 p-5 sm:p-6 rounded-3xl border border-gray-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-black text-gray-800 uppercase tracking-wider">
                    Product Media / Photo *
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
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
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
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-green-300 bg-white rounded-2xl cursor-pointer hover:bg-green-50/60 transition-all text-center">
                        <Upload size={20} className="text-green-800 mb-1" />
                        <span className="text-xs font-bold text-gray-900">Click to choose image file from device</span>
                        <span className="text-[10px] text-gray-500">PNG, JPG, WEBP or GIF</span>
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
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white px-4 py-3 rounded-2xl text-xs font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                      />
                    )}

                    {/* Presets */}
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                        Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setImage(preset.url)}
                            className="text-[11px] font-bold text-green-900 bg-white border border-green-200 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                          >
                            + {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Field */}
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

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Traditionally cold-pressed from farm-fresh produce — 100% pure and chemical free."
                  className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm leading-relaxed"
                />
              </div>

              {/* Nutrition Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nutrition Facts & Benefits</label>
                <input
                  type="text"
                  value={nutrition}
                  onChange={(e) => setNutrition(e.target.value)}
                  placeholder="Energy: 884 kcal, Lauric Acid: 51.2%, Trans Fat: 0g"
                  className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                />
              </div>

              {/* Grid 1: Category, Price, Stock */}
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
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="180"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Stock Qty *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="30"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-bold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Grid 2: Unit Size & Badge */}
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Badge Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="BEST SELLER"
                    className="w-full bg-white px-4 py-3 rounded-2xl text-sm font-semibold text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Form Action Footer */}
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
                  className="bg-green-900 text-white px-8 py-3.5 rounded-2xl text-xs font-extrabold shadow-md hover:bg-green-950 transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} className="text-amber-400" />
                  <span>Save Product</span>
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