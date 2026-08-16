// pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Lock, 
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { reduceStock } from '../../services/productService';
import { createOrder } from '../../services/orderService12';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  React.useEffect(() => {
    if (user) {
      const addr = user.address || {};
      setFormData(prev => ({
        ...prev,
        name: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : prev.name),
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: typeof user.address === 'string' ? user.address : (addr.street || prev.address),
        city: typeof user.address === 'object' ? (addr.city || prev.city) : (user.city || prev.city),
        pincode: typeof user.address === 'object' ? (addr.pincode || prev.pincode) : (user.pincode || prev.pincode),
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsToOrder = cartItems.length > 0 ? cartItems : (() => {
      try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
      } catch (err) { return []; }
    })();

    if (!itemsToOrder || itemsToOrder.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checking out.');
      return;
    }

    const orderId = `JM-${Date.now().toString().slice(-6)}`;

    // Format items to match MongoDB orderSchema
    const formattedItems = itemsToOrder.map(item => ({
      product: item._id || item.id || item.product || undefined,
      name: item.name || 'Organic Product',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0
    }));

    const calculatedTotal = formattedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const shippingAddress = {
      name: formData.name,
      street: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      phone: formData.phone
    };

    const orderPayload = {
      id: orderId,
      items: formattedItems,
      total: cartTotal || calculatedTotal,
      shippingAddress,
      customer: formData,
      paymentMethod: (formData.paymentMethod && ['card', 'upi', 'cod'].includes(formData.paymentMethod)) ? formData.paymentMethod : 'cod',
      date: new Date().toISOString(),
      status: 'pending',
    };

    const createdOrder = await createOrder(orderPayload);

    setPlacedOrderId(createdOrder?.id || orderId);
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-card border border-brand-border/80 p-8 sm:p-14 max-w-lg w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest bg-brand-secondary px-3.5 py-1 rounded-full border border-brand-border/60">
            Order #{placedOrderId} Confirmed
          </span>
          <h2 className="text-3xl font-display font-extrabold text-brand-dark mt-4">
            Thank You For Your Order! 🎉
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mt-3">
            We have received your order for cold-pressed organic products. A confirmation copy has been generated and dispatched to <strong className="text-brand-dark">{formData.email}</strong>.
          </p>

          <div className="mt-8 p-4 bg-brand-light rounded-2xl border border-brand-border text-xs font-semibold text-brand-dark flex items-center justify-around">
            <div>
              <div className="text-muted-foreground">Estimated Delivery:</div>
              <div className="font-extrabold text-brand-primary mt-0.5">2 - 3 Business Days</div>
            </div>
            <div className="h-8 w-px bg-brand-border" />
            <div>
              <div className="text-muted-foreground">Payment Method:</div>
              <div className="font-extrabold uppercase mt-0.5">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 bg-brand-primary text-white font-bold py-3.5 rounded-2xl text-xs hover:bg-brand-dark shadow-md shadow-brand-primary/20 transition-all text-center"
            >
              Back to Home
            </Link>
            <Link
              to="/products"
              className="flex-1 bg-brand-secondary text-brand-dark font-bold py-3.5 rounded-2xl text-xs hover:bg-brand-border transition-all text-center border border-brand-border/80"
            >
              Shop More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 text-xs font-bold">
          <div className="flex items-center gap-2 text-brand-primary">
            <span className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-black">1</span>
            <span>Delivery Info</span>
          </div>
          <div className="h-0.5 flex-1 bg-brand-border mx-4" />
          <div className="flex items-center gap-2 text-brand-dark">
            <span className="w-7 h-7 rounded-full bg-brand-secondary text-brand-dark flex items-center justify-center text-xs font-black">2</span>
            <span>Payment</span>
          </div>
          <div className="h-0.5 flex-1 bg-brand-border mx-4" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-black">3</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-card border border-brand-border/80 p-6 sm:p-10">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-dark mb-2">
                Shipping & Customer Details
              </h1>
              <p className="text-xs text-muted-foreground font-medium mb-8">
                Please provide your contact and delivery address to complete your order.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anbu Selvan"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brand-border bg-brand-light text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="anbu@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brand-border bg-brand-light text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brand-border bg-brand-light text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="6-digit Pincode"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-border bg-brand-light text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4.5 w-4 h-4 text-muted-foreground" />
                    <textarea
                      required
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Door No., Street name, Area, City"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brand-border bg-brand-light text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-4 border-t border-brand-border/60">
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-3">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'border-brand-primary bg-brand-secondary/40 shadow-sm'
                          : 'border-brand-border bg-white hover:bg-brand-light'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => {}}
                        className="text-brand-primary"
                      />
                      <div>
                        <div className="font-bold text-xs text-brand-dark">Cash on Delivery (COD)</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Pay in cash when order arrives</div>
                      </div>
                    </label>

                    <label
                      onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                        formData.paymentMethod === 'online'
                          ? 'border-brand-primary bg-brand-secondary/40 shadow-sm'
                          : 'border-brand-border bg-white hover:bg-brand-light'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'online'}
                        onChange={() => {}}
                        className="text-brand-primary"
                      />
                      <div>
                        <div className="font-bold text-xs text-brand-dark">UPI / Credit / Debit Card</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Instant online payment gateway</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand-primary text-white font-extrabold rounded-2xl shadow-green-lg hover:bg-brand-dark transition-all text-sm flex items-center justify-center gap-2 mt-8"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Place Order • ₹{cartTotal.toFixed(2)}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-card border border-brand-border/80 p-6 sm:p-8 sticky top-28 space-y-6">
              <h2 className="text-lg font-display font-extrabold text-brand-dark border-b border-brand-border/60 pb-3">
                Order Review ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-brand-border/40">
                    <div className="pr-2">
                      <div className="font-bold text-brand-dark">{item.name}</div>
                      <div className="text-muted-foreground text-[11px]">Qty: {item.quantity} × ₹{item.price}</div>
                    </div>
                    <div className="font-extrabold text-brand-dark">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-2 text-xs font-semibold">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-dark">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="pt-3 border-t border-brand-border/80 flex justify-between text-sm font-black text-brand-dark">
                  <span>Final Total</span>
                  <span className="text-brand-primary text-lg">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-brand-light rounded-2xl border border-brand-border/80 space-y-2 text-[11px] font-semibold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>100% Organic Quality Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>Tamil Nadu Direct Express Transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;