import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && (parsed.username === 'Tanishq Pardeshi' || parsed.name === 'Tanishq Pardeshi')) {
          parsed.username = 'Eshani Jain';
          if (parsed.name) parsed.name = 'Eshani Jain';
          localStorage.setItem('user', JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const cleanEmail = typeof email === 'string' ? email.trim() : email;
    const { data } = await API.post('/auth/login', { email: cleanEmail, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (username, email, password, locationPrefs = {}) => {
    const { data } = await API.post('/auth/register', {
      username,
      email,
      password,
      preferredCountry: locationPrefs.country || 'US',
      preferredCity: locationPrefs.city || 'New York'
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await API.post('/auth/forgot-password', { email });
    return data;
  };

  const resetPassword = async (resetToken, newPassword) => {
    const { data } = await API.post('/auth/reset-password', { resetToken, newPassword });
    return data;
  };

  const googleLogin = async (profile) => {
    const { data } = await API.post('/auth/google', profile);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const updateUserLocation = async (country, city) => {
    try {
      const { data } = await API.put('/auth/location', { country, city });
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, preferredCountry: country, preferredCity: city };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
      return data;
    } catch {
      // Ignore if offline
    }
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/auth/profile', profileData);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      setUser((prev) => {
        const updated = {
          ...prev,
          ...data.user,
          token: data.token || prev?.token
        };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        googleLogin,
        updateUserLocation,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);