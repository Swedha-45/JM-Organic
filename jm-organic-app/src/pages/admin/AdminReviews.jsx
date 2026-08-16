// pages/admin/AdminReviews.jsx
import React, { useEffect, useState } from 'react';
import { Star, Check, X, Home, Trash2 } from 'lucide-react';
import {
  getAllReviews,
  approveReview,
  rejectReview,
  toggleFeature,
  deleteReview,
} from '../../services/reviewService';

const STATUS_STYLES = {
  pending: 'bg-accent/20 text-accent',
  approved: 'bg-primary/10 text-primary',
  rejected: 'bg-red-100 text-red-600',
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('pending');

  const refresh = () => setReviews(getAllReviews());

  useEffect(refresh, []);

  const visibleReviews =
    filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);

  const handleApprove = (id, feature) => {
    approveReview(id, feature);
    refresh();
  };

  const handleReject = (id) => {
    rejectReview(id);
    refresh();
  };

  const handleToggleFeature = (id) => {
    toggleFeature(id);
    refresh();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this review permanently?')) {
      deleteReview(id);
      refresh();
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Reviews
          </h1>
          <p className="text-muted-foreground mt-1">
            {pendingCount} review{pendingCount !== 1 && 's'} awaiting approval
          </p>
        </div>

        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {visibleReviews.length === 0 ? (
          <div className="rounded-3xl bg-card shadow-card p-10 text-center text-muted-foreground">
            No {filter !== 'all' ? filter : ''} reviews.
          </div>
        ) : (
          visibleReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl bg-card shadow-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={review.avatar}
                    alt={review.customerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">
                        {review.customerName}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          STATUS_STYLES[review.status]
                        }`}
                      >
                        {review.status}
                      </span>
                      {review.featuredOnHome && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-accent">
                          <Home className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {review.productName}
                    </p>
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground mt-3 max-w-xl">
                      "{review.quote}"
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        className="flex items-center gap-1.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground px-3 py-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        className="flex items-center gap-1.5 text-xs font-semibold rounded-full bg-accent text-accent-foreground px-3 py-1.5"
                      >
                        <Home className="w-3.5 h-3.5" />
                        Approve + Feature
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground px-3 py-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <button
                      onClick={() => handleToggleFeature(review.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 ${
                        review.featuredOnHome
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      {review.featuredOnHome
                        ? 'Remove from Home'
                        : 'Feature on Home'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 px-3 py-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;