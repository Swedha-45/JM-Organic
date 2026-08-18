// pages/user/BulkOrderPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Users,
  FileCheck,
  Truck,
  FlaskConical,
  ChevronDown,
  Star,
  Package,
  Phone,
  Mail
} from 'lucide-react';
import { productAPI } from '../../services/api';

const PRICING_TIERS = [
  { range: '5L – 15L', discount: '5% off', note: 'Great for small restaurants & cafes' },
  { range: '16L – 35L', discount: '10% off', note: 'Popular with mid-size kitchens' },
  { range: '36L – 60L', discount: '15% off', note: 'Best for hotels & catering' },
  { range: '61L – 100L', discount: '18% off', note: 'Distributors & large retailers' },
];

const BENEFITS = [
  {
    icon: Users,
    title: 'Dedicated Account Manager',
    desc: 'One point of contact for every order, reorder, and query — no call centers.',
  },
  {
    icon: FileCheck,
    title: 'GST Invoicing, Every Order',
    desc: 'Proper tax invoices generated automatically, ready for your books.',
  },
  {
    icon: Truck,
    title: 'Flexible Delivery Windows',
    desc: 'Same-day dispatch in Tamil Nadu, scheduled recurring drops available.',
  },
  {
    icon: FlaskConical,
    title: 'Lab-Tested Every Batch',
    desc: 'FSSAI certified purity testing on every bulk batch before it ships.',
  },
];

const FAQS = [
  {
    q: 'What is the minimum bulk order quantity?',
    a: 'Bulk pricing starts at 5 litres (or the equivalent unit for non-oil products). Below that, our standard retail pricing applies.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Same-day dispatch for orders within Tamil Nadu. Outside Tamil Nadu, expect 2–4 business days depending on quantity and location.',
  },
  {
    q: 'Can I set up recurring monthly orders?',
    a: 'Yes — your account manager can set up a recurring schedule so you never have to re-order manually.',
  },
  {
    q: 'Do you provide GST invoices?',
    a: 'Every bulk order comes with a proper GST invoice automatically, no separate request needed.',
  },
  {
    q: "What's your return policy on bulk orders?",
    a: 'If a batch fails quality inspection on arrival, we replace it free of charge — just contact your account manager within 48 hours.',
  },
];

const FaqItem = ({ faq, isOpen, onToggle }) => (
  <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-6 py-5 text-left"
    >
      <span className="font-semibold text-gray-800 pr-4">{faq.q}</span>
      <ChevronDown
        className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
    {isOpen && (
      <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
        {faq.a}
      </div>
    )}
  </div>
);

const BulkOrderPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    productId: '',
    quantity: '',
    message: '',
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        const activeProducts = (response.products || []).filter(p => p.stock > 0);
        setProducts(activeProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requests = JSON.parse(localStorage.getItem('jm_bulk_requests') || '[]');
    const selectedProduct = products.find(p => p._id === form.productId || p.id === form.productId);
    
    const bulkOrderEntry = {
      id: `BQ-${Math.floor(100000 + Math.random() * 900000)}`,
      businessName: form.businessName,
      contactName: form.contactName,
      customer: form.contactName,
      email: form.email,
      phone: form.phone,
      city: form.city,
      productId: form.productId,
      productName: selectedProduct?.name || 'Bulk Organic Produce',
      quantity: Number(form.quantity || 10),
      message: form.message,
      isBulk: true,
      type: 'bulk',
      status: 'pending',
      total: Number(form.quantity || 10) * (selectedProduct?.price || 180),
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [bulkOrderEntry, ...requests];
    localStorage.setItem('jm_bulk_requests', JSON.stringify(updatedRequests));

    // Emit event for real-time dashboard listeners
    window.dispatchEvent(new Event('bulkOrderSubmitted'));

    try {
      const { orderAPI } = await import('../../services/api');
      await orderAPI.create({
        items: [{
          name: `[BULK ORDER] ${bulkOrderEntry.productName} (${form.businessName})`,
          quantity: Number(form.quantity || 10),
          price: selectedProduct?.price || 180,
          product: selectedProduct?._id
        }],
        shippingAddress: {
          name: `${form.contactName} (${form.businessName})`,
          phone: form.phone,
          street: `${form.city} - Notes: ${form.message || 'No extra notes'}`
        },
        paymentMethod: 'cod',
        notes: `BULK QUOTE: ${form.businessName} - ${form.city} - Qty: ${form.quantity}L`
      });
    } catch (apiErr) {
      console.warn('API bulk order sync skipped (using local backup):', apiErr);
    }

    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <span className="text-yellow-400 text-xs font-bold tracking-wide uppercase">
            For Restaurants, Hotels &amp; Retailers
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 max-w-2xl">
            Wholesale organic, without the wholesale hassle.
          </h1>
          <p className="text-white/80 mt-4 max-w-xl text-lg">
            Save up to 18% on bulk orders from 5L to 100L, with a dedicated
            account manager and GST invoicing on every order.
          </p>

          <div className="flex flex-wrap gap-8 mt-10">
            {[
              ['24+', 'Partner Farms'],
              ['18%', 'Max Bulk Savings'],
              ['2-Day', 'Delivery Across TN'],
              ['500+', 'Business Customers'],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-yellow-400">
                  {value}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wide mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why bulk with us */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Why businesses order bulk from JM Organic
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-3xl bg-white shadow-sm p-7 border border-gray-100"
              >
                <span className="h-11 w-11 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-green-700" />
                </span>
                <h3 className="font-semibold text-gray-800">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Simple, transparent bulk pricing
          </h2>
          <p className="text-gray-500 text-center mt-3 max-w-lg mx-auto">
            The more you order, the more you save — no negotiation needed.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {PRICING_TIERS.map((tier, i) => (
              <div
                key={tier.range}
                className={`rounded-3xl p-7 ${
                  i === PRICING_TIERS.length - 1
                    ? 'bg-green-800 text-white'
                    : 'bg-white shadow-sm text-gray-800'
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    i === PRICING_TIERS.length - 1
                      ? 'text-white/70'
                      : 'text-gray-500'
                  }`}
                >
                  {tier.range}
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    i === PRICING_TIERS.length - 1 ? 'text-yellow-400' : 'text-green-700'
                  }`}
                >
                  {tier.discount}
                </p>
                <p
                  className={`text-sm mt-3 leading-relaxed ${
                    i === PRICING_TIERS.length - 1
                      ? 'text-white/70'
                      : 'text-gray-500'
                  }`}
                >
                  {tier.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="rounded-3xl bg-white shadow-sm p-12 text-center">
                  <span className="h-14 w-14 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto mb-5">
                    <Check className="w-6 h-6" />
                  </span>
                  <h2 className="font-bold text-2xl text-gray-800">
                    Quote request received
                  </h2>
                  <p className="text-gray-500 mt-3 max-w-sm mx-auto">
                    Our bulk orders team will reach out within 1 business day
                    with your personalized quote.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 mt-8 text-green-700 font-semibold hover:underline"
                  >
                    Continue browsing products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-3xl bg-white shadow-sm p-8 md:p-10"
                >
                  <h2 className="font-bold text-2xl text-gray-800 mb-1">
                    Request a Bulk Quote
                  </h2>
                  <p className="text-gray-500 mb-8">
                    Tell us what you need — we'll get back with pricing
                    within one business day.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm text-gray-500 block mb-1.5">
                        Business Name *
                      </label>
                      <input
                        required
                        value={form.businessName}
                        onChange={handleChange('businessName')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1.5">
                        Contact Name *
                      </label>
                      <input
                        required
                        value={form.contactName}
                        onChange={handleChange('contactName')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange('email')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1.5">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange('phone')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1.5">
                        City *
                      </label>
                      <input
                        required
                        value={form.city}
                        onChange={handleChange('city')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-1.5">
                        Product *
                      </label>
                      <select
                        required
                        value={form.productId}
                        onChange={handleChange('productId')}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.unit || '1L'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-sm text-gray-500 block mb-1.5">
                      Estimated Monthly Quantity (L) *
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      required
                      value={form.quantity}
                      onChange={handleChange('quantity')}
                      placeholder="e.g. 50"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="text-sm text-gray-500 block mb-1.5">
                      Anything else we should know?
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={handleChange('message')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-8 w-full sm:w-auto rounded-full bg-green-700 text-white px-10 py-3.5 font-semibold hover:bg-green-800 transition-colors"
                  >
                    Request Quote
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="rounded-3xl bg-white shadow-sm p-8 h-fit lg:sticky lg:top-24 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6">
                What happens next
              </h3>
              <div className="space-y-6">
                {[
                  ['1', 'You submit your quote request', 'Takes under 2 minutes'],
                  ['2', 'Your account manager calls you', 'Within 1 business day'],
                  ['3', 'You get a custom quote', 'Based on volume & location'],
                  ['4', 'First delivery scheduled', 'Same-day dispatch in TN'],
                ].map(([num, title, sub]) => (
                  <div key={num} className="flex gap-4">
                    <span className="h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0 text-sm">
                      {num}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>bulk@jmorganic.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkOrderPage;