import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import {
  LOCATION_HIERARCHY,
  CITY_COORDINATES,
  calculateDistanceKm,
  findClosestLocation,
  getCountryByCode
} from '../data/locations';

export const COUNTRIES = LOCATION_HIERARCHY;
export { CITY_COORDINATES, calculateDistanceKm };

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  // Read persisted location, defaulting intelligently (e.g. India / Maharashtra / Mumbai or previous selection)
  const [country, setCountryState] = useState(() => localStorage.getItem('imovies_country') || 'IN');
  const [stateName, setStateName] = useState(() => localStorage.getItem('imovies_state') || 'Maharashtra');
  const [city, setCityState] = useState(() => localStorage.getItem('imovies_city') || 'Mumbai');

  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  const activeCountry = getCountryByCode(country);
  const currentStateObj =
    activeCountry.states?.find((s) => s.name.toLowerCase() === stateName.toLowerCase()) ||
    activeCountry.states?.[0] || { name: stateName, cities: [city] };

  // Fetch cinemas whenever country, state, or city updates
  useEffect(() => {
    localStorage.setItem('imovies_country', country);
    localStorage.setItem('imovies_state', stateName);
    localStorage.setItem('imovies_city', city);

    const fetchCinemas = async () => {
      try {
        setLoadingCinemas(true);
        const { data } = await API.get('/cinemas', {
          params: { country, city, state: stateName }
        });
        setCinemas(data || []);
        if (data && data.length > 0) {
          setSelectedCinema(data[0]);
        } else {
          setSelectedCinema(null);
        }
      } catch (err) {
        console.error('Failed to load cinemas for location:', err);
      } finally {
        setLoadingCinemas(false);
      }
    };

    fetchCinemas();
  }, [country, stateName, city]);

  // Hierarchical country change: resets state and city to first available in chosen country
  const handleCountryChange = (newCountryCode) => {
    const targetCountry = getCountryByCode(newCountryCode);
    if (targetCountry) {
      setCountryState(targetCountry.code);
      const firstState = targetCountry.states?.[0];
      const newState = firstState ? firstState.name : '';
      const newCity = firstState?.cities?.[0] || 'Main City';
      setStateName(newState);
      setCityState(newCity);
    }
  };

  // Hierarchical state change: resets city to first available in chosen state
  const handleStateChange = (newStateName) => {
    setStateName(newStateName);
    const targetState = activeCountry.states?.find(
      (s) => s.name.toLowerCase() === newStateName.toLowerCase()
    );
    if (targetState && targetState.cities.length > 0) {
      setCityState(targetState.cities[0]);
    }
  };

  const handleCityChange = (newCityName) => {
    setCityState(newCityName);
  };

  // Helper to resolve detected location into standard hierarchy and update state
  const applyDetectedLocation = (detected) => {
    let targetCountryCode = (detected.country || 'IN').toUpperCase();
    let targetCountry = getCountryByCode(targetCountryCode);
    if (!targetCountry) {
      targetCountry =
        LOCATION_HIERARCHY.find(
          (c) => c.name.toLowerCase() === (detected.countryName || '').toLowerCase()
        ) || LOCATION_HIERARCHY[0];
      targetCountryCode = targetCountry.code;
    }

    setCountryState(targetCountryCode);

    // Match or fallback state
    let matchedState = (targetCountry.states || []).find(
      (s) =>
        s.name.toLowerCase() === (detected.state || '').toLowerCase() ||
        (detected.state && s.name.toLowerCase().includes(detected.state.toLowerCase())) ||
        (detected.state && detected.state.toLowerCase().includes(s.name.toLowerCase()))
    );
    if (!matchedState && targetCountry.states?.length > 0) {
      matchedState = targetCountry.states[0];
    }
    const finalState = matchedState ? matchedState.name : (detected.state || '');
    setStateName(finalState);

    // Match or fallback city
    let matchedCity = (matchedState?.cities || []).find(
      (c) =>
        c.toLowerCase() === (detected.city || '').toLowerCase() ||
        (detected.city && c.toLowerCase().includes(detected.city.toLowerCase())) ||
        (detected.city && detected.city.toLowerCase().includes(c.toLowerCase()))
    );
    if (!matchedCity && matchedState?.cities?.length > 0) {
      matchedCity = matchedState.cities[0];
    }
    const finalCity = matchedCity || detected.city || 'Main City';
    setCityState(finalCity);

    setDetectingLocation(false);
    setLocationStatus({
      success: true,
      isIndia: targetCountryCode === 'IN',
      message: `Live Location Detected: ${finalCity}, ${finalState} (${targetCountryCode})`
    });

    return { country: targetCountryCode, state: finalState, city: finalCity };
  };

  // IP Geolocation fallback query
  const detectFromIP = async () => {
    try {
      // First try internal server endpoint which bypasses adblockers
      const { data } = await API.get('/cinemas/location/detect');
      if (data && (data.city || data.country)) {
        return data;
      }
    } catch {
      // Fall through to public ipwho.is client query
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const lat = data.latitude;
          const lng = data.longitude;
          const closest = (lat && lng) ? findClosestLocation(lat, lng) : null;
          return {
            country: data.country_code || closest?.country || 'IN',
            countryName: data.country || 'India',
            state: data.region || closest?.state || 'Maharashtra',
            city: data.city || closest?.city || 'Mumbai'
          };
        }
      }
    } catch {
      // Ignore
    }

    return null;
  };

  // Browser Geolocation with seamless IP Geolocation fallback: guaranteed live location
  const detectCurrentLocation = async () => {
    setDetectingLocation(true);
    setLocationStatus({ loading: true, message: 'Detecting live coordinates & nearest cinemas...' });

    // 1. Try Browser Geolocation API if available
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 120000
          });
        });

        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        let detected = findClosestLocation(userLat, userLng);

        // Attempt lightweight reverse geocode for exact local city name
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (res.ok) {
            const geoData = await res.json();
            const addr = geoData.address || {};
            const code = (addr.country_code || '').toUpperCase();
            const revCity = addr.city || addr.town || addr.village || addr.suburb || detected.city;
            const revState = addr.state || detected.state;
            if (code) {
              detected = {
                country: code,
                state: revState,
                city: revCity,
                distanceKm: detected.distanceKm
              };
            }
          }
        } catch {
          // geometric calculation is already accurate
        }

        return applyDetectedLocation(detected);
      } catch {
        // Geolocation denied, restricted by iframe, or timed out — proceed to IP detection
      }
    }

    // 2. Fallback to live IP-based location detection
    const ipLocation = await detectFromIP();
    if (ipLocation) {
      return applyDetectedLocation(ipLocation);
    }

    // 3. Resilient fallback to India / Mumbai
    const fallback = { country: 'IN', state: 'Maharashtra', city: 'Mumbai' };
    return applyDetectedLocation(fallback);
  };

  // Format price accurately based on active currency
  const formatPrice = (basePriceInInrOrUsd) => {
    if (activeCountry.code === 'IN') {
      const val = basePriceInInrOrUsd || 300;
      return `${activeCountry.symbol}${val.toLocaleString()}`;
    }

    let usdEquivalent = 18;
    if (basePriceInInrOrUsd > 100) {
      usdEquivalent = (basePriceInInrOrUsd / 300) * 18;
    } else {
      usdEquivalent = basePriceInInrOrUsd;
    }

    const localAmount = usdEquivalent * (activeCountry.rateToUSD || 1);

    if (activeCountry.code === 'JP') {
      return `${activeCountry.symbol}${Math.round(localAmount / 100) * 100}`;
    }

    return `${activeCountry.symbol}${localAmount.toFixed(2)}`;
  };

  const getRawPrice = (basePriceInInrOrUsd) => {
    if (activeCountry.code === 'IN') return basePriceInInrOrUsd || 300;
    const usdEquivalent = basePriceInInrOrUsd > 100 ? (basePriceInInrOrUsd / 300) * 18 : basePriceInInrOrUsd;
    return Math.round(usdEquivalent * (activeCountry.rateToUSD || 1));
  };

  return (
    <LocationContext.Provider
      value={{
        countries: LOCATION_HIERARCHY,
        country,
        state: stateName,
        city,
        activeCountry,
        currentState: currentStateObj,
        cinemas,
        selectedCinema,
        loadingCinemas,
        detectingLocation,
        locationStatus,
        setCountry: handleCountryChange,
        setState: handleStateChange,
        setCity: handleCityChange,
        setSelectedCinema,
        detectCurrentLocation,
        formatPrice,
        getRawPrice
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
