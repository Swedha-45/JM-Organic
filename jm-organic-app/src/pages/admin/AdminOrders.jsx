import React, { useState, useEffect, useMemo } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import { getAllOrdersAsync } from '../../services/orderService12';

const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const loadOrders = async () => {
      const data = await getAllOrdersAsync();
      setOrders(data);
    };
    loadOrders();
  }, []);

  const formattedOrders = useMemo(() => {
    return orders.map((o) => {
      let custName = 'Customer';
      if (typeof o.customer === 'string') custName = o.customer;
      else if (o.customer && typeof o.customer === 'object') {
        custName = o.customer.name || o.customer.email || 'Customer';
      }

      let itemsSummary = '';
      if (typeof o.items === 'string') itemsSummary = o.items;
      else if (Array.isArray(o.items)) {
        itemsSummary = o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ');
      }

      const amt = Number(o.total || o.amount || o.totalAmount) || 0;
      const d = o.date ? new Date(o.date).toLocaleDateString() : 'Today';
      const st = (o.status || o.orderStatus || 'pending').toLowerCase();

      return {
        id: o.id || o.orderId || 'JM-001',
        customer: custName,
        items: itemsSummary || 'Organic Produce',
        amount: amt,
        date: d,
        status: st,
      };
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return formattedOrders;
    return formattedOrders.filter((o) => o.status.toLowerCase() === activeFilter.toLowerCase());
  }, [formattedOrders, activeFilter]);

  return (
    <div>
      <AdminPageHeader title="Orders" />

      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-foreground">Order Management</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground/70 hover:bg-secondary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-primary font-semibold">{order.id}</td>
                    <td className="px-5 py-4 font-semibold text-foreground text-xs">{order.customer}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground max-w-xs truncate">{order.items}</td>
                    <td className="px-5 py-4 font-bold text-foreground text-xs">₹{order.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{order.date}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button className="text-xs font-semibold text-primary hover:underline">View →</button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No orders found with status "{activeFilter}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
