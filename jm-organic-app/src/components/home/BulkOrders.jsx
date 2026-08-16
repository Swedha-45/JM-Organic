// components/home/BulkOrders.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BulkOrders = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-green-800 to-green-900 text-white p-10 md:p-14 flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-lg">
            <span className="text-yellow-400 text-xs font-bold tracking-wide uppercase">
              For Restaurants &amp; Retailers
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-3">
              Bulk Orders: 5L to 100L
            </h2>
            <p className="text-white/80 mt-3 text-sm">
              Save up to 18% on bulk coconut oil orders. Dedicated account
              manager, flexible delivery, and GST invoicing included.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                18%
              </div>
              <div className="text-xs text-white/70 uppercase tracking-wide mt-1">
                Max Savings
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                100L
              </div>
              <div className="text-xs text-white/70 uppercase tracking-wide mt-1">
                Max Order
              </div>
            </div>
            <Link
              to="/bulk-orders"
              className="flex items-center gap-2 rounded-full bg-yellow-400 text-green-900 px-6 py-3 font-semibold hover:bg-yellow-300 transition-all"
            >
              Get Bulk Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkOrders;