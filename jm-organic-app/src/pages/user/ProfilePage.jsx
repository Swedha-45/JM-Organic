// pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Award,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Star,
  User,
  Package,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI } from '../../services/api';

const ProfilePage = () => {
  const { user: currentUser, logout, updateProfile, isAuthenticated: userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Form states for profile editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // ✅ Load user data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const address = currentUser.address || {};
      setFormData({
        firstName: currentUser.name ? currentUser.name.split(' ')[0] : (currentUser.firstName || ''),
        lastName: currentUser.name ? currentUser.name.split(' ').slice(1).join(' ') : (currentUser.lastName || ''),
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: typeof address === 'string' ? address : (address.street || ''),
        city: typeof address === 'object' ? (address.city || '') : (currentUser.city || ''),
        state: typeof address === 'object' ? (address.state || '') : (currentUser.state || ''),
        pincode: typeof address === 'object' ? (address.pincode || '') : (currentUser.pincode || '')
      });
    }
  }, [currentUser]);

  // ✅ Fetch orders from backend
  const fetchUserOrders = useCallback(async () => {
    if (!currentUser?.email) {
      setUserOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);
    setError(null);

    try {
      console.log('🔍 Fetching orders for user:', currentUser.email);

      // ✅ Get orders from backend
      const response = await orderAPI.getAll();
      console.log('📦 Orders API response:', response);

      const orders = response.orders || [];

      // ✅ Filter orders by user email (check multiple fields)
      const userEmail = currentUser.email.toLowerCase();
      const filteredOrders = orders.filter(order => {
        const orderEmail = order.user?.email?.toLowerCase() ||
          order.email?.toLowerCase() ||
          order.shippingAddress?.email?.toLowerCase() ||
          '';
        return orderEmail === userEmail;
      });

      console.log('✅ Filtered orders:', filteredOrders.length);
      setUserOrders(filteredOrders);

    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [currentUser]);

  // ✅ Load orders on mount
  useEffect(() => {
    if (userLoggedIn && currentUser) {
      fetchUserOrders();
    }
  }, [userLoggedIn, currentUser, fetchUserOrders]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveMessage({ type: '', text: '' });
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      // ✅ Update profile with full address
      await updateProfile({
        name: fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      });

      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });

      // ✅ Refresh orders after profile update
      setTimeout(fetchUserOrders, 1000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  if (!userLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F3F7F2] flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border shadow-md max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🌿
          </div>
          <h2 className="text-2xl font-display font-extrabold text-emerald-950">Sign In Required</h2>
          <p className="text-xs text-gray-500 mt-2">
            Please log in to access your personal profile and order history.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-6 bg-emerald-900 text-white py-3 rounded-full text-xs font-bold shadow-md hover:bg-emerald-950 transition-all"
          >
            Go to Sign In →
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = `${formData.firstName} ${formData.lastName}`.trim() || currentUser?.email?.split('@')[0] || 'User';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total || o.amount) || 0), 0);
  const rewardPoints = Math.floor(totalSpent / 10);

  // ✅ Get latest order for address
  const latestOrder = userOrders.length > 0 ? userOrders[0] : null;
  const latestAddress = latestOrder?.shippingAddress || latestOrder?.customer?.address || {};

  return (
    <div className="min-h-screen bg-[#F3F7F2] py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">

        {/* Header User Banner */}
        <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-900 text-amber-400 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md border-4 border-emerald-100 shrink-0">
                {avatarInitial}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                    {displayName}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>Organic Club Member</span>
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  {formData.email || 'Email not set'} • {formData.phone || 'Phone not set'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-800 mt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Buyer
                  </span>
                  <span>•</span>
                  <span>{rewardPoints} Rewards Points</span>
                  <span>•</span>
                  <span>{userOrders.length} Orders</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchUserOrders}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold transition"
                title="Refresh Orders"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar Navigation Pills */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-3xl border p-3 shadow-md">
              {[
                { id: 'orders', icon: ShoppingBag, label: 'My Orders' },
                { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
                { id: 'rewards', icon: Award, label: 'Organic Rewards' },
                { id: 'settings', icon: User, label: 'Account Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === tab.id
                      ? 'bg-emerald-900 text-white shadow-sm'
                      : 'text-emerald-950 hover:bg-emerald-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Main Tab Content */}
          <div className="lg:col-span-9">

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-emerald-950">Recent Order History</h2>
                  <span className="text-xs font-bold text-gray-500">{userOrders.length} Orders</span>
                </div>

                {loadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <p className="text-xs text-gray-500 mt-2">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
                    <p className="text-red-600 text-sm font-bold">❌ {error}</p>
                    <button
                      onClick={fetchUserOrders}
                      className="mt-4 px-6 py-2 rounded-full bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-950 transition"
                    >
                      Try Again
                    </button>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl border p-12 text-center shadow-md">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto mb-4 text-2xl">
                      📦
                    </div>
                    <h3 className="text-base font-bold text-emerald-950">No Orders Placed Yet</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Explore our 100% natural, cold-pressed oils and coconut products to place your first order.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="mt-6 px-6 py-2.5 rounded-full bg-emerald-900 text-white text-xs font-bold shadow-md hover:bg-emerald-950 transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order._id || order.id}
                        className="bg-white rounded-3xl border p-6 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                          <div>
                            <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
                              #{order._id?.slice(-6).toUpperCase() || order.id}
                            </span>
                            <div className="text-[11px] text-gray-500 mt-2 font-medium">
                              {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-black text-emerald-950">₹{order.total}</div>
                            <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mt-1 ${order.status === 'delivered' || order.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                              {order.status || 'Processing'}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="pt-4 space-y-3">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-100">
                                  {item.quantity}x
                                </div>
                                <span className="font-bold text-emerald-950">{item.name || 'Organic Product'}</span>
                              </div>
                              <span className="font-semibold text-gray-500">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-emerald-950">Saved Delivery Addresses</h2>

                {userOrders.length > 0 && latestAddress ? (
                  <div className="bg-white rounded-3xl border p-6 shadow-md relative">
                    <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                      LATEST ORDER
                    </span>
                    <div className="font-bold text-sm text-emerald-950">
                      {latestAddress.name || displayName}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 leading-relaxed space-y-1">
                      <p>{latestAddress.street || latestAddress.address || formData.address || 'No street address'}</p>
                      <p>{latestAddress.city || formData.city || 'City'}, {latestAddress.state || formData.state || 'State'}</p>
                      <p>Pincode: {latestAddress.pincode || formData.pincode || 'Not set'}</p>
                      <p>Phone: {latestAddress.phone || formData.phone || 'Not set'}</p>
                    </div>
                  </div>
                ) : formData.address || formData.city ? (
                  <div className="bg-white rounded-3xl border p-6 shadow-md">
                    <div className="font-bold text-sm text-emerald-950">{displayName}</div>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <p>{formData.address || 'No street address'}</p>
                      <p>{formData.city || 'City'}, {formData.state || 'State'}</p>
                      <p>Pincode: {formData.pincode || 'Not set'}</p>
                      <p>Phone: {formData.phone || 'Not set'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border p-12 text-center text-xs text-gray-500">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No saved addresses found.</p>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="mt-4 px-6 py-2 rounded-full bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-950 transition"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-800 to-green-900 text-white p-8 rounded-3xl shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">Your Rewards Balance</span>
                  <div className="text-4xl font-black mt-1">{rewardPoints} Points</div>
                  <p className="text-xs text-emerald-100/90 mt-2">Earn 1 point for every ₹10 spent on JM Organic products.</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-md">
                <h2 className="text-xl font-extrabold text-emerald-950 mb-6">Account Settings</h2>

                {saveMessage.text && (
                  <div className={`p-4 mb-4 rounded-2xl text-xs font-bold ${saveMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                    }`}>
                    {saveMessage.text}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Not set"
                        className="w-full bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Not set"
                        className="w-full bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-gray-100 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950/70 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Not set"
                      className="w-full bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Not set"
                      className="w-full bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Not set"
                        className="w-full bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Not set"
                        className="w-full bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-500 uppercase mb-1">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Not set"
                      className="w-full bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold text-emerald-950 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-emerald-900 text-white px-6 py-3 rounded-full text-xs font-extrabold shadow-md hover:bg-emerald-950 transition-all mt-4 disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;