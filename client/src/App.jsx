import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Bookings from './pages/Bookings';
import Cinemas from './pages/Cinemas';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div className="min-h-screen bg-[#FFF9F0] text-[#2B2B2B] flex flex-col selection:bg-[#FFC93C] selection:text-[#2B2B2B]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cinemas" element={<Cinemas />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <footer className="border-t border-[#EAE2D5] py-8 bg-white text-xs text-[#6B7280] text-center shadow-xs">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-['Space_Grotesk',sans-serif] tracking-wider text-[#2B2B2B] font-bold">
                  i<span className="text-[#E63946]">Movies</span> Worldwide Real-Time Movie Ticket Booking
                </p>
                <p>© {new Date().getFullYear()} iMovies. 4K IMAX Laser · Dolby Atmos · Reserve Suites · Cinema Verified.</p>
              </div>
            </footer>
          </div>
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;