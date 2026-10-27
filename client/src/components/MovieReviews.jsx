import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Ticket,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Loader2,
  ArrowUpRight,
  Filter,
  UserCheck
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const RATING_LABELS = {
  1: 'Poor — Disappointing watch',
  2: 'Fair — Has some good moments',
  3: 'Good — Solid entertainment',
  4: 'Very Good — Highly recommended',
  5: 'Masterpiece — Unmissable big-screen cinema!'
};

const MovieReviews = ({ movieId, movieTitle, onScrollToBooking }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [hasBooked, setHasBooked] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Filter & Sort
  const [starFilter, setStarFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [likedReviews, setLikedReviews] = useState(new Set());

  // Fetch reviews for the movie
  const fetchReviews = async () => {
    if (!movieId) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/movies/${movieId}/reviews`);
      setReviews(data.reviews || []);
      setStats(
        data.stats || {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      );
      setHasBooked(!!data.hasBooked);
      if (data.userReview) {
        setUserReview(data.userReview);
        setRating(data.userReview.rating || 5);
        setComment(data.userReview.comment || '');
      } else {
        setUserReview(null);
        setRating(5);
        setComment('');
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!hasBooked) {
      setFormError('You can only review movies you have previously booked.');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      setFormError('Please select a star rating between 1 and 5.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 3) {
      setFormError('Please write a short comment of at least 3 characters.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      setFormSuccess('');

      const { data } = await API.post(`/movies/${movieId}/reviews`, {
        rating,
        comment: comment.trim()
      });

      setFormSuccess(data.message || 'Review published successfully!');
      setIsEditing(false);
      await fetchReviews();
      setTimeout(() => setFormSuccess(''), 5000);
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Failed to submit your review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your review?')) return;
    try {
      setDeleting(true);
      setFormError('');
      await API.delete(`/movies/${movieId}/reviews`);
      setUserReview(null);
      setRating(5);
      setComment('');
      setIsEditing(false);
      setFormSuccess('Your review has been removed.');
      await fetchReviews();
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError('Failed to remove review');
    } finally {
      setDeleting(false);
    }
  };

  const handleLike = async (reviewId) => {
    if (likedReviews.has(reviewId)) return;
    try {
      setLikedReviews((prev) => new Set([...prev, reviewId]));
      // Optimistic update
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r))
      );
      await API.post(`/movies/${movieId}/reviews/${reviewId}/like`);
    } catch (e) {
      // Ignore like error
    }
  };

  // Filter & Sort reviews
  const filteredReviews = reviews
    .filter((r) => {
      if (starFilter === 'all') return true;
      return Math.round(Number(r.rating)) === Number(starFilter);
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'helpful') return (b.likes || 0) - (a.likes || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalCount = stats.totalReviews || 0;
  const activeRating = hoverRating || rating;

  return (
    <div id="audience-reviews" className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs relative overflow-hidden">
      {/* Decorative Warm Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFC93C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D5]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E63946]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Verified Audience Reviews</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B2B2B] tracking-tight flex items-center gap-2">
            Ratings & Thoughts for <span className="text-[#E63946]">{movieTitle}</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Ratings and comments are exclusively submitted by ticket-verified guests who booked this screening.
          </p>
        </div>

        {/* Aggregate Score Badge */}
        <div className="flex items-center gap-3 bg-[#FFF9F0] border border-[#EAE2D5] px-5 py-3 rounded-2xl self-start md:self-auto shadow-xs">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#2B2B2B] font-mono leading-none">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
              <span className="text-xs font-normal text-[#6B7280]"> / 5.0</span>
            </div>
            <div className="text-[11px] text-[#7A5B14] font-bold mt-1">
              {totalCount} {totalCount === 1 ? 'Verified Rating' : 'Verified Ratings'}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center pl-3 border-l border-[#EAE2D5]">
            <div className="flex items-center text-[#FFC93C]">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = (stats.averageRating || 0) >= starVal - 0.25;
                return (
                  <Star
                    key={starVal}
                    className={`w-4 h-4 ${
                      isFilled ? 'fill-[#FFC93C] text-[#FFC93C]' : 'text-[#DCD3C5]'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-[#047857] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> 100% Booked Guests
            </span>
          </div>
        </div>
      </div>

      {/* Ratings Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FFF9F0] border border-[#EAE2D5] rounded-2xl p-4 sm:p-6">
        {/* Left: Star Distribution Bars */}
        <div className="md:col-span-2 space-y-2">
          <span className="text-xs font-bold text-[#2B2B2B] block mb-2 uppercase tracking-wider">
            Rating Distribution
          </span>
          {[5, 4, 3, 2, 1].map((starLevel) => {
            const count = stats.ratingDistribution?.[starLevel] || 0;
            const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            const isSelected = starFilter === String(starLevel);

            return (
              <button
                key={starLevel}
                type="button"
                onClick={() => setStarFilter(isSelected ? 'all' : String(starLevel))}
                className={`w-full flex items-center gap-3 text-xs py-1.5 px-2 rounded-xl transition-colors group cursor-pointer ${
                  isSelected ? 'bg-[#FFF6DC] ring-1 ring-[#FFC93C]' : 'hover:bg-white'
                }`}
                title={`Filter by ${starLevel} star reviews`}
              >
                <span className="w-12 text-left font-mono font-bold text-[#2B2B2B] flex items-center gap-1">
                  <span>{starLevel}</span>
                  <Star className="w-3 h-3 fill-[#FFC93C] text-[#FFC93C]" />
                </span>
                <div className="flex-1 h-2.5 bg-[#EAE2D5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFC93C] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-[11px] text-[#6B7280] group-hover:text-[#2B2B2B] font-semibold">
                  {count} <span className="text-[10px] text-[#9CA3AF]">({percent}%)</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Verified Policy Info Card */}
        <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-[#EAE2D5] text-xs text-[#2B2B2B] space-y-3 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[#E63946] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Verified Ticketing Guarantee</span>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Unlike generic review sites, iMovies requires a confirmed theater booking before any user can publish a rating or comment.
            </p>
          </div>
          <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-[11px]">
            <span className="text-[#6B7280]">Your Booking Status:</span>
            {hasBooked ? (
              <span className="text-[#047857] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Booked
              </span>
            ) : user ? (
              <span className="text-[#7A5B14] font-medium">No prior booking</span>
            ) : (
              <span className="text-[#9CA3AF] font-medium">Not Signed In</span>
            )}
          </div>
        </div>
      </div>

      {/* Review Submission Card / Gatekeeper Callout */}
      <div className="bg-[#FFFDF5] border border-[#FFEDB0] rounded-2xl p-5 sm:p-7 relative shadow-xs">
        {/* Scenario 1: User is logged in and HAS booked this movie */}
        {user && hasBooked ? (
          <div>
            {userReview && !isEditing ? (
              // Display existing review with edit option
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EAE2D5]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FFF6DC] border border-[#FFEDB0] flex items-center justify-center text-[#7A5B14] font-bold text-xs">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2B2B2B] block">
                        Your Review ({userReview.username || user.username})
                      </span>
                      <span className="text-[10px] text-[#047857] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Ticket Holder
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#FFF6DC] text-[#2B2B2B] border border-[#EAE2D5] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#E63946]" />
                      Edit Review
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FDECEC] hover:bg-[#FCD7D7] text-[#B81D2D] border border-[#FCD7D7] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting ? 'Removing...' : 'Delete'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#FFC93C]">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <Star
                          key={starVal}
                          className={`w-4 h-4 ${
                            userReview.rating >= starVal
                              ? 'fill-[#FFC93C] text-[#FFC93C]'
                              : 'text-[#DCD3C5]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2B2B2B]">
                      {userReview.rating} / 5 Stars
                    </span>
                    <span className="text-xs text-[#9CA3AF]">·</span>
                    <span className="text-xs text-[#6B7280] font-medium">
                      {RATING_LABELS[userReview.rating] || ''}
                    </span>
                  </div>

                  <p className="text-[#2B2B2B] text-xs sm:text-sm leading-relaxed bg-white p-4 rounded-xl border border-[#EAE2D5] shadow-xs">
                    "{userReview.comment}"
                  </p>
                </div>
              </div>
            ) : (
              // Form for submitting or editing
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EAE2D5]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E5B129]" />
                    <h3 className="text-sm sm:text-base font-bold text-[#2B2B2B]">
                      {userReview ? 'Update Your Review' : `Rate & Review ${movieTitle}`}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ticket Booking Verified
                  </span>
                </div>

                {/* Star Rating Picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2B2B2B]">
                    Select Rating (1–5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-[#DCD3C5]">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isHovered = hoverRating >= starVal;
                        const isSelected = !hoverRating && rating >= starVal;
                        const active = isHovered || isSelected;

                        return (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-125 transition-transform duration-150 focus:outline-none cursor-pointer"
                            title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                active
                                  ? 'fill-[#FFC93C] text-[#FFC93C]'
                                  : 'text-[#DCD3C5] hover:text-[#FFC93C]'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-[#7A5B14] pl-2">
                      {RATING_LABELS[activeRating] || `${activeRating} Stars`}
                    </span>
                  </div>
                </div>

                {/* Text Comment Area */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-[#2B2B2B]">
                    <label htmlFor="review-comment">Short Review Comment</label>
                    <span
                      className={`font-mono text-[11px] ${
                        comment.length > 500 ? 'text-[#B81D2D]' : 'text-[#6B7280]'
                      }`}
                    >
                      {comment.length} / 500
                    </span>
                  </div>
                  <textarea
                    id="review-comment"
                    rows="3"
                    value={comment}
                    maxLength={500}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience: screen immersion, screenplay, performances, sound design..."
                    className="w-full bg-white border border-[#DCD3C5] focus:border-[#E63946] text-[#2B2B2B] rounded-xl p-3 text-xs sm:text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#E63946] transition-all resize-y min-h-[80px]"
                  />
                </div>

                {/* Error / Success alerts */}
                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-[#FDECEC] border border-[#FCD7D7] text-[#B81D2D] text-xs rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#E63946]" />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs rounded-xl">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs text-xs transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Review...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {userReview ? 'Save Updated Review' : 'Publish Verified Review'}
                      </>
                    )}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setRating(userReview?.rating || 5);
                        setComment(userReview?.comment || '');
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#2B2B2B] bg-white border border-[#EAE2D5] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        ) : user && !hasBooked ? (
          // Scenario 2: User is logged in BUT has NOT booked this movie yet
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2 text-[#E63946] font-bold text-xs uppercase tracking-wide">
                <Ticket className="w-4 h-4 text-[#E63946]" />
                <span>Verified Booking Required</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#2B2B2B]">
                Book tickets for {movieTitle} to unlock audience reviews
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Reviews on iMovies are reserved exclusively for guests who have booked tickets for this movie. Once you reserve your recliner seats above, you can share your 1–5 star rating and comment!
              </p>
            </div>

            <button
              type="button"
              onClick={onScrollToBooking}
              className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs shrink-0 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Seats & Reserve</span>
            </button>
          </div>
        ) : (
          // Scenario 3: User is not logged in
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2 text-[#E63946] font-bold text-xs uppercase tracking-wide">
                <UserCheck className="w-4 h-4" />
                <span>Audience Review Portal</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#2B2B2B]">
                Have you booked or watched {movieTitle}?
              </h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Sign in to verify your ticket booking and submit your 1–5 star rating and thoughts for other moviegoers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs shrink-0 transition-all cursor-pointer"
            >
              <span>Sign In to Review</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Reviews Filter & Feed Controls */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStarFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                starFilter === 'all'
                  ? 'bg-[#E63946] text-white font-bold shadow-xs'
                  : 'bg-[#FFF9F0] text-[#6B7280] hover:text-[#2B2B2B] border border-[#EAE2D5] hover:bg-[#FFF6DC]'
              }`}
            >
              All Reviews ({totalCount})
            </button>
            {[5, 4, 3, 2, 1].map((s) => {
              const count = stats.ratingDistribution?.[s] || 0;
              if (count === 0 && starFilter !== String(s)) return null;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStarFilter(String(s))}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    starFilter === String(s)
                      ? 'bg-[#E63946] text-white font-bold shadow-xs'
                      : 'bg-[#FFF9F0] text-[#6B7280] hover:text-[#2B2B2B] border border-[#EAE2D5] hover:bg-[#FFF6DC]'
                  }`}
                >
                  <span>{s}</span>
                  <Star className="w-3 h-3 fill-current text-[#FFC93C]" />
                  <span className="font-mono text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#E63946]" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#DCD3C5] text-[#2B2B2B] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#E63946] cursor-pointer"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#E63946]" />
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-3.5">
            {filteredReviews.map((rev) => {
              const isUserAuthor =
                user &&
                ((rev.user && (rev.user._id === user._id || rev.user === user._id)) ||
                  rev.username === user.username);
              const isLiked = likedReviews.has(rev._id);

              return (
                <div
                  key={rev._id}
                  className="bg-white border border-[#EAE2D5] hover:border-[#FFC93C] rounded-2xl p-5 space-y-3 transition-colors shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#FFF6DC] border border-[#FFEDB0] flex items-center justify-center text-[#7A5B14] font-bold text-xs uppercase shadow-xs">
                        {rev.username ? rev.username.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#2B2B2B]">
                            {rev.username || 'Verified Guest'}
                          </span>
                          {isUserAuthor && (
                            <span className="text-[10px] bg-[#FFF6DC] text-[#7A5B14] px-2 py-0.5 rounded-md font-bold border border-[#FFEDB0]">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#047857] font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Verified Ticket Holder</span>
                          <span className="text-[#DCD3C5]">·</span>
                          <span className="text-[#6B7280]">
                            {rev.createdAt
                              ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1.5 bg-[#FFF9F0] border border-[#EAE2D5] px-3 py-1.5 rounded-xl">
                      <div className="flex items-center text-[#FFC93C]">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <Star
                            key={starVal}
                            className={`w-3.5 h-3.5 ${
                              rev.rating >= starVal
                                ? 'fill-[#FFC93C] text-[#FFC93C]'
                                : 'text-[#DCD3C5]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#2B2B2B]">
                        {rev.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-[#2B2B2B] text-xs sm:text-sm leading-relaxed pl-1 pt-1">
                    {rev.comment}
                  </p>

                  {/* Review Footer / Helpful Vote */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE2D5] text-xs">
                    <button
                      type="button"
                      onClick={() => handleLike(rev._id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-[#FFF6DC] text-[#7A5B14] border border-[#FFEDB0]'
                          : 'bg-[#FFF9F0] hover:bg-[#FFF6DC] text-[#6B7280] hover:text-[#2B2B2B] border border-[#EAE2D5]'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-[#E5B129] text-[#E5B129]' : ''}`} />
                      <span>Helpful ({rev.likes || 0})</span>
                    </button>

                    {rev.updatedAt && rev.updatedAt !== rev.createdAt && (
                      <span className="text-[10px] text-[#9CA3AF] italic">
                        Edited
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 px-4 text-center rounded-2xl bg-[#FFF9F0] border border-[#EAE2D5] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF6DC] border border-[#FFEDB0] flex items-center justify-center text-[#E5B129] mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#2B2B2B]">
                {starFilter !== 'all'
                  ? `No ${starFilter}-star reviews found`
                  : 'No reviews yet for this movie'}
              </p>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                {starFilter !== 'all'
                  ? 'Try selecting a different star filter or view all reviews.'
                  : 'Be among the first verified ticket holders to share your thoughts and rating!'}
              </p>
            </div>
            {starFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setStarFilter('all')}
                className="text-xs text-[#E63946] font-bold hover:underline cursor-pointer"
              >
                Clear filter & show all reviews
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieReviews;
