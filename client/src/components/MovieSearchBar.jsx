import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Star, Film, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import API from '../services/api';
import { resolveMoviePoster, DEFAULT_FALLBACK_POSTER } from '../utils/moviePosters';

const TRENDING_SUGGESTIONS = [
  { title: 'Pushpa 2: The Rule', genre: 'Action / Crime', industry: 'Bollywood' },
  { title: 'Munjya', genre: 'Horror / Comedy', industry: 'Bollywood' },
  { title: 'Bhool Bhulaiyaa 3', genre: 'Comedy / Horror', industry: 'Bollywood' },
  { title: 'Chhaava', genre: 'History / Action', industry: 'Bollywood' },
  { title: 'Singham Again', genre: 'Action / Drama', industry: 'Bollywood' },
  { title: 'Dune: Part Two', genre: 'Sci-Fi / Adventure', industry: 'Hollywood' }
];

const MovieSearchBar = ({ className = '', onSearchSubmit }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Global keyboard shortcut ('/' or 'Ctrl+K') to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync query with current URL if on Home page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam !== null) {
      setQuery(searchParam);
    }
  }, [location.search]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when query changes (debounced with AbortController)
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/movies', {
          params: { search: trimmed, limit: 6 },
          signal: controller.signal
        });
        setSuggestions(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || (err.message && err.message.includes('canceled'))) {
          // Expected cancellation when user continues typing
          return;
        }
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const targetQuery = query.trim();
    setIsOpen(false);
    setIsMobileExpanded(false);

    if (onSearchSubmit) {
      onSearchSubmit(targetQuery);
    }

    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      if (targetQuery) {
        params.set('search', targetQuery);
      } else {
        params.delete('search');
      }
      navigate(`/?${params.toString()}`);
    } else {
      navigate(`/?search=${encodeURIComponent(targetQuery)}`);
    }
  };

  const handleSelectMovie = (movie) => {
    setIsOpen(false);
    setIsMobileExpanded(false);
    navigate(`/movies/${movie._id}`);
  };

  const handleSelectSuggestionQuery = (term) => {
    setQuery(term);
    setIsOpen(false);
    setIsMobileExpanded(false);
    if (onSearchSubmit) {
      onSearchSubmit(term);
    }
    navigate(`/?search=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectMovie(suggestions[selectedIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Container */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full">
          <Search className="w-4.5 h-4.5 text-[#E63946] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search movies by title, actor, or genre..."
            className="w-full bg-[#FFF9F0] hover:bg-[#FFF6DC] focus:bg-white text-[#2B2B2B] text-xs sm:text-sm font-medium pl-11 pr-20 py-2.5 sm:py-3 rounded-2xl border border-[#EAE2D5] focus:border-[#E63946] focus:ring-2 focus:ring-[#FFC93C]/30 focus:outline-none transition-all placeholder:text-[#9CA3AF] shadow-xs"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {loading && (
              <Loader2 className="w-3.5 h-3.5 text-[#E63946] animate-spin mr-1" />
            )}

            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  inputRef.current?.focus();
                  if (location.pathname === '/') {
                    const params = new URLSearchParams(location.search);
                    params.delete('search');
                    navigate(`/?${params.toString()}`);
                  }
                }}
                className="text-[#9CA3AF] hover:text-[#2B2B2B] p-1.5 rounded-lg hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#9CA3AF] bg-[#FAF5EE] border border-[#EAE2D5] px-2 py-0.5 rounded-md shadow-2xs">
                <span>Press</span>
                <kbd className="font-sans font-bold text-[#E63946]">/</kbd>
              </span>
            )}
          </div>
        </div>
      </form>

      {/* Autocomplete Dropdown - Only shown when typing */}
      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#EAE2D5] rounded-2xl shadow-xl overflow-hidden z-50 backdrop-blur-xl animate-in fade-in duration-150 max-h-[420px] overflow-y-auto">
          {/* If user is typing and has matching suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-3.5 py-2 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider border-b border-[#EAE2D5] flex items-center justify-between bg-[#FFF9F0]">
                <span>Matching Movies ({suggestions.length})</span>
                <span className="text-[10px] text-[#E63946] lowercase font-medium">click or press enter</span>
              </div>
              <div className="p-1.5 divide-y divide-[#F0E9DD]">
                {suggestions.map((movie, idx) => (
                  <button
                    key={movie._id}
                    type="button"
                    onClick={() => handleSelectMovie(movie)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                      selectedIndex === idx
                        ? 'bg-[#FFF6DC] text-[#2B2B2B]'
                        : 'hover:bg-[#FFF9F0] text-[#2B2B2B]'
                    }`}
                  >
                    {/* Poster Thumbnail */}
                    <div className="w-10 h-14 rounded-xl bg-[#FAF6EE] overflow-hidden shrink-0 border border-[#EAE2D5] relative">
                      <img
                        src={resolveMoviePoster(movie?.title, movie?.posterUrl)}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          if (e.currentTarget.src !== DEFAULT_FALLBACK_POSTER) {
                            e.currentTarget.src = DEFAULT_FALLBACK_POSTER;
                          }
                        }}
                      />
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#2B2B2B] truncate">
                          {movie.title}
                        </span>
                        {movie.industry && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              movie.industry === 'Bollywood'
                                ? 'bg-[#FFF6DC] text-[#7A5B14] border border-[#FFEDB0]'
                                : 'bg-[#FDECEC] text-[#B81D2D] border border-[#FCD7D7]'
                            }`}
                          >
                            {movie.industry}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#6B7280] mt-0.5 truncate">
                        <span>
                          {movie.releaseDate
                            ? new Date(movie.releaseDate).getFullYear()
                            : '2024'}
                        </span>
                        <span>•</span>
                        <span>{movie.duration}m</span>
                        <span>•</span>
                        <span className="truncate">
                          {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    {movie.rating && (
                      <div className="flex items-center gap-1 bg-[#FFF6DC] border border-[#FFEDB0] px-2 py-1 rounded-lg text-[#7A5B14] font-bold text-xs shrink-0">
                        <Star className="w-3 h-3 fill-[#FFC93C] text-[#FFC93C]" />
                        <span>{Number(movie.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* View all results link */}
              <div className="p-2 border-t border-[#EAE2D5] bg-[#FFF9F0]">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#FDECEC] text-[#E63946] border border-[#EAE2D5] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View all results for &quot;{query}&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* If user is typing and no suggestions found */}
          {!loading && suggestions.length === 0 && (
            <div className="p-6 text-center space-y-2 bg-white">
              <Film className="w-8 h-8 text-[#9CA3AF] mx-auto" />
              <div className="text-sm font-bold text-[#2B2B2B]">
                No movies found for &quot;{query}&quot;
              </div>
              <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
                Try searching by movie title, cast members, or genres.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieSearchBar;
