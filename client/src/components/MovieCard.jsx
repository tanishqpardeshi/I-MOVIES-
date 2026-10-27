import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Ticket, MapPin, Film, Play, Calendar } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

import { resolveMoviePoster, getFallbackMoviePoster, DEFAULT_FALLBACK_POSTER } from '../utils/moviePosters';

const MovieCard = ({ movie, onWatchTrailer }) => {
  const [posterSrc, setPosterSrc] = useState(() => resolveMoviePoster(movie?.title, movie?.posterUrl));
  const [imgError, setImgError] = useState(false);
  const { formatPrice, selectedCinema } = useLocationContext();

  useEffect(() => {
    setPosterSrc(resolveMoviePoster(movie?.title, movie?.posterUrl));
    setImgError(false);
  }, [movie?.posterUrl, movie?.title, movie?._id]);

  const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '2024';
  const isUpcoming = movie.category === 'upcoming';

  return (
    <div className="group bg-white border border-[#EAE2D5] hover:border-[#E63946]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col shadow-xs hover:shadow-xl hover:shadow-[#E63946]/10">
      {/* Poster Image Container - Full Canvas Edge-to-Edge Capturing */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#FAF6EE] flex items-center justify-center">
        {!imgError ? (
          <img
            src={posterSrc}
            alt={movie.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={() => {
              const fallback = getFallbackMoviePoster(movie?.title, posterSrc);
              if (fallback && fallback !== posterSrc) {
                setPosterSrc(fallback);
                return;
              }
              if (posterSrc !== DEFAULT_FALLBACK_POSTER) {
                setPosterSrc(DEFAULT_FALLBACK_POSTER);
                return;
              }
              setImgError(true);
            }}
            className="w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-500 ease-out will-change-transform"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
        ) : (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-[#FAF6EE] p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FDECEC] to-[#FFF6DC] border border-[#FCD7D7] flex items-center justify-center text-[#E63946] shadow-xs">
              <Film className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="text-xs font-bold text-[#2B2B2B] line-clamp-2">{movie.title}</p>
          </div>
        )}

        {/* Rating & Votes Badge with Catchy Gold Glow */}
        <div className="absolute top-2.5 right-2.5 z-20 bg-white/95 backdrop-blur-md border border-[#FDE68A] px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-extrabold text-[#92400E] shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#F59E0B] stroke-[#D97706]" />
          <span className="font-mono tabular-nums">{movie.rating || 8.5}</span>
          {movie.votes && (
            <span className="text-[10px] text-[#6B7280] font-normal">
              ({movie.votes >= 1000 ? `${(movie.votes / 1000).toFixed(1)}k` : movie.votes})
            </span>
          )}
        </div>

        {/* Industry and Category Badges with Catchy Theme Tints */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 items-start">
          {movie.industry && (
            <span
              className={`text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-lg shadow-xs ${
                movie.industry.toLowerCase() === 'bollywood'
                  ? 'bg-gradient-to-r from-[#FFF6DC] to-[#FEF3C7] text-[#92400E] border border-[#FCD34D]'
                  : 'bg-gradient-to-r from-[#FDECEC] to-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]'
              }`}
            >
              {movie.industry}
            </span>
          )}
          {isUpcoming && (
            <span className="bg-gradient-to-r from-[#FFC93C] to-[#F59E0B] text-slate-950 border border-[#D97706]/30 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              Coming Soon
            </span>
          )}
        </div>

        {/* Center Hover Trailer Overlay */}
        {onWatchTrailer && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWatchTrailer(movie);
            }}
            className="absolute inset-0 m-auto z-20 w-12 h-12 rounded-full bg-white/95 hover:bg-[#E63946] text-[#E63946] hover:text-white border border-[#EAE2D5] hover:border-[#E63946] flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg shadow-black/10 transform scale-90 group-hover:scale-100 cursor-pointer"
            title={movie.trailerKey ? "Watch Official 4K Trailer" : "View Official Trailer Status"}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#2B2B2B] group-hover:text-[#E63946] transition-colors line-clamp-1">
              {movie.title}
            </h3>
          </div>

          {/* Theater Information */}
          <p className="text-[11px] font-semibold text-[#E63946] flex items-center gap-1.5 mt-1 truncate">
            <MapPin className="w-3 h-3 text-[#E63946] shrink-0" />
            <span className="truncate">{selectedCinema?.name || movie.theater || 'iMovies IMAX Laser'}</span>
          </p>

          {/* Metadata Line */}
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-1.5 flex-wrap">
            <span className="font-medium text-[#4B5563]">{genres.slice(0, 2).join(', ')}</span>
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E63946]" />
              <span className="font-mono tabular-nums">{movie.duration || 120} min</span>
            </span>
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <span className="font-mono text-[#6B7280]">{releaseYear}</span>
            {movie.votes && (
              <>
                <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
                <span className="text-[#B81D2D] font-semibold text-[11px]">
                  {movie.votes >= 1000 ? `${(movie.votes / 1000).toFixed(1)}k` : movie.votes} votes
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-[#6B7280] mt-2.5 line-clamp-2 leading-relaxed">
            {movie.description || 'Experience this feature presentation in premium auditorium seating with Dolby Atmos.'}
          </p>
        </div>

        <div className="pt-3.5 border-t border-[#EAE2D5] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#9CA3AF] block uppercase tracking-wider font-bold">
              {isUpcoming ? 'Tickets from' : 'Reserved from'}
            </span>
            <span className="text-base font-extrabold text-[#1F2937] font-mono tabular-nums">
              {formatPrice(movie.ticketPrice || 250)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onWatchTrailer && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onWatchTrailer(movie);
                }}
                className="inline-flex items-center justify-center p-2 rounded-xl bg-[#FFF9F0] hover:bg-[#FFF6DC] text-[#E63946] border border-[#EAE2D5] hover:border-[#E63946]/40 transition-colors cursor-pointer shadow-xs"
                title={movie.trailerKey ? "Watch Trailer" : "View Official Trailer Status"}
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>
            )}

            <Link
              to={`/movies/${movie._id}`}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E63946] to-[#C1121F] hover:from-[#D62839] hover:to-[#A7101B] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm shadow-[#E63946]/20 hover:shadow-md hover:shadow-[#E63946]/30 transition-all duration-200"
            >
              <Ticket className="w-3.5 h-3.5" />
              {movie.category === 'upcoming' && (!movie.showtimes || movie.showtimes.length === 0)
                ? 'Coming Soon'
                : isUpcoming
                ? 'Pre-Book'
                : 'Select Seats'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;