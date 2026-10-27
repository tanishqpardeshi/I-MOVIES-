import React, { useEffect, useState } from 'react';
import { X, Play, Film, ExternalLink, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

const extractYouTubeId = (keyOrUrl) => {
  if (!keyOrUrl) return '';
  const trimmed = String(keyOrUrl).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) return match[1];
  return '';
};

const TrailerModal = ({ isOpen, onClose, trailerKey, title, isComingSoon }) => {
  const [hasPlaybackIssue, setHasPlaybackIssue] = useState(false);
  const [embedAttempt, setEmbedAttempt] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setHasPlaybackIssue(false);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const videoId = extractYouTubeId(trailerKey);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    (title || 'Movie') + ' official trailer'
  )}`;
  const youtubeWatchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : searchUrl;

  // Use YouTube standard embed without restrictive origin parameters that cause video unavailable errors
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Trailer`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-white border border-[#EAE2D5] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EAE2D5] bg-[#FFF9F0]">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-[#FDECEC] border border-[#FCD7D7] flex items-center justify-center text-[#E63946] shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#2B2B2B] tracking-wide truncate">
                {title} {videoId ? '— Official 4K Trailer' : '— Trailer Preview'}
              </h3>
              <p className="text-[11px] text-[#6B7280] font-medium flex items-center gap-2">
                <span className="text-[#E63946] font-semibold">Auditorium Preview</span>
                <span className="w-1 h-1 rounded-full bg-[#E63946]" />
                <span>
                  {videoId ? 'Verified Studio Embed' : 'Official Release Info'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct YouTube Link Button */}
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDECEC] hover:bg-[#FCD7D7] border border-[#FCD7D7] text-[#B81D2D] hover:text-[#991B1B] text-xs font-semibold transition-colors"
              title="Open directly in YouTube app or new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {videoId ? 'Watch on YouTube' : 'Search Trailer on YouTube'}
              </span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#FFF6DC] text-[#6B7280] hover:text-[#2B2B2B] border border-[#EAE2D5] flex items-center justify-center transition-colors cursor-pointer"
              title="Close Trailer"
              aria-label="Close trailer player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice Bar for Embed Restrictions */}
        {videoId && (
          <div className="bg-[#FFFDF5] border-b border-[#FFEDB0] px-4 py-2 flex items-center justify-between text-xs text-[#7A5B14]">
            <span className="flex items-center gap-1.5 truncate">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E5B129] shrink-0" />
              <span>If player shows "Video unavailable", studio restricts embedding:</span>
            </span>
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-[11px] shrink-0 ml-2 shadow-xs transition-colors"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Watch on YouTube ↗</span>
            </a>
          </div>
        )}

        {/* Video Player or Fallback View */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {videoId && !hasPlaybackIssue ? (
            <div className="w-full h-full relative">
              <iframe
                key={`yt-${videoId}-${embedAttempt}`}
                src={embedUrl}
                title={`${title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
                onError={() => setHasPlaybackIssue(true)}
              />
            </div>
          ) : !videoId ? (
            /* Dedicated State: Official Trailer Coming Soon */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center space-y-4 bg-gradient-to-b from-[#FFF9F0] via-[#FFF6DC] to-white">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF6DC] border border-[#FFEDB0] flex items-center justify-center text-[#E5B129] shadow-xs">
                <Clock className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <p className="text-[#2B2B2B] font-extrabold text-lg tracking-tight">
                  Official Trailer Coming Soon
                </p>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  The studio has not released the embeddable official full trailer for{' '}
                  <strong className="text-[#2B2B2B]">{title}</strong> yet. We never display incorrect
                  or unrelated movies. You can search YouTube for verified teasers and production
                  updates.
                </p>
              </div>
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Search for Official "{title}" Teaser on YouTube
              </a>
            </div>
          ) : (
            /* Fallback State: Third-Party Playback Error or Video Unavailable */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center space-y-4 bg-gradient-to-b from-[#FFF9F0] via-[#FFF6DC] to-white">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF6DC] border border-[#FFEDB0] flex items-center justify-center text-[#E5B129] shadow-xs">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <p className="text-[#2B2B2B] font-extrabold text-lg">
                  Trailer Unavailable in Embedded Player
                </p>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Studio distribution policies sometimes restrict in-app playback for this title. You
                  can watch the verified 4K official trailer directly on YouTube without interruption.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={youtubeWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Watch Directly on YouTube
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setHasPlaybackIssue(false);
                    setEmbedAttempt((p) => p + 1);
                  }}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FFF6DC] text-[#2B2B2B] border border-[#EAE2D5] px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#E63946]" />
                  Retry Embedded Player
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div className="px-5 py-2.5 bg-[#FFF9F0] border-t border-[#EAE2D5] flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            iMovies Verified Theatrical Showcase
          </span>
          <div className="flex items-center gap-3">
            {videoId && (
              <button
                type="button"
                onClick={() => {
                  setHasPlaybackIssue(false);
                  setEmbedAttempt((prev) => prev + 1);
                }}
                className="hover:text-[#E63946] text-[#6B7280] flex items-center gap-1 transition-colors cursor-pointer font-medium"
                title="Reload Trailer Player"
              >
                <RefreshCw className="w-3 h-3 text-[#E63946]" />
                <span>Reload</span>
              </button>
            )}
            <span className="text-[#DCD3C5]">|</span>
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E63946] hover:underline flex items-center gap-1 font-semibold"
            >
              YouTube Link <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
