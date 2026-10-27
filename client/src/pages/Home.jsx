import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  Sparkles,
  X,
  Clapperboard,
  Award,
  Play,
  Globe,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Ticket,
  Film,
  Star,
  RotateCcw,
  Compass,
  Check,
  Flame
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';
import LocationPickerModal from '../components/LocationPickerModal';
import NearbyCinemaFinder from '../components/NearbyCinemaFinder';
import { useAuth } from '../context/AuthContext';
import { useLocationContext, COUNTRIES } from '../context/LocationContext';
import { resolveMoviePoster, getFallbackMoviePoster, DEFAULT_FALLBACK_POSTER } from '../utils/moviePosters';

const INDUSTRIES = [
  { id: 'All', label: 'All Industries (Hollywood & Bollywood)', badge: 'Global' },
  { id: 'Hollywood', label: 'Hollywood Blockbusters', badge: 'Hollywood' },
  { id: 'Bollywood', label: 'Bollywood Hindi Cinema', badge: 'Bollywood' }
];

const GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Comedy',
  'Thriller',
  'Horror',
  'Romance',
  'Animation',
  'Adventure',
  'Crime',
  'Biography',
  'Sports',
  'Family',
  'Fantasy',
  'Musical',
  'Mystery',
  'History',
  'War'
];

const LANGUAGES = ['All', 'English', 'Hindi', 'Japanese', 'French', 'Spanish'];

const RATING_DROPDOWN_OPTIONS = [
  { value: 0, label: 'All Ratings (Any)' },
  { value: 7.5, label: '7.5+ Great' },
  { value: 8.0, label: '8.0+ Very Highly Rated' },
  { value: 8.5, label: '8.5+ Critical Acclaim' },
  { value: 8.8, label: '8.8+ Masterpieces' },
  { value: 9.0, label: '9.0+ Hall of Fame (9.0+)' }
];

const Home = () => {
  const { user } = useAuth();
  const {
    country,
    state,
    city,
    activeCountry,
    selectedCinema,
    cinemas,
    setCity,
    formatPrice,
    detectCurrentLocation,
    detectingLocation,
    locationStatus
  } = useLocationContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [minRating, setMinRating] = useState(0); // Minimum Rating filter (slider + dropdown)
  const [categoryTab, setCategoryTab] = useState('now_playing'); // 'now_playing', 'upcoming', 'popular', 'all'
  const [sortBy, setSortBy] = useState('genre'); // 'genre', 'rating', 'releaseDate', 'title', 'duration'

  // Sync search state if URL parameter changes (e.g., from Navbar search)
  useEffect(() => {
    const urlQuery = searchParams.get('search') || '';
    if (urlQuery !== search) {
      setSearch(urlQuery);
    }
  }, [searchParams]);

  const handleSearchChange = (val) => {
    setSearch(val);
    const newParams = new URLSearchParams(searchParams);
    if (val && val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  };

  // Modals
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, movie: null });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    industry: 'Hollywood',
    description: '',
    genre: 'Action, Sci-Fi',
    duration: 145,
    posterUrl: '',
    ticketPrice: 280,
    theater: 'iMovies IMAX Laser - Screen 1'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchMovies = async (retryCount = 0) => {
    try {
      setLoading(true);
      const { data } = await API.get('/movies', {
        params: {
          search: search || undefined,
          industry: selectedIndustry !== 'All' ? selectedIndustry : undefined,
          genre: selectedGenre !== 'All' ? selectedGenre : undefined,
          minRating: Number(minRating) > 0 ? Number(minRating) : undefined,
          category: categoryTab !== 'all' ? categoryTab : undefined,
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          country: country || undefined,
          sortBy
        }
      });
      setMovies(data || []);
    } catch (error) {
      if (retryCount < 1) {
        setTimeout(() => fetchMovies(retryCount + 1), 350);
        return;
      }
      console.warn('Unable to load movies temporarily:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search, selectedIndustry, selectedGenre, selectedLanguage, minRating, categoryTab, country, sortBy]);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post('/movies', {
        ...newMovie,
        genre: newMovie.genre.split(',').map((g) => g.trim())
      });
      setShowAddModal(false);
      setNewMovie({
        title: '',
        industry: 'Hollywood',
        description: '',
        genre: 'Action, Sci-Fi',
        duration: 145,
        posterUrl: '',
        ticketPrice: 280,
        theater: 'iMovies IMAX Laser - Screen 1'
      });
      fetchMovies();
    } catch (error) {
      console.error('Failed to add movie', error);
    } finally {
      setSubmitting(false);
    }
  };

  const spotlightConfig = [
    {
      _id: '65f1b0000000000000000125',
      title: 'Clayface',
      aliases: ['Clayface 2026', 'DC Clayface', 'Basil Karlo Clayface'],
      director: 'Mike Flanagan',
      industry: 'Hollywood',
      rating: 9.2,
      duration: 142,
      genre: ['Action', 'Horror', 'Thriller', 'Sci-Fi'],
      ticketPrice: 420,
      theater: 'iMovies IMAX Laser 4K',
      posterUrl: '/posters/clayface.jpg',
      backdropUrl: '/posters/clayface.jpg',
      trailerKey: 'ClayfaceOfficialTrailer',
      description:
        'A terrifying psychological body-horror thriller from director Mike Flanagan. When actor Basil Karlo is brutally disfigured, an experimental cosmetic compound mutates his body into a horrifying shapeshifter, unleashing vengeance across Gotham City.',
      cast: [
        { name: 'Tom Rhys Harries', character: 'Matt Hagen / Clayface' },
        { name: 'Carla Gugino', character: 'Dr. Julie Madison' },
        { name: 'Rahul Kohli', character: 'Detective Ethan Bennett' },
        { name: 'Bruce Greenwood', character: 'DA Harvey Dent' }
      ]
    },
    {
      _id: '65f1b0000000000000000126',
      title: 'Hope',
      aliases: ['Hope 2026', 'Hopeu', 'Na Hong-jin Hope'],
      director: 'Na Hong-jin',
      industry: 'Hollywood',
      rating: 9.4,
      duration: 152,
      genre: ['Sci-Fi', 'Thriller', 'Mystery', 'Adventure'],
      ticketPrice: 450,
      theater: 'iMovies IMAX 70mm Laser',
      posterUrl: '/posters/hope.jpg',
      backdropUrl: '/posters/hope.jpg',
      trailerKey: 'HopeOfficialTeaser',
      description:
        'Directed by visionary auteur Na Hong-jin (The Wailing), Hope chronicles residents of an isolated seaside harbor town thrust into a desperate survival fight when an enigmatic alien phenomenon lands on the outskirts of their village.',
      cast: [
        { name: 'Jung Ho-yeon', character: 'Officer Sung-ae' },
        { name: 'Hwang Jung-min', character: 'Bum-seok' },
        { name: 'Zo In-sung', character: 'Sung-ki' },
        { name: 'Alicia Vikander', character: 'Dr. Evelyn' },
        { name: 'Michael Fassbender', character: 'Lucas' }
      ]
    },
    {
      _id: '65f1b0000000000000000121',
      title: "Namit Malhotra's Ramayana",
      aliases: ['Ramayana', 'Ramayana Part 1', 'Nitesh Tiwari Ramayana', 'Ranbir Kapoor Ramayana', 'Ramayana Namit Malhotra'],
      director: 'Nitesh Tiwari',
      industry: 'Bollywood',
      rating: 9.8,
      duration: 175,
      genre: ['Action', 'Adventure', 'Fantasy', 'History', 'Devotional'],
      ticketPrice: 450,
      theater: 'iMovies IMAX 70mm Laser',
      posterUrl: '/posters/ramayana.jpg',
      backdropUrl: 'https://img.youtube.com/vi/xzIE3mVmgKs/maxresdefault.jpg',
      trailerKey: 'xzIE3mVmgKs',
      description:
        'A monumental cinematic retelling of the timeless Indian epic produced by Namit Malhotra with Prime Focus Studios, DNEG, and director Nitesh Tiwari, set to a breathtaking score by Oscar winners Hans Zimmer and A.R. Rahman. Follow Lord Rama’s journey of virtue, honour, sacrifice, and the cosmic triumph of Dharma over evil.',
      cast: [
        { name: 'Ranbir Kapoor', character: 'Lord Rama' },
        { name: 'Sai Pallavi', character: 'Goddess Sita' },
        { name: 'Yash', character: 'Lankesh Ravana' },
        { name: 'Sunny Deol', character: 'Lord Hanuman' }
      ]
    },
    {
      _id: '65f1b0000000000000000120',
      title: 'Drishyam: The Conclusion',
      aliases: ['Drishyam 3', 'Drishyam The Conclusion', 'Drishyam Conclusion', 'Ajay Devgn Drishyam'],
      director: 'Abhishek Pathak',
      industry: 'Bollywood',
      rating: 9.6,
      duration: 156,
      genre: ['Thriller', 'Crime', 'Drama', 'Mystery'],
      ticketPrice: 380,
      theater: 'iMovies PVR ICON Lower Parel',
      posterUrl: 'https://img.youtube.com/vi/cxA2y9Tgl7o/maxresdefault.jpg',
      backdropUrl: 'https://img.youtube.com/vi/cxA2y9Tgl7o/maxresdefault.jpg',
      trailerKey: 'cxA2y9Tgl7o',
      description:
        'The monumental final chapter to Vijay Salgaonkar and his family’s relentless psychological confrontation with law enforcement. As Jaideep Ahlawat’s elite Crime Branch unit uncovers new forensic evidence alongside Meera Deshmukh and lawyer Prakash Raj, Vijay must execute his ultimate masterstroke to shield his loved ones from retribution.',
      cast: [
        { name: 'Ajay Devgn', character: 'Vijay Salgaonkar' },
        { name: 'Tabu', character: 'Meera Deshmukh' },
        { name: 'Shriya Saran', character: 'Nandini Salgaonkar' },
        { name: 'Jaideep Ahlawat', character: 'IG Rathore' }
      ]
    },
    {
      _id: '65f1b0000000000000000107',
      title: 'Pehla Pyaar Dusri Baar',
      aliases: ['Pehla Pyaar Doosri Baar', 'Pehla Pyar Dusri Baar'],
      director: 'Anuj Saini',
      industry: 'Bollywood',
      rating: 8.7,
      duration: 136,
      genre: ['Romance', 'Comedy', 'Drama', 'Musical'],
      ticketPrice: 320,
      theater: 'iMovies Directors Cut Vasant Kunj',
      posterUrl: '/posters/pehla-pyaar-dusri-baar.jpg',
      backdropUrl: 'https://img.youtube.com/vi/zzrb40x96Sg/maxresdefault.jpg',
      trailerKey: 'zzrb40x96Sg',
      description:
        'A breezy, youthful romantic comedy directed by Anuj Saini and produced by Luv Ranjan and Ankur Garg. Ten years after high school, three lifelong friends reunite at a school event and embark on a humorous, heartwarming quest across cities to reconnect with their first loves to see if high-school romance deserves a second chance.',
      cast: [
        { name: 'Sparsh Walia', character: 'Kabir' },
        { name: 'Alisha Chopra', character: 'Meera' },
        { name: 'Kunal Aryan Vaid', character: 'Dhruv' },
        { name: 'Sakshi Vaidya', character: 'Rhea' }
      ]
    },
    {
      _id: '65f1b0000000000000000101',
      title: 'Udta Teer',
      aliases: ['UdtaTeer', 'Ayushmann Khurrana Udta Teer'],
      director: 'Aakash Kaushik',
      industry: 'Bollywood',
      rating: 8.8,
      duration: 138,
      genre: ['Action', 'Comedy', 'Spy'],
      ticketPrice: 350,
      theater: 'iMovies PVR ICON Lower Parel',
      posterUrl: '/posters/udta-teer.jpg',
      backdropUrl: 'https://img.youtube.com/vi/hN_ZUElLH44/maxresdefault.jpg',
      trailerKey: 'hN_ZUElLH44',
      description:
        'A high-energy Bollywood spy-comedy following Vikrant Thapar, a memory-losing counter-terrorism agent who mistakenly gets embroiled in an exhilarating whirlwind of cross-border espionage intrigues, high-stakes missions, and situational comedy alongside fearless agent Yamini.',
      cast: [
        { name: 'Ayushmann Khurrana', character: 'Vikrant Thapar' },
        { name: 'Sara Ali Khan', character: 'Yamini' },
        { name: 'Jaideep Ahlawat', character: 'Rathore' }
      ]
    },
    {
      _id: '65f1b0000000000000000103',
      title: 'Hanuman Ansh',
      aliases: ['Hanumaan Ansh', 'Neem Karoli Baba', 'Baba Neeb Karori'],
      director: 'Vishal Chaturvedi',
      industry: 'Bollywood',
      rating: 9.3,
      duration: 148,
      genre: ['Biography', 'Drama', 'Devotional'],
      ticketPrice: 350,
      theater: 'iMovies Directors Cut Vasant Kunj',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Hanuman_Ansh_poster_theatrical.jpg',
      backdropUrl: 'https://img.youtube.com/vi/YyqWmKgHupk/sddefault.jpg',
      trailerKey: 'YyqWmKgHupk',
      description:
        'A 2026 biographical devotional drama honoring the sacred life, miracles, and compassionate spiritual journey of revered saint Neem Karoli Baba (Baba Neeb Karori). Witness his inspiring path from his early search for divine truth to his timeless global legacy.',
      cast: [
        { name: 'Shobhinaw Satyaa', character: 'Neem Karoli Baba' },
        { name: 'Chandan Anand', character: 'Dr. Ram Nandan Bhosale' },
        { name: 'Purnima Tiwari', character: 'Ram Dulari' }
      ]
    },
    {
      _id: '65f1b0000000000000000106',
      title: 'Nayi Naveli',
      aliases: ['Nayyi Navelli', 'Yami Gautam Nayi Naveli'],
      director: 'Balaji Mohan',
      industry: 'Bollywood',
      rating: 8.8,
      duration: 134,
      genre: ['Comedy', 'Horror', 'Drama'],
      ticketPrice: 320,
      theater: 'iMovies INOX Megaplex Malad',
      posterUrl: '/posters/nayyi-navelli.jpg',
      backdropUrl: 'https://img.youtube.com/vi/NPkMecGOxDc/maxresdefault.jpg',
      trailerKey: 'NPkMecGOxDc',
      description:
        'A hilarious comedy-horror spectacle starring Yami Gautam as Mohini. When an unsuspecting newlywed bride arrives at an enigmatic ancestral estate, a cascade of quirky supernatural hauntings and eccentric folklore turn everything upside down.',
      cast: [
        { name: 'Yami Gautam', character: 'Mohini' },
        { name: 'Adinath Kothare', character: 'Rohan' },
        { name: 'Sunita Rajwar', character: 'Mausi Ji' }
      ]
    }
  ];

  const spotlightMovies = spotlightConfig.map((cfg) => {
    const fromApi = movies.find(
      (m) => m._id === cfg._id || m.title?.toLowerCase() === cfg.title.toLowerCase()
    );
    return fromApi ? { ...cfg, ...fromApi } : cfg;
  });

  // Featured Hero Banner Selection: Exclude Deadpool & Wolverine, prioritize current premiering titles like Udta Teer
  const featuredMovie =
    movies.find(
      (m) =>
        (m.title?.toLowerCase().includes('udta teer') || m._id === '65f1b0000000000000000101')
    ) ||
    movies.find(
      (m) =>
        m.category === 'now_playing' &&
        !m.title?.toLowerCase().includes('deadpool') &&
        !m.title?.toLowerCase().includes('wolverine')
    ) ||
    movies.find(
      (m) =>
        !m.title?.toLowerCase().includes('deadpool') &&
        !m.title?.toLowerCase().includes('wolverine')
    ) ||
    movies[0] ||
    null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Worldwide Location & Status Sub-header */}
      <div className="bg-white border border-[#EAE2D5] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 bg-[#FFF9F0] hover:bg-[#FFF6DC] border border-[#EAE2D5] text-[#2B2B2B] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="Click to change Country, State, or City manually"
          >
            <Globe className="w-4 h-4 text-[#E63946]" aria-hidden="true" />
            <span>
              {activeCountry?.name} · {city}{state ? `, ${state}` : ''}
            </span>
            <span className="text-[#D62839] font-mono font-bold">({activeCountry?.currency})</span>
          </button>

          {/* Dedicated Live Location Fetch Button */}
          <button
            type="button"
            onClick={async () => {
              try {
                await detectCurrentLocation();
              } catch (e) {
                console.error(e);
              }
            }}
            disabled={detectingLocation}
            className="flex items-center gap-2 bg-[#FDECEC] hover:bg-[#FCD7D7] border border-[#F9B2B2] text-[#B81D2D] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Fetch live location automatically with GPS and IP detection"
          >
            <Compass className={`w-3.5 h-3.5 text-[#E63946] ${detectingLocation ? 'animate-spin' : ''}`} />
            <span>{detectingLocation ? 'Detecting Live Location...' : 'Fetch Live Location'}</span>
          </button>

          {locationStatus?.message && (
            <span className="text-[11px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3 h-3 text-[#10B981]" />
              <span className="truncate max-w-[260px] sm:max-w-none">{locationStatus.message}</span>
            </span>
          )}

          {selectedCinema && (
            <span className="text-xs text-[#6B7280] flex items-center gap-1.5 hidden xl:inline-flex">
              <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
              <span>
                Preferred: <strong className="text-[#2B2B2B]">{selectedCinema.name}</strong>
              </span>
            </span>
          )}
        </div>

        {/* Live Data Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7A5B14] bg-[#FFF6DC] border border-[#FFEDB0] px-2.5 py-1 rounded-lg shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E5B129] animate-pulse" />
            Hollywood & Bollywood VIP Catalog · Live Seat Holds
          </span>
        </div>
      </div>

      {/* Featured Hero Banner */}
      {featuredMovie && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-[#FFF9F0] to-[#FFF2D9] border border-[#EEDCC7] p-8 sm:p-12 shadow-md shadow-amber-950/5 cinema-vignette">
          {/* Ambient warm golden/crimson cinema spotlight glow */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#FFC93C]/25 via-[#E63946]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-[#E63946]/10 via-[#FFC93C]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {featuredMovie.backdropUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none filter blur-[1px]"
              style={{ backgroundImage: `url(${featuredMovie.backdropUrl})` }}
            />
          )}

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider text-[#92400E] bg-gradient-to-r from-[#FFF6DC] to-[#FEF3C7] border border-[#FCD34D] px-3.5 py-1.5 rounded-lg shadow-xs">
                <Award className="w-4 h-4 text-[#D97706]" />
                Featured Premiere · {featuredMovie.industry || 'Worldwide'}
              </div>

              {featuredMovie.industry === 'Bollywood' && (
                <span className="text-xs font-extrabold text-[#065F46] bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] px-3 py-1 rounded-lg shadow-xs">
                  Hindi Cinema Blockbuster
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F2937] tracking-tight leading-tight [text-wrap:balance]">
              {featuredMovie.title}
            </h1>

            <p className="text-[#4B5563] text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-3">
              {featuredMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] pt-1">
              <span className="flex items-center gap-1.5 text-[#92400E] font-black bg-gradient-to-r from-[#FFF6DC] to-[#FEF3C7] border border-[#FCD34D] px-3.5 py-1.5 rounded-lg font-mono shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] stroke-[#D97706]" />
                <span>{featuredMovie.rating || 8.5}</span>
                {featuredMovie.votes && (
                  <span className="text-[11px] text-[#6B7280] font-normal">
                    ({featuredMovie.votes >= 1000 ? `${(featuredMovie.votes / 1000).toFixed(1)}k` : featuredMovie.votes} votes)
                  </span>
                )}
              </span>
              <span className="text-[#B91C1C] font-extrabold bg-gradient-to-r from-[#FDECEC] to-[#FEE2E2] border border-[#FECACA] px-3.5 py-1.5 rounded-lg font-mono shadow-xs">
                {formatPrice(featuredMovie.ticketPrice)} per seat
              </span>
              <span className="text-[#4B5563] font-medium">
                {featuredMovie.duration} mins ·{' '}
                {Array.isArray(featuredMovie.genre)
                  ? featuredMovie.genre.join(', ')
                  : featuredMovie.genre}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={`/movies/${featuredMovie._id}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E63946] via-[#ED3944] to-[#C1121F] hover:from-[#D62839] hover:to-[#9B111E] text-white font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md shadow-[#E63946]/25 hover:shadow-xl hover:shadow-[#E63946]/35 transition-all"
              >
                <Ticket className="w-4 h-4 stroke-[2.5]" />
                <span>Reserve Seats on Interactive Map</span>
              </Link>

              {featuredMovie.trailerKey && (
                <button
                  type="button"
                  onClick={() => setTrailerModal({ isOpen: true, movie: featuredMovie })}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] hover:border-[#FCD34D] text-[#2B2B2B] px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Play className="w-4 h-4 fill-[#E63946] text-[#E63946]" />
                  <span>Watch 4K Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Premieres: Clayface, Hope, Ramayana, Drishyam, Udta Teer, Hanuman Ansh, Nayi Naveli, Pehla Pyaar */}
      <section aria-label="Trending Spotlight Premieres" className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D5] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B91C1C] bg-gradient-to-r from-[#FDECEC] to-[#FFF6DC] border border-[#FECACA] px-3 py-1 rounded-lg shadow-xs">
              <Flame className="w-3.5 h-3.5 text-[#E63946] fill-[#E63946]" />
              <span>Trending Spotlight Premieres</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Spotlight Premieres: Clayface, Hope, Ramayana, Drishyam, Udta Teer &amp; Pehla Pyaar
            </h2>
            <p className="text-xs text-[#6B7280]">
              Verified cast details, high-definition official 4K trailers, and real-time seat reservation for blockbuster premieres.
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#065F46] bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] px-3.5 py-1.5 rounded-xl self-start sm:self-auto shadow-xs">
            Now Showing in Theatres
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlightMovies.map((spot, idx) => (
            <div
              key={`spot-${spot._id}-${idx}`}
              className="bg-[#FFF9F0] border border-[#EAE2D5] hover:border-[#E63946]/40 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs transition-all duration-300 group hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                {/* Dual-Layer Cinema Poster Header: Ambient Backdrop + Crisp Centered Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-b from-[#1A1D20] to-[#2B2B2B] flex items-center justify-center">
                  {/* Atmospheric blurred ambient backdrop */}
                  <img
                    src={resolveMoviePoster(spot.title, spot.posterUrl || spot.backdropUrl)}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-35 scale-110 pointer-events-none"
                  />

                  {/* Crisp, clear uncropped theatrical thumbnail poster */}
                  <img
                    src={resolveMoviePoster(spot.title, spot.posterUrl || spot.backdropUrl)}
                    alt={spot.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 will-change-transform shadow-lg"
                    onError={(e) => {
                      const fallback = getFallbackMoviePoster(spot.title, e.currentTarget.src);
                      if (fallback && fallback !== e.currentTarget.src) {
                        e.currentTarget.src = fallback;
                        return;
                      }
                      if (e.currentTarget.src.includes('maxresdefault.jpg')) {
                        e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                        return;
                      }
                      e.currentTarget.src = DEFAULT_FALLBACK_POSTER;
                    }}
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Play Trailer Overlay Button */}
                  <button
                    type="button"
                    onClick={() => setTrailerModal({ isOpen: true, movie: spot })}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#E63946] hover:bg-[#D62839] text-white flex items-center justify-center transition-all shadow-md transform scale-90 group-hover:scale-100 cursor-pointer z-20"
                    title={`Watch Official ${spot.title} Trailer`}
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold bg-[#FFF6DC] text-[#7A5B14] border border-[#FFEDB0] px-2 py-0.5 rounded shadow-xs">
                      {spot.industry || 'Spotlight'}
                    </span>
                    <span className="text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#7A5B14] border border-[#FFEDB0] px-2 py-0.5 rounded">
                      ★ {spot.rating}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                    <span className="font-semibold">{Array.isArray(spot.genre) ? spot.genre.slice(0, 3).join(' · ') : spot.genre}</span>
                    <span className="font-mono">{spot.duration} min</span>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#2B2B2B] group-hover:text-[#E63946] transition-colors">
                      {spot.title}
                    </h3>
                    <p className="text-[11px] text-[#6B7280] font-medium">
                      Directed by <strong className="text-[#2B2B2B]">{spot.director}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>

                  {/* Cast Pills */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider block">
                      Starring Cast:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {spot.cast.map((c, i) => (
                        <span
                          key={i}
                          className="bg-white border border-[#EAE2D5] text-[11px] text-[#2B2B2B] px-2 py-0.5 rounded-lg"
                        >
                          <strong className="text-[#B81D2D]">{c.name}</strong>
                          {c.character ? ` (${c.character})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 sm:p-5 pt-0 flex items-center justify-between gap-2 border-t border-[#EAE2D5] mt-2">
                <button
                  type="button"
                  onClick={() => setTrailerModal({ isOpen: true, movie: spot })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E63946] hover:text-[#D62839] bg-white hover:bg-[#FDECEC] border border-[#EAE2D5] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Trailer</span>
                </button>

                <Link
                  to={`/movies/${spot._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#E63946] hover:bg-[#D62839] px-4 py-2 rounded-xl shadow-xs transition-all"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Select Seats</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Worldwide Discovery Bar: Industry Selector & Categories & Filters */}
      <div className="space-y-5">
        {/* Industry Filter Segment (Hollywood vs Bollywood) */}
        <div className="bg-white border border-[#EAE2D5] rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#4B5563] pl-2">
            <Film className="w-4 h-4 text-[#E63946]" />
            <span>Select Industry:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => setSelectedIndustry(ind.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  selectedIndustry === ind.id
                    ? 'bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white shadow-sm shadow-[#E63946]/20'
                    : 'bg-[#FFF9F0] text-[#4B5563] hover:text-[#2B2B2B] hover:bg-[#FFF6DC] border border-[#EAE2D5]'
                }`}
              >
                <span>{ind.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs: Now Showing | Upcoming | Top Rated */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#EAE2D5] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Screenings' },
              { id: 'now_playing', label: '🎬 Now Showing' },
              { id: 'upcoming', label: '⏳ Upcoming Releases (Coming Soon)' },
              { id: 'past', label: '🏛️ Past Classics & Archive' },
              { id: 'popular', label: '⭐ Top Rated Blockbusters' },
              { id: 'nearby_cinemas', label: '📍 Nearby Theatres & Showtimes' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryTab === tab.id
                    ? 'bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white shadow-sm shadow-[#E63946]/25'
                    : 'bg-white text-[#4B5563] hover:text-[#2B2B2B] hover:bg-[#FFF6DC] border border-[#EAE2D5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Admin Add Film Button */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFF6DC] to-[#FEF3C7] hover:from-[#FEF08A] hover:to-[#FDE047] text-[#92400E] border border-[#FCD34D] font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#D97706]" />
              Add Film (Admin)
            </button>
          )}
        </div>
      </div>

      {categoryTab === 'nearby_cinemas' ? (
        <NearbyCinemaFinder />
      ) : (
        <>
          <div className="space-y-5">
            {/* Toolbar: Language dropdown and Sorter (with Sort by Genre, Upcoming, Past) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-[#6B7280]">
                <span>Catalogue Exhibition &amp; Filters</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Language filter */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-white border border-[#EAE2D5] text-xs text-[#2B2B2B] font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#E63946] shadow-xs cursor-pointer"
                >
                  <option value="All">All Languages</option>
                  {LANGUAGES.slice(1).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>

                {/* Sort by dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#FFEDB0] text-xs text-[#7A5B14] font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#E63946] shadow-xs cursor-pointer"
                >
                  <option value="genre">Sort by Genre (Grouped A-Z)</option>
                  <option value="upcoming_first">⏳ Upcoming Releases First</option>
                  <option value="past_first">🏛️ Past Classics First (Oldest to Newest)</option>
                  <option value="releaseDate">Newest Releases (Latest Date)</option>
                  <option value="rating">Highest Rated (Rating ↓)</option>
                  <option value="title">Alphabetical (A-Z)</option>
                  <option value="duration">Longest Duration</option>
                </select>
              </div>
            </div>

        {/* Dedicated Minimum Rating Slider & Dropdown Control */}
        <div className="bg-white border border-[#EAE2D5] rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#2B2B2B]">
                <Star className="w-4 h-4 text-[#FFC93C] fill-[#FFC93C]" />
                Minimum Rating:
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg border font-mono tabular-nums ${
                  minRating > 0
                    ? 'bg-[#FFF6DC] border-[#FFEDB0] text-[#7A5B14] shadow-xs'
                    : 'bg-[#FAF5EE] border-[#EAE2D5] text-[#6B7280]'
                }`}
              >
                {minRating > 0 ? `${Number(minRating).toFixed(1)}+` : 'Any Rating'}
              </span>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 ml-1 flex-wrap">
                {[
                  { label: 'All', val: 0 },
                  { label: '8.0+', val: 8.0 },
                  { label: '8.5+', val: 8.5 },
                  { label: '8.8+', val: 8.8 },
                  { label: '9.0+', val: 9.0 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setMinRating(preset.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      minRating === preset.val
                        ? 'bg-[#E63946] text-white shadow-xs'
                        : 'bg-[#FFF9F0] text-[#6B7280] hover:text-[#2B2B2B] border border-[#EAE2D5]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {minRating > 0 && (
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#E63946] hover:text-[#D62839] hover:underline pl-1 transition-colors cursor-pointer"
                  title="Reset to All Ratings"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Rating Dropdown selector */}
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <label htmlFor="min-rating-select" className="text-xs text-[#6B7280] whitespace-nowrap hidden sm:inline">
                Preset Dropdown:
              </label>
              <select
                id="min-rating-select"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="bg-[#FFF9F0] border border-[#EAE2D5] text-xs text-[#7A5B14] font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#E63946] cursor-pointer"
              >
                {RATING_DROPDOWN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#9CA3AF] shrink-0">0.0 (All)</span>
              <input
                type="range"
                min="0"
                max="9.2"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                aria-label="Filter movies by minimum rating"
                className="w-full h-2 bg-[#EAE2D5] rounded-lg appearance-none cursor-pointer accent-[#E63946] focus:outline-none"
              />
              <span className="text-[11px] font-mono text-[#D62839] font-bold shrink-0">9.2</span>
            </div>
            <div className="flex justify-between text-[10px] text-[#9CA3AF] px-1 font-mono">
              <span>All Films</span>
              <span>7.5+</span>
              <span className="text-[#7A5B14] font-bold">8.0+ Highly Rated</span>
              <span className="text-[#B81D2D] font-bold">8.5+ Critical Acclaim</span>
              <span className="text-[#E63946] font-extrabold">9.0+ Masterpieces</span>
            </div>
          </div>
        </div>

        {/* Enhanced Genre Filter Pills */}
        <div>
          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-[#6B7280]">
              Filter by Genre:
            </span>
            <span className="text-[11px] text-[#D62839] font-mono font-bold">
              {movies.length} {movies.length === 1 ? 'film' : 'films'} available
              {minRating > 0 ? ` (≥ ${minRating.toFixed(1)} rating)` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-[#EAE2D5] shadow-xs">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white shadow-sm shadow-[#E63946]/20'
                    : 'text-[#4B5563] hover:text-[#B91C1C] hover:bg-[#FFF6DC]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort by Genre Active Status Banner */}
      {sortBy === 'genre' && movies.length > 0 && (
        <div className="flex items-center justify-between bg-[#FFF9F0] border border-[#EAE2D5] px-4 py-2.5 rounded-xl text-xs text-[#2B2B2B] shadow-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#E63946] shrink-0" />
            <span>
              <strong>Sorted by Genre:</strong> Movies are grouped and ordered alphabetically by genre (Action, Animation, Biography, Comedy, Crime, Drama, Family, Fantasy, History, Horror, Musical, Mystery, Romance, Sci-Fi, Sports, Thriller, War).
            </span>
          </div>
          <span className="text-[11px] text-[#D62839] font-mono font-bold hidden sm:inline whitespace-nowrap pl-2">
            A → Z Genres
          </span>
        </div>
      )}

      {/* Active Search Status Banner */}
      {search && (
        <div className="flex items-center justify-between bg-[#FFF6DC] border border-[#FFEDB0] px-4 py-3 rounded-2xl text-xs text-[#2B2B2B] shadow-xs">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#E63946] shrink-0" />
            <span>
              Search results for <strong>&ldquo;{search}&rdquo;</strong> &mdash;{' '}
              <span className="text-[#D62839] font-bold font-mono">
                {movies.length} {movies.length === 1 ? 'film' : 'films'} found
              </span>
              {selectedIndustry !== 'All' ? ` in ${selectedIndustry}` : ''}
              {selectedGenre !== 'All' ? ` (${selectedGenre})` : ''}
              {minRating > 0 ? ` with rating ≥ ${minRating.toFixed(1)}` : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="text-[#E63946] hover:text-[#D62839] font-bold inline-flex items-center gap-1 text-[11px] hover:underline shrink-0 pl-3 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Search</span>
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-white border border-[#EAE2D5] shadow-xs animate-pulse"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE2D5] space-y-4 max-w-lg mx-auto p-6 shadow-xs">
          <Clapperboard className="w-10 h-10 text-[#9CA3AF] mx-auto" />
          <div className="space-y-1">
            <p className="text-[#2B2B2B] font-bold text-base">
              No movies found matching your criteria.
            </p>
            <p className="text-xs text-[#6B7280]">
              {search && (selectedIndustry !== 'All' || selectedGenre !== 'All' || minRating > 0)
                ? `"${search}" was not found with your current industry (${selectedIndustry}), genre (${selectedGenre}), or rating (≥ ${minRating}) filters.`
                : minRating > 0
                ? `No ${selectedIndustry !== 'All' ? selectedIndustry : ''} ${selectedGenre !== 'All' ? selectedGenre : ''} movies found with rating ≥ ${minRating.toFixed(1)}.`
                : 'Try adjusting your Industry selection, Genre filter, or search keywords.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {search && (selectedIndustry !== 'All' || selectedGenre !== 'All' || minRating > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedIndustry('All');
                  setSelectedGenre('All');
                  setSelectedLanguage('All');
                  setMinRating(0);
                  setCategoryTab('all');
                }}
                className="inline-flex items-center gap-1.5 bg-[#E63946] hover:bg-[#D62839] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Search &ldquo;{search}&rdquo; Across All Categories</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                handleSearchChange('');
                setSelectedIndustry('All');
                setSelectedGenre('All');
                setSelectedLanguage('All');
                setMinRating(0);
                setCategoryTab('all');
              }}
              className="inline-flex items-center gap-2 bg-[#FFF9F0] hover:bg-[#FFF6DC] border border-[#EAE2D5] text-[#2B2B2B] text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie, idx) => (
            <MovieCard
              key={`movie-${movie._id}-${idx}`}
              movie={movie}
              onWatchTrailer={(m) => setTrailerModal({ isOpen: true, movie: m })}
            />
          ))}
        </div>
      )}
        </>
      )}

      {/* 4K Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() => setTrailerModal({ isOpen: false, movie: null })}
        trailerKey={trailerModal.movie?.trailerKey}
        title={trailerModal.movie?.title}
      />

      {/* Worldwide Region Modal */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      {/* Admin Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE2D5] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-3">
              <h3 className="text-lg font-bold text-[#2B2B2B] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#E63946]" />
                Add Film Presentation
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9CA3AF] hover:text-[#2B2B2B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMovie} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2B2B2B] mb-1 text-xs font-semibold">Movie Title *</label>
                  <input
                    type="text"
                    required
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                    className="w-full bg-[#FFF9F0] border border-[#EAE2D5] focus:border-[#E63946] rounded-lg px-3 py-2 text-[#2B2B2B] focus:outline-none"
                    placeholder="e.g., Singham Again"
                  />
                </div>
                <div>
                  <label className="block text-[#2B2B2B] mb-1 text-xs font-semibold">Industry *</label>
                  <select
                    value={newMovie.industry}
                    onChange={(e) => setNewMovie({ ...newMovie, industry: e.target.value })}
                    className="w-full bg-[#FFF9F0] border border-[#EAE2D5] focus:border-[#E63946] rounded-lg px-3 py-2 text-[#2B2B2B] focus:outline-none text-xs"
                  >
                    <option value="Hollywood">Hollywood</option>
                    <option value="Bollywood">Bollywood</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2B2B2B] mb-1 text-xs font-semibold">Description</label>
                <textarea
                  rows="2"
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  className="w-full bg-[#FFF9F0] border border-[#EAE2D5] focus:border-[#E63946] rounded-lg px-3 py-2 text-[#2B2B2B] focus:outline-none"
                  placeholder="Official plot synopsis..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2B2B2B] mb-1 text-xs font-semibold">Genres (comma-separated)</label>
                  <input
                    type="text"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full bg-[#FFF9F0] border border-[#EAE2D5] focus:border-[#E63946] rounded-lg px-3 py-2 text-[#2B2B2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#2B2B2B] mb-1 text-xs font-semibold">Duration (mins)</label>
                  <input
                    type="number"
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F0] border border-[#EAE2D5] focus:border-[#E63946] rounded-lg px-3 py-2 text-[#2B2B2B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2B2B2B] mb-1 text-xs font-semibold">Ticket Price (₹)</label>
                  <input
                    type="number"
                    value={newMovie.ticketPrice}
                    onChange={(e) => setNewMovie({ ...newMovie, ticketPrice: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F0] border border-[#EAE2D5] focus:border-[#E63946] rounded-lg px-3 py-2 text-[#2B2B2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#2B2B2B] mb-1 text-xs font-semibold">Poster URL</label>
                  <input
                    type="url"
                    value={newMovie.posterUrl}
                    onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                    className="w-full bg-[#FFF9F0] border border-[#EAE2D5] focus:border-[#E63946] rounded-lg px-3 py-2 text-[#2B2B2B] focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#FAF5EE] text-[#6B7280] hover:text-[#2B2B2B] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Publish Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;