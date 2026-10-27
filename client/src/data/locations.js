// Comprehensive hierarchical location data: Country -> State / Province / Region -> Cities
export const LOCATION_HIERARCHY = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    symbol: '₹',
    rateToUSD: 83.5,
    states: [
      {
        name: 'Maharashtra',
        code: 'MH',
        cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad']
      },
      {
        name: 'Delhi NCR',
        code: 'DL',
        cities: ['Delhi', 'New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad']
      },
      {
        name: 'Karnataka',
        code: 'KA',
        cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi']
      },
      {
        name: 'Telangana',
        code: 'TG',
        cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar']
      },
      {
        name: 'Tamil Nadu',
        code: 'TN',
        cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem']
      },
      {
        name: 'Gujarat',
        code: 'GJ',
        cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar']
      },
      {
        name: 'West Bengal',
        code: 'WB',
        cities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol']
      },
      {
        name: 'Uttar Pradesh',
        code: 'UP',
        cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Meerut']
      },
      {
        name: 'Rajasthan',
        code: 'RJ',
        cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer']
      },
      {
        name: 'Punjab & Chandigarh',
        code: 'PB',
        cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala']
      },
      {
        name: 'Kerala',
        code: 'KL',
        cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur']
      },
      {
        name: 'Madhya Pradesh',
        code: 'MP',
        cities: ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur']
      },
      {
        name: 'Bihar',
        code: 'BR',
        cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur']
      },
      {
        name: 'Andhra Pradesh',
        code: 'AP',
        cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati']
      }
    ]
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    rateToUSD: 1.0,
    states: [
      {
        name: 'New York',
        code: 'NY',
        cities: ['New York', 'Buffalo', 'Albany', 'Rochester', 'Syracuse']
      },
      {
        name: 'California',
        code: 'CA',
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento']
      },
      {
        name: 'Illinois',
        code: 'IL',
        cities: ['Chicago', 'Naperville', 'Rockford', 'Aurora', 'Springfield']
      },
      {
        name: 'Texas',
        code: 'TX',
        cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth']
      },
      {
        name: 'Washington',
        code: 'WA',
        cities: ['Seattle', 'Bellevue', 'Spokane', 'Tacoma']
      },
      {
        name: 'Florida',
        code: 'FL',
        cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale']
      }
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    rateToUSD: 0.79,
    states: [
      {
        name: 'Greater London',
        code: 'GL',
        cities: ['London', 'Westminster', 'Camden', 'Greenwich']
      },
      {
        name: 'Greater Manchester',
        code: 'GM',
        cities: ['Manchester', 'Salford', 'Bolton', 'Stockport']
      },
      {
        name: 'West Midlands',
        code: 'WM',
        cities: ['Birmingham', 'Coventry', 'Wolverhampton', 'Solihull']
      },
      {
        name: 'Scotland',
        code: 'SCT',
        cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee']
      }
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    symbol: 'CA$',
    rateToUSD: 1.36,
    states: [
      {
        name: 'Ontario',
        code: 'ON',
        cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton']
      },
      {
        name: 'British Columbia',
        code: 'BC',
        cities: ['Vancouver', 'Victoria', 'Burnaby', 'Surrey']
      },
      {
        name: 'Quebec',
        code: 'QC',
        cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau']
      }
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    symbol: 'A$',
    rateToUSD: 1.52,
    states: [
      {
        name: 'New South Wales',
        code: 'NSW',
        cities: ['Sydney', 'Newcastle', 'Wollongong']
      },
      {
        name: 'Victoria',
        code: 'VIC',
        cities: ['Melbourne', 'Geelong', 'Ballarat']
      },
      {
        name: 'Queensland',
        code: 'QLD',
        cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast']
      }
    ]
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    symbol: '€',
    rateToUSD: 0.92,
    states: [
      {
        name: 'Berlin',
        code: 'BE',
        cities: ['Berlin']
      },
      {
        name: 'Bavaria',
        code: 'BY',
        cities: ['Munich', 'Nuremberg', 'Augsburg']
      },
      {
        name: 'Hamburg',
        code: 'HH',
        cities: ['Hamburg']
      }
    ]
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    symbol: '¥',
    rateToUSD: 155.0,
    states: [
      {
        name: 'Kanto (Tokyo Area)',
        code: 'KT',
        cities: ['Tokyo', 'Yokohama', 'Chiba', 'Kawasaki']
      },
      {
        name: 'Kansai (Osaka Area)',
        code: 'KS',
        cities: ['Osaka', 'Kyoto', 'Kobe']
      }
    ]
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    symbol: 'S$',
    rateToUSD: 1.35,
    states: [
      {
        name: 'Central Region',
        code: 'CR',
        cities: ['Singapore', 'Orchard', 'Marina Bay', 'Sentosa']
      }
    ]
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    symbol: 'AED ',
    rateToUSD: 3.67,
    states: [
      {
        name: 'Dubai',
        code: 'DXB',
        cities: ['Dubai', 'Downtown Dubai', 'Dubai Marina', 'Deira']
      },
      {
        name: 'Abu Dhabi',
        code: 'AUH',
        cities: ['Abu Dhabi', 'Yas Island', 'Al Ain']
      }
    ]
  }
];

// Helper to look up country by code or name
export const getCountryByCode = (code) => {
  return LOCATION_HIERARCHY.find((c) => c.code.toUpperCase() === String(code).toUpperCase()) || LOCATION_HIERARCHY[0];
};

// Flattened city coordinate index for geospatial proximity calculation
export const CITY_COORDINATES = {
  // India
  Mumbai: { lat: 19.076, lng: 72.8777, country: 'IN', state: 'Maharashtra' },
  Pune: { lat: 18.5204, lng: 73.8567, country: 'IN', state: 'Maharashtra' },
  Nagpur: { lat: 21.1458, lng: 79.0882, country: 'IN', state: 'Maharashtra' },
  Nashik: { lat: 19.9975, lng: 73.7898, country: 'IN', state: 'Maharashtra' },
  Delhi: { lat: 28.6139, lng: 77.209, country: 'IN', state: 'Delhi NCR' },
  'New Delhi': { lat: 28.6139, lng: 77.209, country: 'IN', state: 'Delhi NCR' },
  Noida: { lat: 28.5355, lng: 77.391, country: 'IN', state: 'Delhi NCR' },
  Gurugram: { lat: 28.4595, lng: 77.0266, country: 'IN', state: 'Delhi NCR' },
  Bengaluru: { lat: 12.9716, lng: 77.5946, country: 'IN', state: 'Karnataka' },
  Mysuru: { lat: 12.2958, lng: 76.6394, country: 'IN', state: 'Karnataka' },
  Hyderabad: { lat: 17.385, lng: 78.4867, country: 'IN', state: 'Telangana' },
  Chennai: { lat: 13.0827, lng: 80.2707, country: 'IN', state: 'Tamil Nadu' },
  Coimbatore: { lat: 11.0168, lng: 76.9558, country: 'IN', state: 'Tamil Nadu' },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, country: 'IN', state: 'Gujarat' },
  Surat: { lat: 21.1702, lng: 72.8311, country: 'IN', state: 'Gujarat' },
  Kolkata: { lat: 22.5726, lng: 88.3639, country: 'IN', state: 'West Bengal' },
  Lucknow: { lat: 26.8467, lng: 80.9462, country: 'IN', state: 'Uttar Pradesh' },
  Kanpur: { lat: 26.4499, lng: 80.3319, country: 'IN', state: 'Uttar Pradesh' },
  Varanasi: { lat: 25.3176, lng: 82.9739, country: 'IN', state: 'Uttar Pradesh' },
  Jaipur: { lat: 26.9124, lng: 75.7873, country: 'IN', state: 'Rajasthan' },
  Chandigarh: { lat: 30.7333, lng: 76.7794, country: 'IN', state: 'Punjab & Chandigarh' },
  Kochi: { lat: 9.9312, lng: 76.2673, country: 'IN', state: 'Kerala' },
  Indore: { lat: 22.7196, lng: 75.8577, country: 'IN', state: 'Madhya Pradesh' },
  Patna: { lat: 25.5941, lng: 85.1376, country: 'IN', state: 'Bihar' },
  Visakhapatnam: { lat: 17.6868, lng: 83.2185, country: 'IN', state: 'Andhra Pradesh' },

  // US
  'New York': { lat: 40.7128, lng: -74.006, country: 'US', state: 'New York' },
  'Los Angeles': { lat: 34.0522, lng: -118.2437, country: 'US', state: 'California' },
  'San Francisco': { lat: 37.7749, lng: -122.4194, country: 'US', state: 'California' },
  Chicago: { lat: 41.8781, lng: -87.6298, country: 'US', state: 'Illinois' },
  Houston: { lat: 29.7604, lng: -95.3698, country: 'US', state: 'Texas' },
  Austin: { lat: 30.2672, lng: -97.7431, country: 'US', state: 'Texas' },
  Seattle: { lat: 47.6062, lng: -122.3321, country: 'US', state: 'Washington' },
  Miami: { lat: 25.7617, lng: -80.1918, country: 'US', state: 'Florida' },

  // UK
  London: { lat: 51.5074, lng: -0.1278, country: 'GB', state: 'Greater London' },
  Manchester: { lat: 53.4808, lng: -2.2426, country: 'GB', state: 'Greater Manchester' },
  Birmingham: { lat: 52.4862, lng: -1.8904, country: 'GB', state: 'West Midlands' },
  Edinburgh: { lat: 55.9533, lng: -3.1883, country: 'GB', state: 'Scotland' },

  // Canada
  Toronto: { lat: 43.6532, lng: -79.3832, country: 'CA', state: 'Ontario' },
  Vancouver: { lat: 49.2827, lng: -123.1207, country: 'CA', state: 'British Columbia' },
  Montreal: { lat: 45.5017, lng: -73.5673, country: 'CA', state: 'Quebec' },

  // Australia
  Sydney: { lat: -33.8688, lng: 151.2093, country: 'AU', state: 'New South Wales' },
  Melbourne: { lat: -37.8136, lng: 144.9631, country: 'AU', state: 'Victoria' },
  Brisbane: { lat: -27.4698, lng: 153.0251, country: 'AU', state: 'Queensland' },

  // Germany
  Berlin: { lat: 52.52, lng: 13.405, country: 'DE', state: 'Berlin' },
  Munich: { lat: 48.1351, lng: 11.582, country: 'DE', state: 'Bavaria' },
  Hamburg: { lat: 53.5511, lng: 9.9937, country: 'DE', state: 'Hamburg' },

  // Japan
  Tokyo: { lat: 35.6762, lng: 139.6503, country: 'JP', state: 'Kanto (Tokyo Area)' },
  Osaka: { lat: 34.6937, lng: 135.5023, country: 'JP', state: 'Kansai (Osaka Area)' },
  Kyoto: { lat: 35.0116, lng: 135.7681, country: 'JP', state: 'Kansai (Osaka Area)' },

  // Singapore
  Singapore: { lat: 1.3521, lng: 103.8198, country: 'SG', state: 'Central Region' },

  // UAE
  Dubai: { lat: 25.2048, lng: 55.2708, country: 'AE', state: 'Dubai' },
  'Abu Dhabi': { lat: 24.4539, lng: 54.3773, country: 'AE', state: 'Abu Dhabi' }
};

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Find the closest city and state hierarchy from GPS coordinates
export const findClosestLocation = (lat, lng) => {
  let closestCity = 'Mumbai';
  let closestCountry = 'IN';
  let closestState = 'Maharashtra';
  let minDistance = Infinity;

  // Check if roughly in India bounding box: lat ~ 6°N - 37°N, lng ~ 68°E - 98°E
  const isRoughlyInIndia = lat >= 6 && lat <= 38 && lng >= 67 && lng <= 99;

  Object.entries(CITY_COORDINATES).forEach(([cName, data]) => {
    const dist = calculateDistanceKm(lat, lng, data.lat, data.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = cName;
      closestCountry = data.country;
      closestState = data.state;
    }
  });

  // If coordinates fall in India, guarantee India preselection
  if (isRoughlyInIndia && closestCountry !== 'IN') {
    closestCountry = 'IN';
    closestState = 'Maharashtra';
    closestCity = 'Mumbai';
  }

  return {
    country: closestCountry,
    state: closestState,
    city: closestCity,
    distanceKm: minDistance
  };
};
