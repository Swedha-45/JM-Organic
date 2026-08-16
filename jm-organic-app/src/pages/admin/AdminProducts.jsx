import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { getAllProductsAsync, addProduct, updateProduct, deleteProduct } from '../../services/productService';
import { autoTranslateToTamil } from '../../utils/tamilTranslator';

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
      setImage(uploadEvent.target.result);
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
    setImage('https://images.unsplash.com/photo-1611171711912-3c9d1ce8d0f5?w=800&q=80');
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

    // Auto-generate Tamil fallback translations for user frontend i18n
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

      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Catalog & Stock Management</h2>
          
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-950 transition-all shadow-md"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>

        <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-brand-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {['Product Name', 'Category', 'Price', 'Unit', 'Stock', 'Badge', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-emerald-100 shrink-0" />
                        <div>
                          <div className="font-extrabold text-foreground text-xs">{p.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-muted-foreground">{p.category}</td>
                    <td className="px-5 py-4 text-xs font-black text-emerald-900">₹{p.price}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{p.unit}</td>
                    <td className="px-5 py-4 text-xs">
                      {p.stock === 0 ? (
                        <span className="text-red-600 font-extrabold">Out of Stock</span>
                      ) : (
                        <span className="text-foreground font-bold">{p.stock} units</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                        {p.badge || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-muted-foreground hover:text-emerald-900 transition-colors p-1"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 size={15} />
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

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-display font-extrabold text-emerald-950 mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo Upload & Preview Section */}
              <div className="bg-[#E4ECE3] p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-emerald-950 uppercase tracking-wider">Product Media / Photo *</label>
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

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-emerald-300 flex items-center justify-center shadow-sm">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-xs text-gray-400 font-bold">
                        <ImageIcon size={20} />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {uploadMode === 'file' ? (
                      <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-emerald-400 bg-white rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors">
                        <Upload size={18} className="text-emerald-800 mb-1" />
                        <span className="text-xs font-bold text-emerald-900">Click to choose image file from media</span>
                        <span className="text-[9px] text-muted-foreground">PNG, JPG, WEBP or GIF</span>
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
                        className="w-full bg-white px-3 py-2 rounded-xl text-xs font-semibold text-emerald-950 border border-emerald-200 outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cold Pressed Coconut Oil"
                  className="w-full bg-[#E4ECE3] px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Traditionally cold-pressed organic coconut oil..."
                  className="w-full bg-[#E4ECE3] px-3 py-2 rounded-xl text-xs font-semibold text-emerald-950 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Nutrition Facts & Benefits</label>
                <input
                  type="text"
                  value={nutrition}
                  onChange={(e) => setNutrition(e.target.value)}
                  placeholder="Energy: 884 kcal, Lauric Acid: 51.2%, Trans Fat: 0g"
                  className="w-full bg-[#E4ECE3] px-3 py-2 rounded-xl text-xs font-semibold text-emerald-950 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#E4ECE3] px-2 py-2 rounded-xl text-xs font-bold text-emerald-950 outline-none"
                  >
                    <option value="Oils">Oils</option>
                    <option value="Fresh Coconuts">Fresh Coconuts</option>
                    <option value="Bulk Orders">Bulk Orders</option>
                    <option value="Staples">Staples</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#E4ECE3] px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-[#E4ECE3] px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Unit Size</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="1 Litre"
                    className="w-full bg-[#E4ECE3] px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="BEST SELLER"
                    className="w-full bg-[#E4ECE3] px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-900 text-white py-3 rounded-full text-xs font-extrabold shadow-md hover:bg-emerald-950 transition-all mt-4"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;