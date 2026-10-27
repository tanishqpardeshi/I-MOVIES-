const bcrypt = require('bcryptjs');

// Pre-hashed passwords for seed accounts
// 'admin123' and 'user123'
const defaultAdminPassHash = bcrypt.hashSync('admin123', 10);
const defaultUserPassHash = bcrypt.hashSync('user123', 10);

const INITIAL_USERS = [
  {
    _id: '65f1a0000000000000000001',
    username: 'Admin Manager',
    email: 'admin@imovies.com',
    password: defaultAdminPassHash,
    role: 'admin',
    favorites: ['65f1b0000000000000000001', '65f1b0000000000000000021'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a0000000000000000002',
    username: 'Eshani Jain',
    email: 'user@imovies.com',
    password: defaultUserPassHash,
    role: 'user',
    favorites: ['65f1b0000000000000000001', '65f1b0000000000000000022'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '65f1a0000000000000000003',
    username: 'Eshani Jain',
    email: 'jaineshani22@gmail.com',
    password: defaultUserPassHash,
    role: 'user',
    favorites: ['65f1b0000000000000000001', '65f1b0000000000000000022'],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_CINEMAS = [
  {
    _id: 'cin_us_nyc_01',
    name: 'iMovies Lincoln Square IMAX',
    chain: 'iMovies VIP',
    country: 'US',
    countryName: 'United States',
    city: 'New York',
    address: '1998 Broadway, New York, NY 10023',
    screens: 12,
    formats: ['IMAX 70mm Laser', 'Dolby Cinema', 'VIP Recliners'],
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 22,
    amenities: ['Heated Recliners', 'Full Bar Lounge', 'In-Seat Dining', 'Laser Projection'],
    rating: 4.9
  },
  {
    _id: 'cin_us_nyc_02',
    name: 'iMovies Times Square Dolby Palace',
    chain: 'iMovies VIP',
    country: 'US',
    countryName: 'United States',
    city: 'New York',
    address: '234 W 42nd St, New York, NY 10036',
    screens: 10,
    formats: ['Dolby Atmos', '4DX', 'RealD 3D'],
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 20,
    amenities: ['Motorized Recliners', 'Gourmet Concessions', 'Dolby Vision HDR'],
    rating: 4.8
  },
  {
    _id: 'cin_us_la_01',
    name: 'iMovies Century City Premiere',
    chain: 'iMovies VIP',
    country: 'US',
    countryName: 'United States',
    city: 'Los Angeles',
    address: '10250 Santa Monica Blvd, Los Angeles, CA 90067',
    screens: 14,
    formats: ['IMAX Laser', 'Dolby Cinema', 'ScreenX'],
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 21,
    amenities: ['Director Suites', 'Sommelier Selection', 'Valet Parking'],
    rating: 4.9
  },
  {
    _id: 'cin_gb_lon_01',
    name: 'iMovies Odeon Luxe Leicester Square',
    chain: 'iMovies VIP',
    country: 'GB',
    countryName: 'United Kingdom',
    city: 'London',
    address: '24-26 Leicester Square, London WC2H 7LQ',
    screens: 8,
    formats: ['Dolby Cinema', 'IMAX Laser', 'Royal Box'],
    currency: 'GBP',
    currencySymbol: '£',
    basePrice: 18,
    amenities: ['Oscar Wilde Bar', 'Luxury Reclining Seats', 'Dolby Atmos'],
    rating: 4.9
  },
  {
    _id: 'cin_gb_lon_02',
    name: 'iMovies BFI IMAX Southbank',
    chain: 'iMovies VIP',
    country: 'GB',
    countryName: 'United Kingdom',
    city: 'London',
    address: '1 Charlie Chaplin Walk, Waterloo, London SE1 8XR',
    screens: 1,
    formats: ['1.43:1 Giant IMAX Laser', '12-Channel Sound'],
    currency: 'GBP',
    currencySymbol: '£',
    basePrice: 22,
    amenities: ['Largest Screen in UK', 'Next-Gen Laser 4K', 'Premium Circle'],
    rating: 5.0
  },
  {
    _id: 'cin_in_mum_01',
    name: 'iMovies PVR ICON Lower Parel',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    city: 'Mumbai',
    address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai 400013',
    screens: 9,
    formats: ['IMAX Laser with Atmos', '4DX Motion', 'Gold Class Recliner'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 450,
    amenities: ['Plush Leather Recliners', 'Chef-Crafted Menu', 'Exclusive VIP Lounge'],
    rating: 4.9
  },
  {
    _id: 'cin_in_mum_02',
    name: 'iMovies INOX Megaplex Malad',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    city: 'Mumbai',
    address: 'Inorbit Mall, Link Road, Malad West, Mumbai 400064',
    screens: 11,
    formats: ['IMAX Laser', 'ScreenX 270°', 'MX4D', 'INSIGNIA VIP'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 380,
    amenities: ['Live Kitchen Gourmet Food', 'Butler on Call', 'Dolby Atmos Sound'],
    rating: 4.8
  },
  {
    _id: 'cin_in_mum_03',
    name: 'iMovies PVR INOX Maison Jio World Drive BKC',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Bandra Kurla Complex, Bandra East, Mumbai 400051',
    screens: 6,
    formats: ['IMAX Laser 4K', 'Luxe Living Room', 'Dolby Atmos'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 500,
    amenities: ['Celebrity VIP Suites', 'Masterchef Concessions', 'Butler Service', 'Valet Parking'],
    rating: 5.0
  },
  {
    _id: 'cin_in_mum_04',
    name: 'iMovies Cinepolis VIP Viviana Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Viviana Mall, Eastern Express Highway, Thane West, Mumbai 400606',
    screens: 14,
    formats: ['VIP Luxury Recliner', '4DX Motion', 'Dolby Atmos'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 390,
    amenities: ['Gourmet Live Counter', 'Leather Recliners', 'VIP Coffee Lounge'],
    rating: 4.8
  },
  {
    _id: 'cin_in_mum_05',
    name: 'iMovies PVR Dynamix Mall Juhu',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Dynamix Mall, Santacruz West, Juhu, Mumbai 400049',
    screens: 5,
    formats: ['PVR Gold Class', 'Dolby 7.1', 'Laser 4K'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 420,
    amenities: ['Plush Pushback Recliners', 'Artisan Coffee Bar', 'Valet Parking'],
    rating: 4.9
  },
  {
    _id: 'cin_in_mum_06',
    name: 'iMovies MovieMax Cineplex Sion',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Sion Circle, Opp Sion Railway Station, Sion, Mumbai 400022',
    screens: 4,
    formats: ['Dolby Atmos', 'Laser 4K', 'Prime Club Seating'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 280,
    amenities: ['Spacious Recliners', 'Classic Concessions', 'Quick Check-in'],
    rating: 4.7
  },
  {
    _id: 'cin_in_mum_07',
    name: 'iMovies Carnival Cinemas IMAX Wadala',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Anik Wadala Link Road, Bhakti Park, Wadala, Mumbai 400037',
    screens: 5,
    formats: ['Giant Screen IMAX Laser', 'Dolby Atmos', 'VIP Balcony'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 360,
    amenities: ['Massive Curved Screen', 'Reserved Recliner Pods', 'Gourmet Snacks'],
    rating: 4.8
  },
  {
    _id: 'cin_in_mum_08',
    name: 'iMovies INOX Laserplex Nariman Point',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'CR2 Mall, Barrister Rajni Patel Marg, Nariman Point, Mumbai 400021',
    screens: 5,
    formats: ['INSIGNIA VIP', 'Dolby Atmos', 'Laser 4K'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 480,
    amenities: ['South Mumbai Sea View Lounge', 'Chef Curated Menu', 'Butler In-Seat'],
    rating: 4.9
  },
  {
    _id: 'cin_in_del_01',
    name: 'iMovies Directors Cut Vasant Kunj',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Delhi',
    address: 'Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi 110070',
    screens: 6,
    formats: ['Platinum Suites', 'Dolby Atmos Laser', 'Dine-In Theater'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 650,
    amenities: ['180° Fully Reclining Beds', 'Curated Wine & Dine', 'Concierge Service'],
    rating: 5.0
  },
  {
    _id: 'cin_in_del_02',
    name: 'iMovies PVR Plaza Heritage Connaught Place',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Delhi',
    address: 'Block H, Radial Road 6, Connaught Place, New Delhi 110001',
    screens: 3,
    formats: ['Dolby Atmos Laser', 'Heritage Luxe', 'VIP Recliners'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 420,
    amenities: ['Iconic Heritage Ambiance', 'In-Seat Food Ordering', 'Dolby Atmos'],
    rating: 4.9
  },
  {
    _id: 'cin_in_del_03',
    name: 'iMovies INOX Insignia Epicuria Nehru Place',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Delhi',
    address: 'Epicuria Food Mall, Nehru Place Metro Station, New Delhi 110019',
    screens: 4,
    formats: ['INSIGNIA VIP', 'Dolby Atmos', 'Laser 4K'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 550,
    amenities: ['Private Lounge Access', 'Gourmet Platter Menu', 'Electric Recliners'],
    rating: 4.9
  },
  {
    _id: 'cin_in_del_04',
    name: 'iMovies Cinepolis VIP DLF Avenue Saket',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Delhi',
    address: 'DLF Avenue Mall, Press Enclave Marg, Saket District Centre, New Delhi 110017',
    screens: 6,
    formats: ['VIP Club Recliners', '4DX Motion', 'Dolby Atmos'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 480,
    amenities: ['Coffee Barista', 'Chef-Prepared Tapas', 'Motorized Loungers'],
    rating: 4.8
  },
  {
    _id: 'cin_in_del_05',
    name: 'iMovies PVR Superplex Logix Noida',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Delhi',
    address: 'Logix City Centre Mall, Sector 32, Noida 201301',
    screens: 15,
    formats: ['IMAX Laser', '4DX Motion', 'PlayHouse', 'Gold Class'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 380,
    amenities: ['15-Screen Mega Complex', 'VIP Lounge', 'Live Kitchen'],
    rating: 4.8
  },
  {
    _id: 'cin_in_del_06',
    name: 'iMovies PVR IMAX CyberHub Gurugram',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Delhi',
    address: 'DLF CyberHub, DLF Phase 2, Gurugram 122002',
    screens: 7,
    formats: ['IMAX 4K Laser', 'Dolby Atmos', 'VIP Recliners'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 460,
    amenities: ['Cyber City Corporate Concierge', 'Craft Dining Bar', 'Ultra-Plush Seats'],
    rating: 4.9
  },
  {
    _id: 'cin_ca_tor_01',
    name: 'iMovies Scotiabank Theatre IMAX',
    chain: 'iMovies VIP',
    country: 'CA',
    countryName: 'Canada',
    city: 'Toronto',
    address: '259 Richmond St W, Toronto, ON M5V 3M6',
    screens: 14,
    formats: ['IMAX Laser', 'UltraAVX', 'D-BOX Motion'],
    currency: 'CAD',
    currencySymbol: 'CA$',
    basePrice: 20,
    amenities: ['UltraAVX Atmos', 'VIP Lounge', 'Reserved Seating'],
    rating: 4.8
  },
  {
    _id: 'cin_au_syd_01',
    name: 'iMovies IMAX Sydney Harbour',
    chain: 'iMovies VIP',
    country: 'AU',
    countryName: 'Australia',
    city: 'Sydney',
    address: 'The Ribbon, 31 Wheat Rd, Darling Harbour NSW 2000',
    screens: 4,
    formats: ['World-Class IMAX 4K Laser', 'Full Recliners', 'Private Couches'],
    currency: 'AUD',
    currencySymbol: 'A$',
    basePrice: 28,
    amenities: ['Panoramic Harbour Views', 'Premium Pods', 'Gourmet Bar'],
    rating: 5.0
  },
  {
    _id: 'cin_jp_tok_01',
    name: 'iMovies TOHO Cinemas Roppongi Hills',
    chain: 'iMovies VIP',
    country: 'JP',
    countryName: 'Japan',
    city: 'Tokyo',
    address: '6-10-2 Roppongi, Minato-ku, Tokyo 106-0032',
    screens: 9,
    formats: ['MediaMation MX4D', 'TCX Dolby Atmos', 'Premier Luxury Box'],
    currency: 'JPY',
    currencySymbol: '¥',
    basePrice: 2200,
    amenities: ['Leather Luxury Box Seats', 'Pristine Cleanliness', 'English Subtitle Support'],
    rating: 4.9
  },
  {
    _id: 'cin_sg_sin_01',
    name: 'iMovies Shaw Theatres Lido IMAX',
    chain: 'iMovies VIP',
    country: 'SG',
    countryName: 'Singapore',
    city: 'Singapore',
    address: '350 Orchard Road, 5th/6th Floor Shaw House, Singapore 238868',
    screens: 11,
    formats: ['IMAX with Laser', 'Lumiere VIP Dining', 'Dolby Atmos'],
    currency: 'SGD',
    currencySymbol: 'S$',
    basePrice: 19,
    amenities: ['Electric Recliners', 'Complimentary Beverages', 'Orchard Road Access'],
    rating: 4.8
  },
  {
    _id: 'cin_ae_dxb_01',
    name: 'iMovies Reel Cinemas Dubai Mall',
    chain: 'iMovies VIP',
    country: 'AE',
    countryName: 'United Arab Emirates',
    city: 'Dubai',
    address: 'The Dubai Mall, Financial Centre Rd, Downtown Dubai',
    screens: 26,
    formats: ['Platinum Suites', 'IMAX Laser', 'ScreenX', 'Guy Fieri Dine-In'],
    currency: 'AED',
    currencySymbol: 'AED ',
    basePrice: 75,
    amenities: ['Private Butler Service', 'Blankets & Pillows', '5-Star Dining'],
    rating: 5.0
  },
  {
    _id: 'cin_de_ber_01',
    name: 'iMovies Zoo Palast Berlin',
    chain: 'de',
    country: 'DE',
    countryName: 'Germany',
    city: 'Berlin',
    address: 'Hardenbergstraße 29a, 10623 Berlin',
    screens: 7,
    formats: ['Dolby Atmos Heritage', 'Club Sessel Recliners', '4K Laser'],
    currency: 'EUR',
    currencySymbol: '€',
    basePrice: 17,
    amenities: ['Historic Grand Hall', 'Cocktail Service at Seat', 'Berlinale Red Carpet Venue'],
    rating: 4.9
  },
  {
    _id: 'cin_in_pun_01',
    name: 'iMovies PVR ICON The Pavilion',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    address: 'The Pavilion Mall, Senapati Bapat Road, Shivajinagar, Pune 411016',
    screens: 9,
    formats: ['IMAX Laser 4K', '4DX Motion', 'PVR Gold Class'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 380,
    amenities: ['180° Motorized Recliners', 'Gourmet In-Seat Dining', 'Dolby Atmos 12-Channel', 'Valet Parking'],
    rating: 4.9
  },
  {
    _id: 'cin_in_pun_02',
    name: 'iMovies Cinepolis Seasons Megaplex',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    address: 'Seasons Mall, Magarpatta City, Hadapsar, Pune 411028',
    screens: 15,
    formats: ['VIP Luxury Club', 'Dolby Atmos', 'RealD 3D', 'Macro XE'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 350,
    amenities: ['Plush Leather Recliners', 'Live Sushi & Dim Sum Counter', 'Dolby Atmos Sound'],
    rating: 4.8
  },
  {
    _id: 'cin_in_pun_03',
    name: 'iMovies INOX Phoenix Marketcity',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    address: 'Phoenix Marketcity, Viman Nagar, Pune 411014',
    screens: 8,
    formats: ['INSIGNIA VIP', 'IMAX Laser', 'ScreenX 270°'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 420,
    amenities: ['Butler On Call', 'Masterchef Curated Food', 'Laser Projection'],
    rating: 4.9
  },
  {
    _id: 'cin_in_blr_01',
    name: 'iMovies PVR Superplex Forum South',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    address: 'Forum Mall, Konanakunte, Kanakapura Road, Bengaluru 560062',
    screens: 11,
    formats: ['IMAX Laser', '4DX Motion', 'LUXE Gold Class'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 420,
    amenities: ['Motorized Recliners', 'Gourmet Lounge', 'Dolby Atmos Surround'],
    rating: 4.9
  },
  {
    _id: 'cin_in_blr_02',
    name: 'iMovies INOX Megaplex Nexus Shantiniketan',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    address: 'Nexus Shantiniketan Mall, Whitefield Main Rd, Bengaluru 560067',
    screens: 12,
    formats: ['IMAX Laser', 'ScreenX 270°', 'MX4D', 'INSIGNIA VIP'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 450,
    amenities: ['Live Teppanyaki & Pizza', 'Butler Service', 'Dolby Atmos Sound'],
    rating: 4.9
  },
  {
    _id: 'cin_in_blr_03',
    name: 'iMovies PVR Directors Cut Forum Rex Walk',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    address: 'Brigade Rd, Shanthala Nagar, Ashok Nagar, Bengaluru 560001',
    screens: 5,
    formats: ['Platinum Suites', 'Dolby Cinema', 'VIP Recliners'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 650,
    amenities: ['Private Sommelier', 'Fine Dining In-Seat', 'Blankets & Pillows'],
    rating: 5.0
  },
  {
    _id: 'cin_in_hyd_01',
    name: 'iMovies Prasads Large Screen & IMAX',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    address: 'NTR Gardens, Necklace Road, Khairatabad, Hyderabad 500004',
    screens: 6,
    formats: ['Giant Screen IMAX Laser', 'Dolby Atmos', 'VIP Recliner'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 350,
    amenities: ['Giant Precision Screen', 'Laser 4K Projection', 'Premium Club Lounges'],
    rating: 4.9
  },
  {
    _id: 'cin_in_hyd_02',
    name: 'iMovies AMB Cinemas Gachibowli',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    address: 'Sarath City Capital Mall, Gachibowli - Miyapur Rd, Hyderabad 500084',
    screens: 7,
    formats: ['VIP M-Lounge', 'Dolby Atmos', 'Laser 4K', '4DX Motion'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 380,
    amenities: ['Celebrity VIP Lounge', 'Plush Pushback Leather', 'Gourmet Bar'],
    rating: 4.9
  },
  {
    _id: 'cin_in_che_01',
    name: 'iMovies PVR SPI Sathyam Royapettah',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    address: '8 Thiruvika Road, Peters Colony, Royapettah, Chennai 600014',
    screens: 6,
    formats: ['Dolby Atmos RDX', 'Elite Club Recliners', '4K Laser'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 250,
    amenities: ['Legendary Butter Popcorn', 'Dolby Atmos 128-Track', 'Classic Heritage Architecture'],
    rating: 5.0
  },
  {
    _id: 'cin_in_che_02',
    name: 'iMovies Palazzo Multiplex Forum Vijaya',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    address: 'Forum Vijaya Mall, 183 Arcot Rd, Vadapalani, Chennai 600026',
    screens: 9,
    formats: ['IMAX Laser', 'Palazzo Royal Suites', 'Dolby Atmos'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 280,
    amenities: ['Italian Renaissance Foyer', 'Plush Motorized Recliners', 'Valet Parking'],
    rating: 4.8
  },
  {
    _id: 'cin_in_ahm_01',
    name: 'iMovies PVR Acropolis Thaltej',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    address: 'Acropolis Mall, Thaltej Crossroads, SG Highway, Ahmedabad 380054',
    screens: 6,
    formats: ['IMAX Laser', '4DX Motion', 'PVR Gold Class'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 320,
    amenities: ['Plush Recliners', 'Live Food Counters', 'Dolby Atmos'],
    rating: 4.8
  },
  {
    _id: 'cin_in_ahm_02',
    name: 'iMovies Cinepolis One Mall Vastrapur',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    address: 'Ahmedabad One Mall, Vastrapur, Ahmedabad 380015',
    screens: 7,
    formats: ['VIP Club Recliners', 'RealD 3D', 'Dolby 7.1'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 300,
    amenities: ['VIP Concierge', 'Chef-Prepared Snacks', 'Spacious Seating'],
    rating: 4.7
  },
  {
    _id: 'cin_in_kol_01',
    name: 'iMovies INOX South City Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'West Bengal',
    city: 'Kolkata',
    address: 'South City Mall, 375 Prince Anwar Shah Rd, Kolkata 700068',
    screens: 6,
    formats: ['IMAX Laser', 'INSIGNIA VIP', 'Dolby Atmos'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 380,
    amenities: ['Insignia Lounge', 'Gourmet In-Seat Dining', 'Laser Projection'],
    rating: 4.9
  },
  {
    _id: 'cin_in_kol_02',
    name: 'iMovies PVR Mani Square Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'West Bengal',
    city: 'Kolkata',
    address: 'Mani Square Mall, 164/1 Maniktala Main Rd, EM Bypass, Kolkata 700054',
    screens: 8,
    formats: ['Gold Class', 'Dolby Atmos', '4K Laser'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 340,
    amenities: ['Leather Recliners', 'Artisanal Cafe', 'Valet Parking'],
    rating: 4.8
  },
  {
    _id: 'cin_in_jai_01',
    name: 'iMovies INOX Crystal Palm',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    address: 'Crystal Palm Mall, Sahkar Marg, Bais Godam, Jaipur 302001',
    screens: 5,
    formats: ['INSIGNIA VIP', 'Dolby Atmos', '4K Laser'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 290,
    amenities: ['Royal Maharaja Seating', 'Live Kitchen Delights', 'Personal Attendant'],
    rating: 4.8
  },
  {
    _id: 'cin_in_jai_02',
    name: 'iMovies Cinepolis World Trade Park',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    address: 'World Trade Park Mall, JLN Marg, Malviya Nagar, Jaipur 302017',
    screens: 8,
    formats: ['VIP Club Recliners', 'RealD 3D', 'Macro XE'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 310,
    amenities: ['Electronic Recliners', 'Gourmet Coffee Bar', 'Atmos Surround'],
    rating: 4.9
  },
  {
    _id: 'cin_in_lko_01',
    name: 'iMovies Cinepolis Lulu Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    address: 'Lulu Mall, Amar Shaheed Path, Golf City, Sector B Ansal API, Lucknow 226030',
    screens: 11,
    formats: ['VIP Megaplex', 'Dolby Atmos', 'IMAX Laser', '4DX Motion'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 320,
    amenities: ['Awadhi Royal Hospitality', 'Ultra-Plush Recliners', '12-Track Surround'],
    rating: 4.9
  },
  {
    _id: 'cin_in_chd_01',
    name: 'iMovies PVR Elante Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Punjab & Chandigarh',
    city: 'Chandigarh',
    address: 'Elante Mall, 178-178A Industrial Area Phase 1, Chandigarh 160002',
    screens: 8,
    formats: ['IMAX Laser', '4DX Motion', 'Gold Class Recliners'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 360,
    amenities: ['Gold Class VIP Lounge', 'Barista Coffee Bar', 'Dolby Atmos Sound'],
    rating: 4.9
  },
  {
    _id: 'cin_in_cok_01',
    name: 'iMovies PVR Superplex Lulu Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Kerala',
    city: 'Kochi',
    address: 'Lulu International Shopping Mall, 34/1000, Old NH 47, Edappally, Kochi 682024',
    screens: 9,
    formats: ['IMAX Laser', '4K Dolby Atmos', 'Gold Class'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 290,
    amenities: ['Luxury Recliners', 'Gourmet Kerala Specials', 'Dolby Atmos Sound'],
    rating: 4.9
  },
  {
    _id: 'cin_in_idr_01',
    name: 'iMovies INOX C21 Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Madhya Pradesh',
    city: 'Indore',
    address: 'C21 Mall, Scheme 54, PU 4 Commercial, AB Road, Indore 452010',
    screens: 6,
    formats: ['INSIGNIA VIP', 'Dolby Atmos', '4K Laser'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 280,
    amenities: ['Insignia Lounge', 'Chef In-Seat Dining', 'Dolby Atmos'],
    rating: 4.8
  },
  {
    _id: 'cin_in_sur_01',
    name: 'iMovies Cinepolis Imperial Square',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Gujarat',
    city: 'Surat',
    address: 'Imperial Square Mall, Pal Hazira Road, Adajan, Surat 395009',
    screens: 8,
    formats: ['VIP Club Recliner', 'RealD 3D', 'Dolby Atmos'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 290,
    amenities: ['Electronic Recliners', 'Artisanal Cafe', 'Dolby Atmos'],
    rating: 4.8
  },
  {
    _id: 'cin_in_noi_01',
    name: 'iMovies PVR Superplex Mall of India',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Noida',
    address: 'DLF Mall of India, Sector 18, Noida, Uttar Pradesh 201301',
    screens: 7,
    formats: ['IMAX Laser', '4DX Motion', 'Gold Class Recliners'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 450,
    amenities: ['Gold Class Lounge', 'Chef-Crafted Menus', 'Dolby Atmos Sound'],
    rating: 4.9
  },
  {
    _id: 'cin_in_gur_01',
    name: 'iMovies PVR Directors Cut Ambience Mall',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'Gurugram',
    address: 'Ambience Mall, NH-8, DLF Phase 3, Gurugram, Haryana 122002',
    screens: 11,
    formats: ['Platinum Suites', 'IMAX Laser', 'Dolby Cinema'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 550,
    amenities: ['Personal Butler Service', 'Luxury Reclining Couches', 'Gourmet Dining Bar'],
    rating: 5.0
  },
  {
    _id: 'cin_in_del_02',
    name: 'iMovies PVR Plaza Connaught Place',
    chain: 'iMovies VIP',
    country: 'IN',
    countryName: 'India',
    state: 'Delhi NCR',
    city: 'New Delhi',
    address: 'H-Block, Connaught Circus, Connaught Place, New Delhi 110001',
    screens: 4,
    formats: ['Heritage Dolby Atmos', 'Gold Class Recliner', '4K Laser'],
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 420,
    amenities: ['Heritage Architecture', 'Luxury Recliners', 'Full Cafe Lounge'],
    rating: 4.8
  },
  {
    _id: 'cin_us_sf_01',
    name: 'iMovies AMC Metreon 16 IMAX',
    chain: 'iMovies VIP',
    country: 'US',
    countryName: 'United States',
    state: 'California',
    city: 'San Francisco',
    address: '135 4th St #3000, San Francisco, CA 94103',
    screens: 16,
    formats: ['IMAX 70mm Laser', 'Dolby Cinema', 'Prime'],
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 24,
    amenities: ['Heated Recliners', 'MacGuffins Bar', 'Dolby Cinema at AMC'],
    rating: 4.9
  },
  {
    _id: 'cin_us_chi_01',
    name: 'iMovies AMC River East 21',
    chain: 'iMovies VIP',
    country: 'US',
    countryName: 'United States',
    state: 'Illinois',
    city: 'Chicago',
    address: '322 E Illinois St, Chicago, IL 60611',
    screens: 21,
    formats: ['Dolby Cinema', 'IMAX Laser', 'VIP Loungers'],
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 21,
    amenities: ['Signature Recliners', 'Full Cocktail Bar', 'Laser Projection'],
    rating: 4.8
  },
  {
    _id: 'cin_us_dal_01',
    name: 'iMovies Cinemark Northpark Center',
    chain: 'iMovies VIP',
    country: 'US',
    countryName: 'United States',
    state: 'Texas',
    city: 'Dallas',
    address: '8687 N Central Expy, Dallas, TX 75225',
    screens: 15,
    formats: ['XD Laser', 'VIP Luxury Loungers', 'D-BOX Motion'],
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 19,
    amenities: ['Luxury Loungers', 'Expanded Food & Beer Menu', 'XD Screen'],
    rating: 4.8
  },
  {
    _id: 'cin_gb_man_01',
    name: 'iMovies Vue Printworks IMAX',
    chain: 'iMovies VIP',
    country: 'GB',
    countryName: 'United Kingdom',
    state: 'Greater Manchester',
    city: 'Manchester',
    address: '27 Withy Grove, Manchester M4 2BS',
    screens: 23,
    formats: ['Giant Screen IMAX Laser', 'VIP Recliners', 'Dolby Atmos'],
    currency: 'GBP',
    currencySymbol: '£',
    basePrice: 17,
    amenities: ['Second Largest Screen in Europe', 'Reclining Luxury Seats', 'Licensed Bar'],
    rating: 4.9
  },
  {
    _id: 'cin_au_mel_01',
    name: 'iMovies IMAX Melbourne Museum',
    chain: 'iMovies VIP',
    country: 'AU',
    countryName: 'Australia',
    state: 'Victoria',
    city: 'Melbourne',
    address: 'Rathdowne St, Carlton VIC 3053',
    screens: 1,
    formats: ['World-Class Laser IMAX 1.43:1', '12-Channel Audio'],
    currency: 'AUD',
    currencySymbol: 'A$',
    basePrice: 30,
    amenities: ['World Largest Screen', 'Laser Dual 4K', 'Pristine Geometry'],
    rating: 5.0
  }
];

const INITIAL_MOVIES = [
  {
    "votes": 245000,
    "_id": "65f1b0000000000000000099",
    "title": "Spider-Man: Brand New Day",
    "aliases": [
      "Spider-Man Brand New Day",
      "Spider-Man 4",
      "Spiderman Brand New Day",
      "Tom Holland Spider-Man",
      "Spider-Man Brand New Day 2026"
    ],
    "industry": "Hollywood",
    "description": "Following the multiversal memory wipe that isolated Peter Parker from his friends and loved ones, Spider-Man embarks on a brand-new street-level chapter in New York City. Operating from a modest apartment in the classic homemade red-and-blue suit, Peter must confront an ascendant underworld led by Mac Gargan and cross paths with Frank Castle and unexpected mutant allies.",
    "genre": [
      "Action",
      "Adventure",
      "Sci-Fi"
    ],
    "duration": 145,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/9/9a/Spider-Man_Brand_New_Day_poster.jpg",
    "backdropUrl": "https://img.youtube.com/vi/62bIsvRcPv0/maxresdefault.jpg",
    "releaseDate": "2026-07-31T00:00:00.000Z",
    "ticketPrice": 380,
    "theater": "iMovies Lincoln Square IMAX",
    "rating": 9.3,
    "language": "English",
    "trailerKey": "62bIsvRcPv0",
    "director": "Destin Daniel Cretton",
    "category": "now_playing",
    "cast": [
      {
        "name": "Tom Holland",
        "character": "Peter Parker / Spider-Man",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Zendaya",
        "character": "Michelle \"MJ\" Jones",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sadie Sink",
        "character": "Jean Grey",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Jon Bernthal",
        "character": "Frank Castle / The Punisher",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Mark Ruffalo",
        "character": "Bruce Banner / Hulk",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Florence Pugh",
        "character": "Yelena Belova / Black Widow",
        "profileUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Michael Mando",
        "character": "Mac Gargan / Scorpion",
        "profileUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Jacob Batalon",
        "character": "Ned Leeds",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Tramell Tillman",
        "character": "William Metzger",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Marisa Tomei",
        "character": "Aunt May (Flashback)",
        "profileUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:15 AM",
      "01:30 PM",
      "04:45 PM",
      "08:00 PM",
      "10:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 142000,
    "_id": "65f1b0000000000000000125",
    "title": "Clayface",
    "aliases": [
      "Clayface 2026",
      "DC Clayface",
      "Basil Karlo Clayface"
    ],
    "industry": "Hollywood",
    "description": "A terrifying psychological body-horror thriller from acclaimed director Mike Flanagan. When B-list actor Basil Karlo is brutally disfigured in a mob hit, an experimental cosmetic compound mutates his cellular structure into a horrifying, shapeshifting clay-like creature, unleashing an unstoppable quest for vengeance across Gotham City.",
    "genre": [
      "Action",
      "Horror",
      "Thriller",
      "Sci-Fi"
    ],
    "duration": 142,
    "posterUrl": "/posters/clayface.jpg",
    "backdropUrl": "https://upload.wikimedia.org/wikipedia/en/4/4f/Clayface_%28film%29_poster.jpg",
    "releaseDate": "2026-10-15T00:00:00.000Z",
    "ticketPrice": 420,
    "theater": "iMovies IMAX Laser 4K",
    "rating": 9.2,
    "language": "English",
    "trailerKey": "ClayfaceOfficialTrailer",
    "director": "Mike Flanagan",
    "category": "now_playing",
    "cast": [
      {
        "name": "Tom Rhys Harries",
        "character": "Matt Hagen / Clayface",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Carla Gugino",
        "character": "Dr. Julie Madison",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Rahul Kohli",
        "character": "Detective Ethan Bennett",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Bruce Greenwood",
        "character": "DA Harvey Dent",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "11:15 AM",
      "02:45 PM",
      "06:15 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "IN",
      "US",
      "GB",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ],
    "availableCountries": [
      "IN",
      "US",
      "GB",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 188000,
    "_id": "65f1b0000000000000000126",
    "title": "Hope",
    "aliases": [
      "Hope 2026",
      "Hopeu",
      "Na Hong-jin Hope"
    ],
    "industry": "Hollywood",
    "description": "Directed by visionary auteur Na Hong-jin (The Wailing), Hope follows the desperate survival battle of residents in an isolated seaside harbor town after an alien lifeform lands on the outskirts of the village, thrusting the community into terrifying encounters with an extraterrestrial presence.",
    "genre": [
      "Sci-Fi",
      "Thriller",
      "Mystery",
      "Adventure"
    ],
    "duration": 152,
    "posterUrl": "/posters/hope.jpg",
    "backdropUrl": "/posters/hope.jpg",
    "releaseDate": "2026-09-28T00:00:00.000Z",
    "ticketPrice": 450,
    "theater": "iMovies IMAX 70mm Laser",
    "rating": 9.4,
    "language": "English",
    "trailerKey": "HopeOfficialTeaser",
    "director": "Na Hong-jin",
    "category": "now_playing",
    "cast": [
      {
        "name": "Jung Ho-yeon",
        "character": "Officer Sung-ae",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Hwang Jung-min",
        "character": "Bum-seok",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Zo In-sung",
        "character": "Sung-ki",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Alicia Vikander",
        "character": "Dr. Evelyn",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Michael Fassbender",
        "character": "Lucas",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "02:15 PM",
      "05:45 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "IN",
      "US",
      "GB",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ],
    "availableCountries": [
      "IN",
      "US",
      "GB",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 280000,
    "_id": "65f1b0000000000000000121",
    "title": "Namit Malhotra's Ramayana",
    "aliases": [
      "Ramayana",
      "Ramayana Part 1",
      "Nitesh Tiwari Ramayana",
      "Ranbir Kapoor Ramayana",
      "Ramayana Namit Malhotra"
    ],
    "industry": "Bollywood",
    "description": "A monumental cinematic retelling of the timeless Indian epic produced by Namit Malhotra with Prime Focus Studios, DNEG, and director Nitesh Tiwari, set to a breathtaking score by Oscar winners Hans Zimmer and A.R. Rahman. Follow Lord Rama’s journey of virtue, honour, sacrifice, and the cosmic triumph of Dharma over evil.",
    "genre": [
      "Action",
      "Adventure",
      "Fantasy",
      "History",
      "Devotional"
    ],
    "duration": 175,
    "posterUrl": "/posters/ramayana.jpg",
    "backdropUrl": "https://img.youtube.com/vi/xzIE3mVmgKs/maxresdefault.jpg",
    "releaseDate": "2026-11-05T00:00:00.000Z",
    "ticketPrice": 450,
    "theater": "iMovies IMAX 70mm Laser",
    "rating": 9.8,
    "language": "Hindi",
    "trailerKey": "xzIE3mVmgKs",
    "director": "Nitesh Tiwari",
    "category": "now_playing",
    "cast": [
      {
        "name": "Ranbir Kapoor",
        "character": "Lord Rama",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sai Pallavi",
        "character": "Goddess Sita",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Yash",
        "character": "Lankesh Ravana",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sunny Deol",
        "character": "Lord Hanuman",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Ravie Dubey",
        "character": "Lakshmana",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Lara Dutta",
        "character": "Kaikeyi",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Arun Govil",
        "character": "King Dasharatha",
        "profileUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:00 AM",
      "01:45 PM",
      "05:30 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 168000,
    "_id": "65f1b0000000000000000120",
    "title": "Drishyam: The Conclusion",
    "aliases": [
      "Drishyam 3",
      "Drishyam The Conclusion",
      "Drishyam Conclusion",
      "Ajay Devgn Drishyam"
    ],
    "industry": "Bollywood",
    "description": "The monumental final chapter to Vijay Salgaonkar and his family’s relentless psychological confrontation with law enforcement. As Jaideep Ahlawat’s elite Crime Branch unit uncovers new forensic evidence alongside Meera Deshmukh and lawyer Prakash Raj, Vijay must execute his ultimate masterstroke to shield his loved ones from retribution.",
    "genre": [
      "Thriller",
      "Crime",
      "Drama",
      "Mystery"
    ],
    "duration": 156,
    "posterUrl": "https://img.youtube.com/vi/cxA2y9Tgl7o/maxresdefault.jpg",
    "backdropUrl": "https://img.youtube.com/vi/cxA2y9Tgl7o/maxresdefault.jpg",
    "releaseDate": "2026-10-02T00:00:00.000Z",
    "ticketPrice": 380,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 9.6,
    "language": "Hindi",
    "trailerKey": "cxA2y9Tgl7o",
    "director": "Abhishek Pathak",
    "category": "now_playing",
    "cast": [
      {
        "name": "Ajay Devgn",
        "character": "Vijay Salgaonkar",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Tabu",
        "character": "Meera Deshmukh",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Shriya Saran",
        "character": "Nandini Salgaonkar",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Jaideep Ahlawat",
        "character": "IG Rathore (Crime Branch)",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Prakash Raj",
        "character": "Advocate Shinde",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Ishita Dutta",
        "character": "Anju Salgaonkar",
        "profileUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "02:30 PM",
      "06:15 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 52000,
    "_id": "65f1b0000000000000000107",
    "title": "Pehla Pyaar Dusri Baar",
    "aliases": [
      "Pehla Pyaar Doosri Baar",
      "Pehla Pyar Dusri Baar",
      "Pehla Pyaar 2nd Time"
    ],
    "industry": "Bollywood",
    "description": "A breezy, youthful romantic comedy directed by Anuj Saini and produced by Luv Ranjan and Ankur Garg. Ten years after high school, three lifelong friends reunite at a school event and embark on a humorous, heartwarming quest across cities to reconnect with their first loves to see if high-school romance deserves a second chance.",
    "genre": [
      "Romance",
      "Comedy",
      "Drama",
      "Musical"
    ],
    "duration": 136,
    "posterUrl": "/posters/pehla-pyaar-dusri-baar.jpg",
    "backdropUrl": "https://img.youtube.com/vi/zzrb40x96Sg/maxresdefault.jpg",
    "releaseDate": "2026-10-23T00:00:00.000Z",
    "ticketPrice": 320,
    "theater": "iMovies Directors Cut Vasant Kunj",
    "rating": 8.7,
    "language": "Hindi",
    "trailerKey": "zzrb40x96Sg",
    "director": "Anuj Saini",
    "category": "now_playing",
    "cast": [
      {
        "name": "Sparsh Walia",
        "character": "Kabir",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Alisha Chopra",
        "character": "Meera",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Kunal Aryan Vaid",
        "character": "Dhruv",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sakshi Vaidya",
        "character": "Rhea",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Tushar Chhibber",
        "character": "Bunty",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sargun Kaur Luthra",
        "character": "Pooja",
        "profileUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:30 AM",
      "01:45 PM",
      "05:00 PM",
      "08:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 210000,
    "_id": "65f1b0000000000000000007",
    "title": "Interstellar",
    "aliases": [
      "Interstellar 70mm",
      "Christopher Nolan Interstellar",
      "Interstellar IMAX"
    ],
    "industry": "Hollywood",
    "description": "When Earth becomes uninhabitable in the future due to global dust storms and blight, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot the Endurance spacecraft alongside a team of researchers through a mysterious wormhole near Saturn to find a new home for human civilization.",
    "genre": [
      "Sci-Fi",
      "Drama",
      "Adventure"
    ],
    "duration": 169,
    "posterUrl": "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    "releaseDate": "2014-11-07T00:00:00.000Z",
    "ticketPrice": 350,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 9,
    "language": "English",
    "trailerKey": "zSWdZVtXT7E",
    "director": "Christopher Nolan",
    "category": "now_playing",
    "cast": [
      {
        "name": "Matthew McConaughey",
        "character": "Joseph Cooper",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Anne Hathaway",
        "character": "Dr. Amelia Brand",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Jessica Chastain",
        "character": "Murphy \"Murph\" Cooper",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Michael Caine",
        "character": "Professor John Brand",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Matt Damon",
        "character": "Dr. Mann",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Mackenzie Foy",
        "character": "Young Murphy Cooper",
        "profileUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "11:30 AM",
      "03:15 PM",
      "06:45 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 245000,
    "_id": "65f1b0000000000000000012",
    "title": "Inception",
    "aliases": [
      "Inception 4K",
      "Christopher Nolan Inception",
      "Inception IMAX"
    ],
    "industry": "Hollywood",
    "description": "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state. He is offered a chance at having his criminal history erased as payment for planting an idea into the mind of a CEO.",
    "genre": [
      "Sci-Fi",
      "Action",
      "Adventure",
      "Mystery"
    ],
    "duration": 148,
    "posterUrl": "https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    "releaseDate": "2010-07-16T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 8.9,
    "language": "English",
    "trailerKey": "YoHD9XEInc0",
    "director": "Christopher Nolan",
    "category": "now_playing",
    "cast": [
      {
        "name": "Leonardo DiCaprio",
        "character": "Dom Cobb",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Joseph Gordon-Levitt",
        "character": "Arthur",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Elliot Page",
        "character": "Ariadne",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Tom Hardy",
        "character": "Eames",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Ken Watanabe",
        "character": "Mr. Saito",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Cillian Murphy",
        "character": "Robert Fischer",
        "profileUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Marion Cotillard",
        "character": "Mal Cobb",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "02:00 PM",
      "05:45 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 48200,
    "_id": "65f1b0000000000000000101",
    "title": "Udta Teer",
    "aliases": [
      "UdtaTeer",
      "Udta Teer 2026",
      "Ayushmann Khurrana Udta Teer"
    ],
    "industry": "Bollywood",
    "description": "A high-energy Bollywood spy-comedy following Vikrant Thapar, a memory-losing counter-terrorism agent who mistakenly gets embroiled in an exhilarating whirlwind of cross-border espionage intrigues, high-stakes missions, and situational comedy alongside fearless agent Yamini.",
    "genre": [
      "Action",
      "Comedy",
      "Spy",
      "Thriller"
    ],
    "duration": 138,
    "posterUrl": "/posters/udta-teer.jpg",
    "backdropUrl": "https://img.youtube.com/vi/hN_ZUElLH44/maxresdefault.jpg",
    "releaseDate": "2026-10-23T00:00:00.000Z",
    "ticketPrice": 350,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.8,
    "language": "Hindi",
    "trailerKey": "hN_ZUElLH44",
    "director": "Aakash Kaushik",
    "category": "now_playing",
    "cast": [
      {
        "name": "Ayushmann Khurrana",
        "character": "Vikrant Thapar",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sara Ali Khan",
        "character": "Yamini",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Jaideep Ahlawat",
        "character": "Rathore",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Bhuvan Bam",
        "character": "Special Appearance",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "02:15 PM",
      "06:15 PM",
      "09:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 184500,
    "_id": "65f1b0000000000000000102",
    "title": "Fast X",
    "aliases": [
      "Fast and Furious 10",
      "Fast & Furious 10",
      "Fast X",
      "Fast and Furious"
    ],
    "industry": "Hollywood",
    "description": "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted, out-nerved and outdriven every foe in their path. Now, they confront the most lethal opponent they’ve ever faced: Dante Reyes, emerging from the shadows of the past to shatter Dom’s family forever.",
    "genre": [
      "Action",
      "Crime",
      "Thriller",
      "Adventure"
    ],
    "duration": 141,
    "posterUrl": "https://image.tmdb.org/t/p/w780/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg",
    "releaseDate": "2023-05-19T00:00:00.000Z",
    "ticketPrice": 380,
    "theater": "iMovies Lincoln Square IMAX",
    "rating": 8.4,
    "language": "English",
    "trailerKey": "32RAq6JzY-w",
    "director": "Louis Leterrier",
    "category": "now_playing",
    "cast": [
      {
        "name": "Vin Diesel",
        "character": "Dominic Toretto",
        "profileUrl": "https://image.tmdb.org/t/p/w185/vin_diesel.jpg"
      },
      {
        "name": "Michelle Rodriguez",
        "character": "Letty Ortiz",
        "profileUrl": "https://image.tmdb.org/t/p/w185/michelle_rodriguez.jpg"
      },
      {
        "name": "Jason Momoa",
        "character": "Dante Reyes",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jason_momoa.jpg"
      },
      {
        "name": "Jason Statham",
        "character": "Deckard Shaw",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jason_statham.jpg"
      },
      {
        "name": "Charlize Theron",
        "character": "Cipher",
        "profileUrl": "https://image.tmdb.org/t/p/w185/charlize_theron.jpg"
      },
      {
        "name": "John Cena",
        "character": "Jakob Toretto",
        "profileUrl": "https://image.tmdb.org/t/p/w185/john_cena.jpg"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "02:15 PM",
      "06:15 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 96400,
    "_id": "65f1b0000000000000000103",
    "title": "Hanuman Ansh",
    "aliases": [
      "Hanumaan Ansh",
      "Hanuman Ansh 2026",
      "Neem Karoli Baba",
      "Baba Neeb Karori"
    ],
    "industry": "Bollywood",
    "description": "A 2026 biographical devotional drama honoring the sacred life, miracles, and compassionate spiritual journey of revered saint Neem Karoli Baba (Baba Neeb Karori). Witness his inspiring path from his early search for divine truth to his timeless global legacy of unconditional love, selfless service, and spiritual guidance.",
    "genre": [
      "Biography",
      "Drama",
      "History",
      "Devotional"
    ],
    "duration": 148,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Hanuman_Ansh_poster_theatrical.jpg",
    "backdropUrl": "https://img.youtube.com/vi/YyqWmKgHupk/sddefault.jpg",
    "releaseDate": "2026-09-18T00:00:00.000Z",
    "ticketPrice": 350,
    "theater": "iMovies Directors Cut Vasant Kunj",
    "rating": 9.3,
    "language": "Hindi",
    "trailerKey": "YyqWmKgHupk",
    "director": "Vishal Chaturvedi",
    "category": "now_playing",
    "cast": [
      {
        "name": "Shobhinaw Satyaa",
        "character": "Baba Neeb Karori / Neem Karoli Baba",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Chandan Anand",
        "character": "Dr. Ram Nandan Bhosale",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Purnima Tiwari",
        "character": "Ram Dulari",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Anil Rastogi",
        "character": "Mahantji",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Vihaan Shedge",
        "character": "Young Maharaj Ji",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Gulshan Pandey",
        "character": "Inspector Dharam Singh",
        "profileUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:15 AM",
      "01:45 PM",
      "05:30 PM",
      "08:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 215000,
    "_id": "65f1b0000000000000000104",
    "title": "Furious 7",
    "aliases": [
      "Fast and Furious 7",
      "Fast & Furious 7",
      "Furious 7",
      "Fast and Furious"
    ],
    "industry": "Hollywood",
    "description": "Deckard Shaw seeks vengeful retribution against Dominic Toretto and his crew for his comatose brother. Dom and the team embark on a relentless globe-trotting mission from Los Angeles to Abu Dhabi to secure God’s Eye, an all-powerful digital tracking device.",
    "genre": [
      "Action",
      "Crime",
      "Thriller"
    ],
    "duration": 137,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/b/b8/Furious_7_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/x26MwBjeD4k6u4wX6w9N4m.jpg",
    "releaseDate": "2015-04-03T00:00:00.000Z",
    "ticketPrice": 350,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 8.8,
    "language": "English",
    "trailerKey": "Skpu5HaVkOc",
    "director": "James Wan",
    "category": "popular",
    "cast": [
      {
        "name": "Vin Diesel",
        "character": "Dominic Toretto",
        "profileUrl": "https://image.tmdb.org/t/p/w185/vin_diesel.jpg"
      },
      {
        "name": "Paul Walker",
        "character": "Brian O’Conner",
        "profileUrl": "https://image.tmdb.org/t/p/w185/paul_walker.jpg"
      },
      {
        "name": "Dwayne Johnson",
        "character": "Luke Hobbs",
        "profileUrl": "https://image.tmdb.org/t/p/w185/dwayne_johnson.jpg"
      },
      {
        "name": "Michelle Rodriguez",
        "character": "Letty Ortiz",
        "profileUrl": "https://image.tmdb.org/t/p/w185/michelle_rodriguez.jpg"
      },
      {
        "name": "Jason Statham",
        "character": "Deckard Shaw",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jason_statham.jpg"
      },
      {
        "name": "Kurt Russell",
        "character": "Mr. Nobody",
        "profileUrl": "https://image.tmdb.org/t/p/w185/kurt_russell.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "02:45 PM",
      "06:30 PM",
      "10:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 194000,
    "_id": "65f1b0000000000000000105",
    "title": "Mission: Impossible – Dead Reckoning Part One",
    "aliases": [
      "Mission Impossible 7",
      "Dead Reckoning",
      "Tom Cruise Mission Impossible",
      "Mission Impossible Dead Reckoning"
    ],
    "industry": "Hollywood",
    "description": "Ethan Hunt and his IMF team embark on their most dangerous assignment yet: to track down a terrifying rogue AI weapon known as the Entity before it falls into the wrong hands and threatens all of humanity.",
    "genre": [
      "Action",
      "Adventure",
      "Thriller"
    ],
    "duration": 163,
    "posterUrl": "https://image.tmdb.org/t/p/w780/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/628Dep6AxEtDxjZoGP78TsOxYbK.jpg",
    "releaseDate": "2023-07-12T00:00:00.000Z",
    "ticketPrice": 360,
    "theater": "iMovies Century City Premiere",
    "rating": 8.7,
    "language": "English",
    "trailerKey": "2m1drlOZSDw",
    "director": "Christopher McQuarrie",
    "category": "popular",
    "cast": [
      {
        "name": "Tom Cruise",
        "character": "Ethan Hunt",
        "profileUrl": "https://image.tmdb.org/t/p/w185/cruise.jpg"
      },
      {
        "name": "Hayley Atwell",
        "character": "Grace",
        "profileUrl": "https://image.tmdb.org/t/p/w185/hayley_atwell.jpg"
      },
      {
        "name": "Ving Rhames",
        "character": "Luther Stickell",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ving_rhames.jpg"
      },
      {
        "name": "Simon Pegg",
        "character": "Benji Dunn",
        "profileUrl": "https://image.tmdb.org/t/p/w185/simon_pegg.jpg"
      },
      {
        "name": "Rebecca Ferguson",
        "character": "Ilsa Faust",
        "profileUrl": "https://image.tmdb.org/t/p/w185/rebecca_ferguson.jpg"
      },
      {
        "name": "Vanessa Kirby",
        "character": "The White Widow",
        "profileUrl": "https://image.tmdb.org/t/p/w185/vanessa_kirby.jpg"
      }
    ],
    "showtimes": [
      "11:30 AM",
      "03:15 PM",
      "07:00 PM",
      "10:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 68400,
    "_id": "65f1b0000000000000000106",
    "title": "Nayi Naveli",
    "aliases": [
      "Nayyi Navelli",
      "Nayi Naveli 2026",
      "Yami Gautam Nayi Naveli"
    ],
    "industry": "Bollywood",
    "description": "A hilarious comedy-horror spectacle starring Yami Gautam as Mohini. When an unsuspecting newlywed bride arrives at an enigmatic ancestral estate, a cascade of quirky supernatural hauntings, eccentric village folklore, and laugh-out-loud spectral encounters turn everything upside down.",
    "genre": [
      "Comedy",
      "Horror",
      "Drama"
    ],
    "duration": 134,
    "posterUrl": "/posters/nayyi-navelli.jpg",
    "backdropUrl": "https://img.youtube.com/vi/NPkMecGOxDc/maxresdefault.jpg",
    "releaseDate": "2026-05-15T00:00:00.000Z",
    "ticketPrice": 320,
    "theater": "iMovies INOX Megaplex Malad",
    "rating": 8.8,
    "language": "Hindi",
    "trailerKey": "NPkMecGOxDc",
    "director": "Balaji Mohan",
    "category": "now_playing",
    "cast": [
      {
        "name": "Yami Gautam",
        "character": "Mohini",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Adinath Kothare",
        "character": "Rohan",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sunita Rajwar",
        "character": "Mausi Ji",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sushmita Mukherjee",
        "character": "Dadi",
        "profileUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Mita Vashisht",
        "character": "Amma",
        "profileUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "02:30 PM",
      "06:00 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 195000,
    "_id": "65f1b0000000000000000108",
    "title": "Avatar: Fire and Ash",
    "industry": "Hollywood",
    "description": "Jake Sully and Neytiri encounter the Ash People, a volcanic clan of Na’vi whose fierce nature challenges everything the Sully family has learned about the moons ecosystem.",
    "genre": [
      "Sci-Fi",
      "Adventure",
      "Action",
      "Fantasy"
    ],
    "duration": 195,
    "posterUrl": "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZIMQvRjrqqw.jpg",
    "releaseDate": "2025-12-19T00:00:00.000Z",
    "ticketPrice": 420,
    "theater": "iMovies IMAX 3D Laser - Screen 1",
    "rating": 9.4,
    "language": "English",
    "trailerKey": "d9MyW72ELq0",
    "director": "James Cameron",
    "category": "upcoming",
    "cast": [
      {
        "name": "Sam Worthington",
        "character": "Jake Sully"
      },
      {
        "name": "Zoe Saldaña",
        "character": "Neytiri"
      },
      {
        "name": "Oona Chaplin",
        "character": "Varang"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "03:15 PM",
      "07:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 385000,
    "_id": "65f1b0000000000000000109",
    "title": "Avengers: Doomsday",
    "industry": "Hollywood",
    "description": "Earth’s Mightiest Heroes, the Fantastic Four, Thunderbolts, and the Multiversal X-Men collide with the supreme sovereign Victor von Doom (Robert Downey Jr.) in an apocalyptic clash to prevent the catastrophic collapse of the Multiverse.",
    "genre": [
      "Action",
      "Sci-Fi",
      "Adventure"
    ],
    "duration": 180,
    "posterUrl": "https://image.tmdb.org/t/p/original/jzPwsojjFStf5lR5Nm07w2hH56G.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/original/6KDDoTq8Vq3HuQHULzuvPiCJbMI.jpg",
    "releaseDate": "2026-12-18T00:00:00.000Z",
    "ticketPrice": 420,
    "theater": "iMovies Lincoln Square IMAX",
    "rating": 9.8,
    "language": "English",
    "trailerKey": "DovIZ6U-6qk",
    "director": "Anthony Russo, Joe Russo",
    "category": "upcoming",
    "cast": [
      {
        "name": "Robert Downey Jr.",
        "character": "Victor von Doom / Doctor Doom"
      },
      {
        "name": "Pedro Pascal",
        "character": "Reed Richards / Mister Fantastic"
      },
      {
        "name": "Vanessa Kirby",
        "character": "Sue Storm / Invisible Woman"
      },
      {
        "name": "Joseph Quinn",
        "character": "Johnny Storm / Human Torch"
      },
      {
        "name": "Ebon Moss-Bachrach",
        "character": "Ben Grimm / The Thing"
      },
      {
        "name": "Benedict Cumberbatch",
        "character": "Dr. Stephen Strange"
      },
      {
        "name": "Anthony Mackie",
        "character": "Sam Wilson / Captain America"
      },
      {
        "name": "Chris Hemsworth",
        "character": "Thor Odinson"
      },
      {
        "name": "Tom Hiddleston",
        "character": "Loki / God of Stories"
      },
      {
        "name": "Florence Pugh",
        "character": "Yelena Belova"
      },
      {
        "name": "Sebastian Stan",
        "character": "Bucky Barnes / Winter Soldier"
      },
      {
        "name": "Hugh Jackman",
        "character": "Logan / Wolverine"
      },
      {
        "name": "Patrick Stewart",
        "character": "Professor Charles Xavier"
      },
      {
        "name": "Ian McKellen",
        "character": "Erik Lehnsherr / Magneto"
      }
    ],
    "showtimes": [
      "10:30 AM",
      "02:45 PM",
      "07:00 PM",
      "10:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 132000,
    "_id": "65f1b0000000000000000110",
    "title": "War 2",
    "industry": "Bollywood",
    "description": "Major Kabir Dhaliwal crosses paths with a lethal new international adversary in an adrenaline-fueled spy clash across Spain, Abu Dhabi, and Mumbai.",
    "genre": [
      "Action",
      "Thriller"
    ],
    "duration": 165,
    "posterUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
    "backdropUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80",
    "releaseDate": "2025-08-14T00:00:00.000Z",
    "ticketPrice": 360,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 9.1,
    "language": "Hindi",
    "trailerKey": "6amIq_mP4xM",
    "director": "Ayan Mukerji",
    "category": "upcoming",
    "cast": [
      {
        "name": "Hrithik Roshan",
        "character": "Major Kabir Dhaliwal"
      },
      {
        "name": "N.T. Rama Rao Jr.",
        "character": "Agent Vikram"
      },
      {
        "name": "Kiara Advani",
        "character": "Ruhi"
      }
    ],
    "showtimes": [
      "11:45 AM",
      "03:15 PM",
      "06:45 PM",
      "10:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 142000,
    "_id": "65f1b0000000000000000111",
    "title": "The Batman: Part II",
    "industry": "Hollywood",
    "description": "The Dark Knight delves deeper into the submerged labyrinth of Gotham’s elite corruption while facing a terrifying new adversary lurking in the frozen city shadows.",
    "genre": [
      "Action",
      "Crime",
      "Drama",
      "Mystery"
    ],
    "duration": 172,
    "posterUrl": "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    "releaseDate": "2026-10-02T00:00:00.000Z",
    "ticketPrice": 360,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 9.3,
    "language": "English",
    "trailerKey": "mqqft2x_Aa4",
    "director": "Matt Reeves",
    "category": "upcoming",
    "cast": [
      {
        "name": "Robert Pattinson",
        "character": "Bruce Wayne / Batman"
      },
      {
        "name": "Colin Farrell",
        "character": "Oswald Cobblepot / The Penguin"
      },
      {
        "name": "Jeffrey Wright",
        "character": "Jim Gordon"
      }
    ],
    "showtimes": [
      "12:00 PM",
      "04:00 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 105700,
    "_id": "65f1b0000000000000000001",
    "title": "Dune: Part Two",
    "industry": "Hollywood",
    "description": "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.",
    "genre": [
      "Sci-Fi",
      "Adventure",
      "Action"
    ],
    "duration": 166,
    "posterUrl": "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg",
    "releaseDate": "2024-03-01T00:00:00.000Z",
    "ticketPrice": 320,
    "theater": "iMovies IMAX Laser - Screen 1",
    "rating": 8.8,
    "language": "English",
    "trailerKey": "Way9Dexny3w",
    "director": "Denis Villeneuve",
    "category": "now_playing",
    "cast": [
      {
        "name": "Timothée Chalamet",
        "character": "Paul Atreides",
        "profileUrl": "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg"
      },
      {
        "name": "Zendaya",
        "character": "Chani",
        "profileUrl": "https://image.tmdb.org/t/p/w185/r3A7evB5Ac2y59mQ1Vj8X8n6b1s.jpg"
      },
      {
        "name": "Rebecca Ferguson",
        "character": "Lady Jessica",
        "profileUrl": "https://image.tmdb.org/t/p/w185/6NR8eT4e6fGv7X2r9s3a2mK2.jpg"
      },
      {
        "name": "Austin Butler",
        "character": "Feyd-Rautha",
        "profileUrl": "https://image.tmdb.org/t/p/w185/2c0O3B1vQv6jC4f8pL1m.jpg"
      }
    ],
    "showtimes": [
      "10:30 AM",
      "02:15 PM",
      "06:30 PM",
      "10:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 106850,
    "_id": "65f1b0000000000000000002",
    "title": "Oppenheimer",
    "industry": "Hollywood",
    "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II at Los Alamos.",
    "genre": [
      "Biography",
      "Drama",
      "History"
    ],
    "duration": 180,
    "posterUrl": "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    "releaseDate": "2023-07-21T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "iMovies Dolby Atmos - Screen 2",
    "rating": 8.9,
    "language": "English",
    "trailerKey": "uYPbbksJxIg",
    "director": "Christopher Nolan",
    "category": "popular",
    "cast": [
      {
        "name": "Cillian Murphy",
        "character": "J. Robert Oppenheimer",
        "profileUrl": "https://image.tmdb.org/t/p/w185/360cLng6IRio437n3eXwhXp00fS.jpg"
      },
      {
        "name": "Emily Blunt",
        "character": "Katherine Oppenheimer",
        "profileUrl": "https://image.tmdb.org/t/p/w185/nPJXaRMtxvgBq15Toq6y7u9.jpg"
      },
      {
        "name": "Matt Damon",
        "character": "Leslie Groves",
        "profileUrl": "https://image.tmdb.org/t/p/w185/elSlNg0VXUD2Kcx14k4v8p9.jpg"
      },
      {
        "name": "Robert Downey Jr.",
        "character": "Lewis Strauss",
        "profileUrl": "https://image.tmdb.org/t/p/w185/1YjdSym1jA7LnUXw32i49V5.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "03:00 PM",
      "07:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 104549,
    "_id": "65f1b0000000000000000003",
    "title": "Spider-Man: Across the Spider-Verse",
    "industry": "Hollywood",
    "description": "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence, and must redefine what it means to be a hero.",
    "genre": [
      "Animation",
      "Action",
      "Sci-Fi"
    ],
    "duration": 140,
    "posterUrl": "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    "releaseDate": "2023-06-02T00:00:00.000Z",
    "ticketPrice": 250,
    "theater": "iMovies 4DX - Screen 3",
    "rating": 8.7,
    "language": "English",
    "trailerKey": "cqGjhVJWtEg",
    "director": "Joaquim Dos Santos, Kemp Powers",
    "category": "popular",
    "cast": [
      {
        "name": "Shameik Moore",
        "character": "Miles Morales (voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/u7cK6t9oJc2a1.jpg"
      },
      {
        "name": "Hailee Steinfeld",
        "character": "Gwen Stacy (voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/4vB8y5.jpg"
      },
      {
        "name": "Oscar Isaac",
        "character": "Miguel O’Hara (voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/8yP3V2.jpg"
      }
    ],
    "showtimes": [
      "10:00 AM",
      "01:30 PM",
      "05:00 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 103400,
    "_id": "65f1b0000000000000000004",
    "title": "Deadpool & Wolverine",
    "industry": "Hollywood",
    "description": "A listless Wade Wilson toils in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, he reluctantly suits up with a brooding Wolverine.",
    "genre": [
      "Action",
      "Comedy",
      "Sci-Fi"
    ],
    "duration": 127,
    "posterUrl": "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/9l1eZiJHmhr5jA625IRGQnTgVTc.jpg",
    "releaseDate": "2024-07-26T00:00:00.000Z",
    "ticketPrice": 340,
    "theater": "iMovies IMAX Laser - Screen 1",
    "rating": 8.6,
    "language": "English",
    "trailerKey": "73_1biulkYk",
    "director": "Shawn Levy",
    "category": "now_playing",
    "cast": [
      {
        "name": "Ryan Reynolds",
        "character": "Wade Wilson / Deadpool",
        "profileUrl": "https://image.tmdb.org/t/p/w185/h1co81Qa92CY0j1X5sM.jpg"
      },
      {
        "name": "Hugh Jackman",
        "character": "Logan / Wolverine",
        "profileUrl": "https://image.tmdb.org/t/p/w185/bX5m6u7O8.jpg"
      },
      {
        "name": "Emma Corrin",
        "character": "Cassandra Nova",
        "profileUrl": "https://image.tmdb.org/t/p/w185/5m6u7O8bX.jpg"
      }
    ],
    "showtimes": [
      "11:15 AM",
      "02:45 PM",
      "06:15 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 102250,
    "_id": "65f1b0000000000000000005",
    "title": "Gladiator II",
    "industry": "Hollywood",
    "description": "Years after witnessing the death of revered hero Maximus, Lucius must enter the Colosseum after his home is conquered by tyrannical Emperors who rule Rome with an iron fist.",
    "genre": [
      "Action",
      "Drama",
      "Adventure"
    ],
    "duration": 148,
    "posterUrl": "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnXvufEmbL6vavr.jpg",
    "releaseDate": "2024-11-22T00:00:00.000Z",
    "ticketPrice": 350,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 8.5,
    "language": "English",
    "trailerKey": "4rgYUipGJNo",
    "director": "Ridley Scott",
    "category": "upcoming",
    "cast": [
      {
        "name": "Paul Mescal",
        "character": "Lucius Verus",
        "profileUrl": "https://image.tmdb.org/t/p/w185/mK7v6a1.jpg"
      },
      {
        "name": "Pedro Pascal",
        "character": "Marcus Acacius",
        "profileUrl": "https://image.tmdb.org/t/p/w185/7y5p2.jpg"
      },
      {
        "name": "Denzel Washington",
        "character": "Macrinus",
        "profileUrl": "https://image.tmdb.org/t/p/w185/9u4v1.jpg"
      }
    ],
    "showtimes": [
      "12:30 PM",
      "04:15 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 101100,
    "_id": "65f1b0000000000000000006",
    "title": "Inside Out 2",
    "industry": "Hollywood",
    "description": "Teenager Riley experiences a sudden demolition of Headquarters to make room for brand-new Emotions! Joy, Sadness, Anger, Fear and Disgust aren’t sure how to feel when Anxiety turns up.",
    "genre": [
      "Animation",
      "Comedy",
      "Adventure"
    ],
    "duration": 96,
    "posterUrl": "https://image.tmdb.org/t/p/w780/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/xg27NrXi7EgQx7AcQfr7498QWWx.jpg",
    "releaseDate": "2024-06-14T00:00:00.000Z",
    "ticketPrice": 260,
    "theater": "iMovies Dolby Atmos - Screen 2",
    "rating": 8.4,
    "language": "English",
    "trailerKey": "LEjhY15eCx0",
    "director": "Kelsey Mann",
    "category": "popular",
    "cast": [
      {
        "name": "Amy Poehler",
        "character": "Joy (voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/3v8K.jpg"
      },
      {
        "name": "Maya Hawke",
        "character": "Anxiety (voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/9v7L.jpg"
      }
    ],
    "showtimes": [
      "10:00 AM",
      "01:00 PM",
      "04:00 PM",
      "07:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 99950,
    "_id": "65f1b0000000000000000008",
    "title": "The Batman",
    "industry": "Hollywood",
    "description": "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city’s hidden corruption and question his family’s involvement.",
    "genre": [
      "Action",
      "Crime",
      "Drama"
    ],
    "duration": 176,
    "posterUrl": "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    "releaseDate": "2022-03-04T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "iMovies IMAX Laser - Screen 1",
    "rating": 8.3,
    "language": "English",
    "trailerKey": "mqqft2x_Aa4",
    "director": "Matt Reeves",
    "category": "popular",
    "cast": [
      {
        "name": "Robert Pattinson",
        "character": "Bruce Wayne / Batman",
        "profileUrl": "https://image.tmdb.org/t/p/w185/8A.jpg"
      },
      {
        "name": "Zoë Kravitz",
        "character": "Selina Kyle",
        "profileUrl": "https://image.tmdb.org/t/p/w185/9B.jpg"
      }
    ],
    "showtimes": [
      "12:00 PM",
      "04:00 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 104549,
    "_id": "65f1b0000000000000000009",
    "title": "Wicked",
    "industry": "Hollywood",
    "description": "The untold story of the witches of Oz, centering on Elphaba, a green-skinned woman who becomes the Wicked Witch of the West, and Glinda, an exceptionally popular blonde woman.",
    "genre": [
      "Musical",
      "Fantasy",
      "Romance"
    ],
    "duration": 160,
    "posterUrl": "https://image.tmdb.org/t/p/w780/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/uKb22E5ww9bX9hv8pf8P8b7t4jB.jpg",
    "releaseDate": "2024-11-27T00:00:00.000Z",
    "ticketPrice": 310,
    "theater": "iMovies Dolby Atmos - Screen 2",
    "rating": 8.7,
    "language": "English",
    "trailerKey": "6COmYeLsz4c",
    "director": "Jon M. Chu",
    "category": "upcoming",
    "cast": [
      {
        "name": "Cynthia Erivo",
        "character": "Elphaba Thropp",
        "profileUrl": "https://image.tmdb.org/t/p/w185/erivo.jpg"
      },
      {
        "name": "Ariana Grande",
        "character": "Glinda Upland",
        "profileUrl": "https://image.tmdb.org/t/p/w185/grande.jpg"
      }
    ],
    "showtimes": [
      "01:30 PM",
      "05:30 PM",
      "09:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 104549,
    "_id": "65f1b0000000000000000011",
    "title": "Avatar: The Way of Water",
    "industry": "Hollywood",
    "description": "Set more than a decade after the events of the first film, Jake Sully and Neytiri have formed a family and are doing everything to stay together on Pandora.",
    "genre": [
      "Sci-Fi",
      "Adventure",
      "Action"
    ],
    "duration": 192,
    "posterUrl": "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZIMQvRjrqqw.jpg",
    "releaseDate": "2022-12-16T00:00:00.000Z",
    "ticketPrice": 380,
    "theater": "iMovies IMAX 3D Laser - Screen 1",
    "rating": 8.7,
    "language": "English",
    "trailerKey": "d9MyW72ELq0",
    "director": "James Cameron",
    "category": "popular",
    "cast": [
      {
        "name": "Sam Worthington",
        "character": "Jake Sully",
        "profileUrl": "https://image.tmdb.org/t/p/w185/worthington.jpg"
      },
      {
        "name": "Zoe Saldaña",
        "character": "Neytiri",
        "profileUrl": "https://image.tmdb.org/t/p/w185/saldana.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "03:15 PM",
      "07:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 97650,
    "_id": "65f1b0000000000000000013",
    "title": "Barbie",
    "industry": "Hollywood",
    "description": "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they discover the joys and perils of living among humans.",
    "genre": [
      "Comedy",
      "Fantasy",
      "Adventure"
    ],
    "duration": 114,
    "posterUrl": "https://image.tmdb.org/t/p/w780/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/nHf61UzkfFno5X1ofIhugCPus2R.jpg",
    "releaseDate": "2023-07-21T00:00:00.000Z",
    "ticketPrice": 260,
    "theater": "iMovies Dolby Atmos - Screen 2",
    "rating": 8.1,
    "language": "English",
    "trailerKey": "pBk4NYhWNMM",
    "director": "Greta Gerwig",
    "category": "popular",
    "cast": [
      {
        "name": "Margot Robbie",
        "character": "Barbie",
        "profileUrl": "https://image.tmdb.org/t/p/w185/robbie.jpg"
      },
      {
        "name": "Ryan Gosling",
        "character": "Ken",
        "profileUrl": "https://image.tmdb.org/t/p/w185/gosling.jpg"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "01:45 PM",
      "05:15 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 98799,
    "_id": "65f1b0000000000000000014",
    "title": "Alien: Romulus",
    "industry": "Hollywood",
    "description": "While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
    "genre": [
      "Horror",
      "Sci-Fi",
      "Thriller"
    ],
    "duration": 119,
    "posterUrl": "/posters/alien-romulus.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg",
    "releaseDate": "2024-08-16T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "iMovies 4DX - Screen 3",
    "rating": 8.2,
    "language": "English",
    "trailerKey": "x0XDEhP4MQs",
    "director": "Fede Álvarez",
    "category": "now_playing",
    "cast": [
      {
        "name": "Cailee Spaeny",
        "character": "Rain Carradine",
        "profileUrl": "https://image.tmdb.org/t/p/w185/spaeny.jpg"
      },
      {
        "name": "David Jonsson",
        "character": "Andy",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jonsson.jpg"
      }
    ],
    "showtimes": [
      "01:00 PM",
      "04:45 PM",
      "08:15 PM",
      "10:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 103400,
    "_id": "65f1b0000000000000000021",
    "title": "Jawan",
    "industry": "Bollywood",
    "description": "A high-octane action thriller outlining the emotional journey of a prison warden who sets out to rectify the wrongs in the society, with help from his team of women soldiers.",
    "genre": [
      "Action",
      "Thriller",
      "Drama"
    ],
    "duration": 169,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/7eR0MsqpE5X4L7uX7yX8qQ.jpg",
    "releaseDate": "2023-09-07T00:00:00.000Z",
    "ticketPrice": 350,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.6,
    "language": "Hindi",
    "trailerKey": "COv52Qyctws",
    "director": "Atlee",
    "category": "popular",
    "cast": [
      {
        "name": "Shah Rukh Khan",
        "character": "Vikram Rathore / Azad",
        "profileUrl": "https://image.tmdb.org/t/p/w185/srk.jpg"
      },
      {
        "name": "Nayanthara",
        "character": "Narmada Rai",
        "profileUrl": "https://image.tmdb.org/t/p/w185/nayan.jpg"
      },
      {
        "name": "Vijay Sethupathi",
        "character": "Kalee Gaikwad",
        "profileUrl": "https://image.tmdb.org/t/p/w185/vjs.jpg"
      },
      {
        "name": "Deepika Padukone",
        "character": "Aishwarya Rathore",
        "profileUrl": "https://image.tmdb.org/t/p/w185/deepika.jpg"
      }
    ],
    "showtimes": [
      "11:30 AM",
      "03:15 PM",
      "07:00 PM",
      "10:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 104549,
    "_id": "65f1b0000000000000000023",
    "title": "Kalki 2898 AD",
    "industry": "Bollywood",
    "description": "Set in a post-apocalyptic world in the year 2898 AD, the story follows a lab-engineered child carrying the reincarnation of Lord Vishnu’s tenth avatar, Kalki.",
    "genre": [
      "Sci-Fi",
      "Action",
      "Fantasy"
    ],
    "duration": 181,
    "posterUrl": "/posters/kalki-2898-ad.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/kalkibackdrop.jpg",
    "releaseDate": "2024-06-27T00:00:00.000Z",
    "ticketPrice": 380,
    "theater": "iMovies Directors Cut Vasant Kunj",
    "rating": 8.7,
    "language": "Hindi",
    "trailerKey": "kQDd1AhGIHk",
    "director": "Nag Ashwin",
    "category": "now_playing",
    "cast": [
      {
        "name": "Prabhas",
        "character": "Bhairava",
        "profileUrl": "https://image.tmdb.org/t/p/w185/prabhas.jpg"
      },
      {
        "name": "Amitabh Bachchan",
        "character": "Ashwatthama",
        "profileUrl": "https://image.tmdb.org/t/p/w185/amitabh.jpg"
      },
      {
        "name": "Deepika Padukone",
        "character": "SUM-80 / Sumathi",
        "profileUrl": "https://image.tmdb.org/t/p/w185/deepika.jpg"
      },
      {
        "name": "Kamal Haasan",
        "character": "Supreme Yaskin",
        "profileUrl": "https://image.tmdb.org/t/p/w185/kamal.jpg"
      }
    ],
    "showtimes": [
      "10:00 AM",
      "02:00 PM",
      "06:00 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 99950,
    "_id": "65f1b0000000000000000024",
    "title": "Animal",
    "industry": "Bollywood",
    "description": "A hardened son returns from exile to take bloody vengeance after an assassination attempt on his father, embarking on a path of unrelenting darkness.",
    "genre": [
      "Action",
      "Crime",
      "Drama"
    ],
    "duration": 201,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/animalbackdrop.jpg",
    "releaseDate": "2023-12-01T00:00:00.000Z",
    "ticketPrice": 340,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.3,
    "language": "Hindi",
    "trailerKey": "Dydmpfo68DA",
    "director": "Sandeep Reddy Vanga",
    "category": "popular",
    "cast": [
      {
        "name": "Ranbir Kapoor",
        "character": "Ranvijay Singh",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ranbir.jpg"
      },
      {
        "name": "Rashmika Mandanna",
        "character": "Geetanjali",
        "profileUrl": "https://image.tmdb.org/t/p/w185/rashmika.jpg"
      },
      {
        "name": "Anil Kapoor",
        "character": "Balbir Singh",
        "profileUrl": "https://image.tmdb.org/t/p/w185/anil.jpg"
      },
      {
        "name": "Bobby Deol",
        "character": "Abrar Haque",
        "profileUrl": "https://image.tmdb.org/t/p/w185/bobby.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "03:30 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 101100,
    "_id": "65f1b0000000000000000027",
    "title": "Fighter",
    "industry": "Bollywood",
    "description": "Top IAF aviators come together to form an elite squadron tasked with counter-terror air strikes and defending the nation’s airspace under intense pressure.",
    "genre": [
      "Action",
      "Thriller",
      "Drama"
    ],
    "duration": 166,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/fighterbackdrop.jpg",
    "releaseDate": "2024-01-25T00:00:00.000Z",
    "ticketPrice": 320,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.4,
    "language": "Hindi",
    "trailerKey": "6amIq_mP4xM",
    "director": "Siddharth Anand",
    "category": "popular",
    "cast": [
      {
        "name": "Hrithik Roshan",
        "character": "Shamsher Pathania (Patty)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/hrithik.jpg"
      },
      {
        "name": "Deepika Padukone",
        "character": "Minal Rathore (Minni)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/deepika.jpg"
      },
      {
        "name": "Anil Kapoor",
        "character": "Rakesh Jaisingh (Rocky)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/anil.jpg"
      }
    ],
    "showtimes": [
      "11:45 AM",
      "03:15 PM",
      "06:45 PM",
      "10:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 106850,
    "_id": "65f1b0000000000000000028",
    "title": "RRR",
    "industry": "Bollywood",
    "description": "A fearless warrior on a perilous mission confronts a steely cop serving the British forces in 1920s pre-independent India, leading to an extraordinary friendship and revolution.",
    "genre": [
      "Action",
      "Drama",
      "History"
    ],
    "duration": 187,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/rrrbackdrop.jpg",
    "releaseDate": "2022-03-25T00:00:00.000Z",
    "ticketPrice": 360,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 8.9,
    "language": "Hindi",
    "trailerKey": "NgBoMJy386M",
    "director": "S.S. Rajamouli",
    "category": "popular",
    "cast": [
      {
        "name": "N.T. Rama Rao Jr.",
        "character": "Komaram Bheem",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ntr.jpg"
      },
      {
        "name": "Ram Charan",
        "character": "Alluri Sitarama Raju",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ramcharan.jpg"
      },
      {
        "name": "Alia Bhatt",
        "character": "Sita",
        "profileUrl": "https://image.tmdb.org/t/p/w185/alia.jpg"
      }
    ],
    "showtimes": [
      "12:00 PM",
      "04:15 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 92000,
    "_id": "65f1b0000000000000000029",
    "title": "Bhool Bhulaiyaa 3",
    "industry": "Bollywood",
    "description": "Rooh Baba travels to the royal kingdom of Raktaghat in Bengal, where he encounters two menacing spirits claiming to be the real Manjulika.",
    "genre": [
      "Comedy",
      "Horror",
      "Mystery"
    ],
    "duration": 158,
    "posterUrl": "/posters/bhool-bhulaiyaa-3.jpg",
    "backdropUrl": "https://img.youtube.com/vi/kN-ScVqz0wU/maxresdefault.jpg",
    "releaseDate": "2024-11-01T00:00:00.000Z",
    "ticketPrice": 330,
    "theater": "iMovies INOX Megaplex Malad",
    "rating": 8.3,
    "language": "Hindi",
    "trailerKey": "kN-ScVqz0wU",
    "director": "Anees Bazmee",
    "category": "now_playing",
    "cast": [
      {
        "name": "Kartik Aaryan",
        "character": "Rooh Baba / Ruhaan",
        "profileUrl": "https://image.tmdb.org/t/p/w185/kartik.jpg"
      },
      {
        "name": "Vidya Balan",
        "character": "Manjulika",
        "profileUrl": "https://image.tmdb.org/t/p/w185/vidya.jpg"
      },
      {
        "name": "Madhuri Dixit",
        "character": "Anjulika",
        "profileUrl": "https://image.tmdb.org/t/p/w185/madhuri.jpg"
      },
      {
        "name": "Triptii Dimri",
        "character": "Meera",
        "profileUrl": "https://image.tmdb.org/t/p/w185/triptii.jpg"
      }
    ],
    "showtimes": [
      "01:00 PM",
      "05:00 PM",
      "08:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 108000,
    "_id": "65f1b0000000000000000015",
    "title": "The Dark Knight",
    "industry": "Hollywood",
    "description": "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent, but finds himself tested by a criminal mastermind known as the Joker.",
    "genre": [
      "Action",
      "Crime",
      "Drama"
    ],
    "duration": 152,
    "posterUrl": "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1rDYRtpwnA0iW.jpg",
    "releaseDate": "2008-07-18T00:00:00.000Z",
    "ticketPrice": 310,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 9,
    "language": "English",
    "trailerKey": "EXeTwQWrcwY",
    "director": "Christopher Nolan",
    "category": "popular",
    "cast": [
      {
        "name": "Christian Bale",
        "character": "Bruce Wayne / Batman",
        "profileUrl": "https://image.tmdb.org/t/p/w185/bale.jpg"
      },
      {
        "name": "Heath Ledger",
        "character": "Joker",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ledger.jpg"
      },
      {
        "name": "Aaron Eckhart",
        "character": "Harvey Dent",
        "profileUrl": "https://image.tmdb.org/t/p/w185/eckhart.jpg"
      }
    ],
    "showtimes": [
      "11:30 AM",
      "03:15 PM",
      "07:15 PM",
      "10:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 111450,
    "_id": "65f1b0000000000000000016",
    "title": "The Shawshank Redemption",
    "industry": "Hollywood",
    "description": "A banker convicted of uxoricide forms a friendship over a quarter of a century with a hardened convict, while maintaining his innocence and striving for his freedom.",
    "genre": [
      "Drama",
      "Crime"
    ],
    "duration": 142,
    "posterUrl": "https://image.tmdb.org/t/p/w780/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/kXfqFc22bybGxyIHQI1hchbxN9T.jpg",
    "releaseDate": "1994-09-23T00:00:00.000Z",
    "ticketPrice": 270,
    "theater": "iMovies Dolby Atmos - Screen 2",
    "rating": 9.3,
    "language": "English",
    "trailerKey": "PLl99DlL6b4",
    "director": "Frank Darabont",
    "category": "popular",
    "cast": [
      {
        "name": "Tim Robbins",
        "character": "Andy Dufresne",
        "profileUrl": "https://image.tmdb.org/t/p/w185/robbins.jpg"
      },
      {
        "name": "Morgan Freeman",
        "character": "Ellis Boyd \"Red\" Redding",
        "profileUrl": "https://image.tmdb.org/t/p/w185/freeman.jpg"
      }
    ],
    "showtimes": [
      "12:00 PM",
      "04:00 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 106850,
    "_id": "65f1b0000000000000000017",
    "title": "Pulp Fiction",
    "industry": "Hollywood",
    "description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    "genre": [
      "Crime",
      "Drama"
    ],
    "duration": 154,
    "posterUrl": "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    "releaseDate": "1994-10-14T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "iMovies 4DX - Screen 3",
    "rating": 8.9,
    "language": "English",
    "trailerKey": "s7EdQ4FqbhY",
    "director": "Quentin Tarantino",
    "category": "popular",
    "cast": [
      {
        "name": "John Travolta",
        "character": "Vincent Vega",
        "profileUrl": "https://image.tmdb.org/t/p/w185/travolta.jpg"
      },
      {
        "name": "Samuel L. Jackson",
        "character": "Jules Winnfield",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jackson.jpg"
      },
      {
        "name": "Uma Thurman",
        "character": "Mia Wallace",
        "profileUrl": "https://image.tmdb.org/t/p/w185/thurman.jpg"
      }
    ],
    "showtimes": [
      "01:30 PM",
      "05:30 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 103400,
    "_id": "65f1b0000000000000000018",
    "title": "La La Land",
    "industry": "Hollywood",
    "description": "While navigating their careers in Los Angeles, a pianist and an aspiring actress fall in love while attempting to reconcile their aspirations for the future.",
    "genre": [
      "Musical",
      "Romance",
      "Comedy"
    ],
    "duration": 128,
    "posterUrl": "https://image.tmdb.org/t/p/w780/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/qJeU7KM4nTov05k7fauUqLg8cba.jpg",
    "releaseDate": "2016-12-09T00:00:00.000Z",
    "ticketPrice": 260,
    "theater": "iMovies Dolby Atmos - Screen 2",
    "rating": 8.6,
    "language": "English",
    "trailerKey": "0pdqf4P9MB8",
    "director": "Damien Chazelle",
    "category": "popular",
    "cast": [
      {
        "name": "Ryan Gosling",
        "character": "Sebastian Wilder",
        "profileUrl": "https://image.tmdb.org/t/p/w185/gosling.jpg"
      },
      {
        "name": "Emma Stone",
        "character": "Mia Dolan",
        "profileUrl": "https://image.tmdb.org/t/p/w185/stone.jpg"
      }
    ],
    "showtimes": [
      "11:15 AM",
      "03:00 PM",
      "06:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 104549,
    "_id": "65f1b0000000000000000019",
    "title": "Avengers: Endgame",
    "industry": "Hollywood",
    "description": "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos’ actions.",
    "genre": [
      "Action",
      "Sci-Fi",
      "Adventure"
    ],
    "duration": 181,
    "posterUrl": "https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    "releaseDate": "2019-04-26T00:00:00.000Z",
    "ticketPrice": 340,
    "theater": "iMovies IMAX Laser - Screen 1",
    "rating": 8.7,
    "language": "English",
    "trailerKey": "TcMBFSGVi1c",
    "director": "Anthony Russo, Joe Russo",
    "category": "popular",
    "cast": [
      {
        "name": "Robert Downey Jr.",
        "character": "Tony Stark / Iron Man",
        "profileUrl": "https://image.tmdb.org/t/p/w185/rdj.jpg"
      },
      {
        "name": "Chris Evans",
        "character": "Steve Rogers / Captain America",
        "profileUrl": "https://image.tmdb.org/t/p/w185/evans.jpg"
      },
      {
        "name": "Scarlett Johansson",
        "character": "Natasha Romanoff",
        "profileUrl": "https://image.tmdb.org/t/p/w185/scarlett.jpg"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "02:45 PM",
      "06:45 PM",
      "10:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 105700,
    "_id": "65f1b0000000000000000020",
    "title": "Titanic",
    "industry": "Hollywood",
    "description": "An aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic in 1912.",
    "genre": [
      "Romance",
      "Drama"
    ],
    "duration": 194,
    "posterUrl": "https://image.tmdb.org/t/p/w780/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/yDIv0yvLzGk8W8LphrB6Q6H1dZ5.jpg",
    "releaseDate": "1997-12-19T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "iMovies 70mm IMAX - Screen 1",
    "rating": 8.8,
    "language": "English",
    "trailerKey": "CHekzSiZjrY",
    "director": "James Cameron",
    "category": "popular",
    "cast": [
      {
        "name": "Leonardo DiCaprio",
        "character": "Jack Dawson",
        "profileUrl": "https://image.tmdb.org/t/p/w185/dicaprio.jpg"
      },
      {
        "name": "Kate Winslet",
        "character": "Rose DeWitt Bukater",
        "profileUrl": "https://image.tmdb.org/t/p/w185/winslet.jpg"
      }
    ],
    "showtimes": [
      "12:30 PM",
      "04:45 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 105700,
    "_id": "65f1b000000000000000001B",
    "title": "Coco",
    "industry": "Hollywood",
    "description": "Aspiring musician Miguel, confronted with his family’s ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    "genre": [
      "Animation",
      "Adventure",
      "Fantasy"
    ],
    "duration": 105,
    "posterUrl": "https://image.tmdb.org/t/p/w780/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/askg3SMvhqEl4OL52YuvdtY40Yb.jpg",
    "releaseDate": "2017-11-22T00:00:00.000Z",
    "ticketPrice": 250,
    "theater": "iMovies Dolby Atmos - Screen 2",
    "rating": 8.8,
    "language": "English",
    "trailerKey": "Rvr68u6k5sI",
    "director": "Lee Unkrich",
    "category": "popular",
    "cast": [
      {
        "name": "Anthony Gonzalez",
        "character": "Miguel (voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/gonzalez.jpg"
      },
      {
        "name": "Gael García Bernal",
        "character": "Héctor (voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/bernal.jpg"
      }
    ],
    "showtimes": [
      "10:00 AM",
      "01:15 PM",
      "04:30 PM",
      "07:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 98799,
    "_id": "65f1b000000000000000001C",
    "title": "The Conjuring",
    "industry": "Hollywood",
    "description": "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their Rhode Island farmhouse.",
    "genre": [
      "Horror",
      "Mystery",
      "Thriller"
    ],
    "duration": 112,
    "posterUrl": "https://image.tmdb.org/t/p/w780/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/m5zk1dE428wB2RkJ7r5q.jpg",
    "releaseDate": "2013-07-19T00:00:00.000Z",
    "ticketPrice": 260,
    "theater": "iMovies 4DX - Screen 3",
    "rating": 8.2,
    "language": "English",
    "trailerKey": "k10ETZ41q5o",
    "director": "James Wan",
    "category": "popular",
    "cast": [
      {
        "name": "Vera Farmiga",
        "character": "Lorraine Warren",
        "profileUrl": "https://image.tmdb.org/t/p/w185/farmiga.jpg"
      },
      {
        "name": "Patrick Wilson",
        "character": "Ed Warren",
        "profileUrl": "https://image.tmdb.org/t/p/w185/wilson.jpg"
      }
    ],
    "showtimes": [
      "02:00 PM",
      "06:00 PM",
      "09:30 PM",
      "11:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 106850,
    "_id": "65f1b0000000000000000033",
    "title": "Dilwale Dulhania Le Jayenge",
    "industry": "Bollywood",
    "description": "Raj and Simran meet on a train trip through Europe and fall deeply in love. Raj must win over Simran’s conservative father in Punjab before her arranged marriage takes place.",
    "genre": [
      "Romance",
      "Drama"
    ],
    "duration": 189,
    "posterUrl": "https://image.tmdb.org/t/p/w780/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/9079vd2p1b2d3.jpg",
    "releaseDate": "1995-10-20T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "iMovies Maratha Mandir Heritage Screen",
    "rating": 8.9,
    "language": "Hindi",
    "trailerKey": "c25GKl5VNeY",
    "director": "Aditya Chopra",
    "category": "popular",
    "cast": [
      {
        "name": "Shah Rukh Khan",
        "character": "Raj Malhotra",
        "profileUrl": "https://image.tmdb.org/t/p/w185/srk.jpg"
      },
      {
        "name": "Kajol",
        "character": "Simran Singh",
        "profileUrl": "https://image.tmdb.org/t/p/w185/kajol.jpg"
      },
      {
        "name": "Amrish Puri",
        "character": "Chaudhry Baldev Singh",
        "profileUrl": "https://image.tmdb.org/t/p/w185/amrish.jpg"
      }
    ],
    "showtimes": [
      "11:30 AM",
      "03:45 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 108000,
    "_id": "65f1b0000000000000000034",
    "title": "3 Idiots",
    "industry": "Bollywood",
    "description": "Two friends embark on a quest for a lost college friend who challenged the rigid Indian education system and inspired them to pursue their real passions.",
    "genre": [
      "Comedy",
      "Drama"
    ],
    "duration": 170,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/uLtV6LHGZ15oHovb.jpg",
    "releaseDate": "2009-12-25T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "iMovies Directors Cut Vasant Kunj",
    "rating": 9,
    "language": "Hindi",
    "trailerKey": "K0eDlFX9GMc",
    "director": "Rajkumar Hirani",
    "category": "popular",
    "cast": [
      {
        "name": "Aamir Khan",
        "character": "Ranchoddas \"Rancho\" Chhanchad",
        "profileUrl": "https://image.tmdb.org/t/p/w185/aamir.jpg"
      },
      {
        "name": "R. Madhavan",
        "character": "Farhan Qureshi",
        "profileUrl": "https://image.tmdb.org/t/p/w185/madhavan.jpg"
      },
      {
        "name": "Sharman Joshi",
        "character": "Raju Rastogi",
        "profileUrl": "https://image.tmdb.org/t/p/w185/sharman.jpg"
      },
      {
        "name": "Kareena Kapoor",
        "character": "Pia Sahastrabuddhe",
        "profileUrl": "https://image.tmdb.org/t/p/w185/kareena.jpg"
      }
    ],
    "showtimes": [
      "10:30 AM",
      "02:15 PM",
      "06:00 PM",
      "09:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 105700,
    "_id": "65f1b0000000000000000035",
    "title": "Dangal",
    "industry": "Bollywood",
    "description": "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
    "genre": [
      "Biography",
      "Drama"
    ],
    "duration": 161,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/dangalbackdrop.jpg",
    "releaseDate": "2016-12-23T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.8,
    "language": "Hindi",
    "trailerKey": "x_7YlGv9u1g",
    "director": "Nitesh Tiwari",
    "category": "popular",
    "cast": [
      {
        "name": "Aamir Khan",
        "character": "Mahavir Singh Phogat",
        "profileUrl": "https://image.tmdb.org/t/p/w185/aamir.jpg"
      },
      {
        "name": "Fatima Sana Shaikh",
        "character": "Geeta Phogat",
        "profileUrl": "https://image.tmdb.org/t/p/w185/fatima.jpg"
      },
      {
        "name": "Sanya Malhotra",
        "character": "Babita Kumari",
        "profileUrl": "https://image.tmdb.org/t/p/w185/sanya.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "03:00 PM",
      "07:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 105700,
    "_id": "65f1b0000000000000000037",
    "title": "Andhadhun",
    "industry": "Bollywood",
    "description": "A series of mysterious events changes the life of a blind pianist who must now report a crime that he should not technically know anything about.",
    "genre": [
      "Crime",
      "Thriller",
      "Mystery"
    ],
    "duration": 139,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/4/47/Andhadhun_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/andhadhunbackdrop.jpg",
    "releaseDate": "2018-10-05T00:00:00.000Z",
    "ticketPrice": 270,
    "theater": "iMovies Directors Cut Vasant Kunj",
    "rating": 8.8,
    "language": "Hindi",
    "trailerKey": "2iVYI99VGaw",
    "director": "Sriram Raghavan",
    "category": "popular",
    "cast": [
      {
        "name": "Ayushmann Khurrana",
        "character": "Akash Saraf",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ayushmann.jpg"
      },
      {
        "name": "Tabu",
        "character": "Simi Sinha",
        "profileUrl": "https://image.tmdb.org/t/p/w185/tabu.jpg"
      },
      {
        "name": "Radhika Apte",
        "character": "Sophie",
        "profileUrl": "https://image.tmdb.org/t/p/w185/radhika.jpg"
      }
    ],
    "showtimes": [
      "01:00 PM",
      "05:15 PM",
      "09:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 103400,
    "_id": "65f1b0000000000000000202",
    "title": "Drishyam 2",
    "industry": "Bollywood",
    "description": "7 years after the case related to Vijay Salgaonkar and his family was closed, a series of unexpected events brings a dark truth to light under a relentless new IG.",
    "genre": [
      "Crime",
      "Thriller",
      "Drama"
    ],
    "duration": 140,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/3/3f/Drishyam_2.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/drishyam2backdrop.jpg",
    "releaseDate": "2022-11-18T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.6,
    "language": "Hindi",
    "trailerKey": "cxA2y9Tgl7o",
    "director": "Abhishek Pathak",
    "category": "popular",
    "cast": [
      {
        "name": "Ajay Devgn",
        "character": "Vijay Salgaonkar",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ajay.jpg"
      },
      {
        "name": "Tabu",
        "character": "Meera Deshmukh",
        "profileUrl": "https://image.tmdb.org/t/p/w185/tabu.jpg"
      },
      {
        "name": "Akshaye Khanna",
        "character": "Tarun Ahlawat",
        "profileUrl": "https://image.tmdb.org/t/p/w185/akshaye.jpg"
      },
      {
        "name": "Shriya Saran",
        "character": "Nandini Salgaonkar",
        "profileUrl": "https://image.tmdb.org/t/p/w185/shriya.jpg"
      }
    ],
    "showtimes": [
      "01:30 PM",
      "05:00 PM",
      "08:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 103400,
    "_id": "65f1b000000000000000002f",
    "title": "Spirited Away",
    "industry": "Hollywood",
    "description": "During her family’s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits where humans are changed into beasts.",
    "genre": [
      "Animation",
      "Fantasy",
      "Adventure",
      "Family",
      "Mystery"
    ],
    "duration": 125,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mSDmvloA24Q0c2Yc7a8r0t2y.jpg",
    "releaseDate": "2001-07-20T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "Regal IMAX Laser & ScreenX",
    "rating": 8.6,
    "language": "Japanese",
    "trailerKey": "ByXuk9QqQkk",
    "director": "Hayao Miyazaki",
    "category": "popular",
    "cast": [
      {
        "name": "Rumi Hiiragi",
        "character": "Chihiro Ogino (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/rumi.jpg"
      },
      {
        "name": "Miyu Irino",
        "character": "Haku (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/miyu.jpg"
      }
    ],
    "showtimes": [
      "12:30 PM",
      "04:15 PM",
      "07:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 95350,
    "_id": "65f1b0000000000000000036",
    "title": "The Notebook",
    "industry": "Hollywood",
    "description": "An elderly man reads a passionate love story from his worn notebook to a nursing home resident about two young lovers separated by social class and World War II.",
    "genre": [
      "Romance",
      "Drama"
    ],
    "duration": 123,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/8/86/Posternotebook.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mSDmvloA24Q0c2Yc7a8r0t2y.jpg",
    "releaseDate": "2004-06-25T00:00:00.000Z",
    "ticketPrice": 270,
    "theater": "AMC Empire 25 Screen 6",
    "rating": 7.9,
    "language": "English",
    "trailerKey": "4M7LIcH8C9U",
    "director": "Nick Cassavetes",
    "category": "popular",
    "cast": [
      {
        "name": "Ryan Gosling",
        "character": "Noah Calhoun",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ryangosling.jpg"
      },
      {
        "name": "Rachel McAdams",
        "character": "Allie Hamilton",
        "profileUrl": "https://image.tmdb.org/t/p/w185/rachelmcadams.jpg"
      }
    ],
    "showtimes": [
      "02:00 PM",
      "06:00 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 95350,
    "_id": "65f1b0000000000000000038",
    "title": "Past Lives",
    "industry": "Hollywood",
    "description": "Nora and Hae Sung, two deeply connected childhood friends in Seoul, are wrested apart when her family emigrates. Decades later, they reunite in New York for one fateful week.",
    "genre": [
      "Romance",
      "Drama"
    ],
    "duration": 105,
    "posterUrl": "https://image.tmdb.org/t/p/w780/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/kH4vFw3gCgU2j8K63tUvhbMlhR6.jpg",
    "releaseDate": "2023-06-02T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "Filmhouse Cinema Screen 1",
    "rating": 7.9,
    "language": "English",
    "trailerKey": "kA244xewjcI",
    "director": "Celine Song",
    "category": "popular",
    "cast": [
      {
        "name": "Greta Lee",
        "character": "Nora Moon",
        "profileUrl": "https://image.tmdb.org/t/p/w185/gretalee.jpg"
      },
      {
        "name": "Teo Yoo",
        "character": "Hae Sung",
        "profileUrl": "https://image.tmdb.org/t/p/w185/teoyoo.jpg"
      },
      {
        "name": "John Magaro",
        "character": "Arthur",
        "profileUrl": "https://image.tmdb.org/t/p/w185/johnmagaro.jpg"
      }
    ],
    "showtimes": [
      "01:45 PM",
      "05:30 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 96500,
    "_id": "65f1b0000000000000000039",
    "title": "M.S. Dhoni: The Untold Story",
    "industry": "Bollywood",
    "description": "The inspirational journey of Mahendra Singh Dhoni, from a small-town railway ticket collector in Ranchi to the world champion captain of the Indian cricket team.",
    "genre": [
      "Biography",
      "Sports",
      "Drama"
    ],
    "duration": 190,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/3/33/M.S._Dhoni_-_The_Untold_Story_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/8pjWFs9bZtgoh5qK4dYcK7bMlhR.jpg",
    "releaseDate": "2016-09-30T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "PVR IMAX Phoenix Marketcity",
    "rating": 8,
    "language": "Hindi",
    "trailerKey": "6L6XqWoS8tw",
    "director": "Neeraj Pandey",
    "category": "popular",
    "cast": [
      {
        "name": "Sushant Singh Rajput",
        "character": "Mahendra Singh Dhoni",
        "profileUrl": "https://image.tmdb.org/t/p/w185/sushant.jpg"
      },
      {
        "name": "Kiara Advani",
        "character": "Sakshi Dhoni",
        "profileUrl": "https://image.tmdb.org/t/p/w185/kiara.jpg"
      },
      {
        "name": "Disha Patani",
        "character": "Priyanka Jha",
        "profileUrl": "https://image.tmdb.org/t/p/w185/disha.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "03:15 PM",
      "07:00 PM",
      "10:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 185000,
    "_id": "65f1b0000000000000000091",
    "title": "Pushpa 2: The Rule",
    "aliases": [
      "Pushpa 2",
      "Pushpa The Rule",
      "Allu Arjun Pushpa 2"
    ],
    "industry": "Bollywood",
    "description": "Pushpa Raj consolidates his syndicate rule across the red sandalwood empire while locked in an escalating, explosive psychological and physical war against fearless SP Bhanwar Singh Shekhawat.",
    "genre": [
      "Action",
      "Crime",
      "Drama",
      "Thriller"
    ],
    "duration": 200,
    "posterUrl": "/posters/pushpa-2.jpg",
    "backdropUrl": "https://img.youtube.com/vi/1kVK0MZlbI4/maxresdefault.jpg",
    "releaseDate": "2024-12-05T00:00:00.000Z",
    "ticketPrice": 380,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 9.2,
    "language": "Hindi",
    "trailerKey": "1kVK0MZlbI4",
    "director": "Sukumar",
    "category": "now_playing",
    "cast": [
      {
        "name": "Allu Arjun",
        "character": "Pushpa Raj",
        "profileUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Rashmika Mandanna",
        "character": "Srivalli",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Fahadh Faasil",
        "character": "SP Bhanwar Singh Shekhawat",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sunil",
        "character": "Mangalam Srinu",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:15 AM",
      "02:00 PM",
      "06:15 PM",
      "10:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 120000,
    "_id": "65f1b0000000000000000092",
    "title": "Chhaava",
    "aliases": [
      "Chhava",
      "Chhatrapati Sambhaji Maharaj",
      "Vicky Kaushal Chhaava"
    ],
    "industry": "Bollywood",
    "description": "A monumental historical spectacle chronicling the fearless valor, military brilliance, and heroic sacrifice of Chhatrapati Sambhaji Maharaj, the lionhearted Maratha ruler and son of Shivaji Maharaj.",
    "genre": [
      "History",
      "Action",
      "Drama",
      "Biography"
    ],
    "duration": 165,
    "posterUrl": "/posters/chhaava.jpg",
    "backdropUrl": "https://img.youtube.com/vi/F6dGg2JX8Lc/maxresdefault.jpg",
    "releaseDate": "2025-02-14T00:00:00.000Z",
    "ticketPrice": 350,
    "theater": "iMovies Lincoln Square IMAX",
    "rating": 9.4,
    "language": "Hindi",
    "trailerKey": "F6dGg2JX8Lc",
    "director": "Laxman Utekar",
    "category": "now_playing",
    "cast": [
      {
        "name": "Vicky Kaushal",
        "character": "Chhatrapati Sambhaji Maharaj",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Rashmika Mandanna",
        "character": "Yesubai Bhonsale",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Akshaye Khanna",
        "character": "Aurangzeb",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Ashutosh Rana",
        "character": "Hambirrao Mohite",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "02:30 PM",
      "06:15 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 98799,
    "_id": "65f1b000000000000000003e",
    "title": "The Wolf of Wall Street",
    "industry": "Hollywood",
    "description": "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime and corruption on Wall Street.",
    "genre": [
      "Biography",
      "Comedy",
      "Crime",
      "Drama"
    ],
    "duration": 180,
    "posterUrl": "https://image.tmdb.org/t/p/w780/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/fK5ssFhVsUWcfWqCtsf0yM.jpg",
    "releaseDate": "2013-12-25T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "AMC Lincoln Square IMAX",
    "rating": 8.2,
    "language": "English",
    "trailerKey": "iszwuX1AK6A",
    "director": "Martin Scorsese",
    "category": "popular",
    "cast": [
      {
        "name": "Leonardo DiCaprio",
        "character": "Jordan Belfort",
        "profileUrl": "https://image.tmdb.org/t/p/w185/dicaprio.jpg"
      },
      {
        "name": "Jonah Hill",
        "character": "Donnie Azoff",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jonahhill.jpg"
      },
      {
        "name": "Margot Robbie",
        "character": "Naomi Lapaglia",
        "profileUrl": "https://image.tmdb.org/t/p/w185/margotrobbie.jpg"
      }
    ],
    "showtimes": [
      "12:30 PM",
      "04:30 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 94200,
    "_id": "65f1b000000000000000003f",
    "title": "The Social Network",
    "industry": "Hollywood",
    "description": "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.",
    "genre": [
      "Biography",
      "Drama"
    ],
    "duration": 120,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.png",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/kH4vFw3gCgU2j8K63tUvhbMlhR6.jpg",
    "releaseDate": "2010-10-01T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "Cineworld Leicester Square",
    "rating": 7.8,
    "language": "English",
    "trailerKey": "lB95KLmpLR4",
    "director": "David Fincher",
    "category": "popular",
    "cast": [
      {
        "name": "Jesse Eisenberg",
        "character": "Mark Zuckerberg",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jesseeisenberg.jpg"
      },
      {
        "name": "Andrew Garfield",
        "character": "Eduardo Saverin",
        "profileUrl": "https://image.tmdb.org/t/p/w185/andrewgarfield.jpg"
      },
      {
        "name": "Justin Timberlake",
        "character": "Sean Parker",
        "profileUrl": "https://image.tmdb.org/t/p/w185/timberlake.jpg"
      }
    ],
    "showtimes": [
      "02:15 PM",
      "05:45 PM",
      "08:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 108000,
    "_id": "65f1b0000000000000000040",
    "title": "Schindler's List",
    "industry": "Hollywood",
    "description": "In German-occupied Poland during WWII, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    "genre": [
      "Biography",
      "Drama",
      "History",
      "War"
    ],
    "duration": 195,
    "posterUrl": "https://image.tmdb.org/t/p/w780/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/8pjWFs9bZtgoh5qK4dYcK7bMlhR.jpg",
    "releaseDate": "1993-12-15T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "BFI Southbank Screen 1",
    "rating": 9,
    "language": "English",
    "trailerKey": "gG22XNhtnoY",
    "director": "Steven Spielberg",
    "category": "popular",
    "cast": [
      {
        "name": "Liam Neeson",
        "character": "Oskar Schindler",
        "profileUrl": "https://image.tmdb.org/t/p/w185/liamneeson.jpg"
      },
      {
        "name": "Ben Kingsley",
        "character": "Itzhak Stern",
        "profileUrl": "https://image.tmdb.org/t/p/w185/benkingsley.jpg"
      },
      {
        "name": "Ralph Fiennes",
        "character": "Amon Göth",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ralphfiennes.jpg"
      }
    ],
    "showtimes": [
      "01:00 PM",
      "05:30 PM",
      "09:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 86150,
    "_id": "65f1b0000000000000000044",
    "title": "Aashiqui 2",
    "industry": "Bollywood",
    "description": "Fading music icon Rahul discovers talented bar singer Aarohi and turns her into a superstar, even as his own personal demons threaten their passionate love.",
    "genre": [
      "Musical",
      "Romance",
      "Drama"
    ],
    "duration": 132,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/f/f3/Aashiqui_2_%28Poster%29.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mSDmvloA24Q0c2Yc7a8r0t2y.jpg",
    "releaseDate": "2013-04-26T00:00:00.000Z",
    "ticketPrice": 260,
    "theater": "Cinepolis VIP Screens",
    "rating": 7.1,
    "language": "Hindi",
    "trailerKey": "FyXXgpPqe6w",
    "director": "Mohit Suri",
    "category": "popular",
    "cast": [
      {
        "name": "Aditya Roy Kapur",
        "character": "Rahul Jaykar",
        "profileUrl": "https://image.tmdb.org/t/p/w185/aditya.jpg"
      },
      {
        "name": "Shraddha Kapoor",
        "character": "Aarohi Keshav Shirke",
        "profileUrl": "https://image.tmdb.org/t/p/w185/shraddha.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "02:30 PM",
      "06:00 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 95350,
    "_id": "65f1b0000000000000000046",
    "title": "Bohemian Rhapsody",
    "industry": "Hollywood",
    "description": "The foot-stomping celebration of Queen, their music, and their extraordinary lead singer Freddie Mercury, leading up to their unforgettable 1985 Live Aid performance.",
    "genre": [
      "Musical",
      "Biography",
      "Drama"
    ],
    "duration": 134,
    "posterUrl": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/kH4vFw3gCgU2j8K63tUvhbMlhR6.jpg",
    "releaseDate": "2018-11-02T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "Odeon Luxe Leicester Square",
    "rating": 7.9,
    "language": "English",
    "trailerKey": "mP0VHJYFOAU",
    "director": "Bryan Singer",
    "category": "popular",
    "cast": [
      {
        "name": "Rami Malek",
        "character": "Freddie Mercury",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ramimalek.jpg"
      },
      {
        "name": "Lucy Boynton",
        "character": "Mary Austin",
        "profileUrl": "https://image.tmdb.org/t/p/w185/lucyboynton.jpg"
      },
      {
        "name": "Gwilym Lee",
        "character": "Brian May",
        "profileUrl": "https://image.tmdb.org/t/p/w185/gwilymlee.jpg"
      }
    ],
    "showtimes": [
      "12:45 PM",
      "04:15 PM",
      "07:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 78500,
    "_id": "65f1b0000000000000000047",
    "title": "Munjya",
    "industry": "Bollywood",
    "description": "A young man returns to his ancestral Konkan village and inadvertently releases a vengeful spirit named Munjya obsessed with finding a bride. Directed by Aditya Sarpotdar and starring Sharvari, Abhay Verma, and Mona Singh.",
    "genre": [
      "Horror",
      "Comedy",
      "Mystery"
    ],
    "duration": 123,
    "posterUrl": "/posters/munjya.jpg",
    "backdropUrl": "https://img.youtube.com/vi/OAhD_mgWQ_U/maxresdefault.jpg",
    "releaseDate": "2024-06-07T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "iMovies INOX Megaplex Malad",
    "rating": 8.2,
    "language": "Hindi",
    "trailerKey": "OAhD_mgWQ_U",
    "director": "Aditya Sarpotdar",
    "category": "now_playing",
    "cast": [
      {
        "name": "Sharvari Wagh",
        "character": "Bela",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Abhay Verma",
        "character": "Bittu",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Mona Singh",
        "character": "Pammi (Bittu’s Mother)",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sathyaraj",
        "character": "Elvis Karim Prabhakar",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "01:30 PM",
      "04:45 PM",
      "08:00 PM",
      "10:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 94200,
    "_id": "65f1b000000000000000004a",
    "title": "Get Out",
    "industry": "Hollywood",
    "description": "A young African-American visits his white girlfriend’s parents for the weekend, where his simmering uneasiness about their reception reaches a boiling point.",
    "genre": [
      "Horror",
      "Mystery",
      "Thriller"
    ],
    "duration": 104,
    "posterUrl": "https://image.tmdb.org/t/p/w780/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/2u0u565Z0b8y4Zc6e4e7a8r0t2y.jpg",
    "releaseDate": "2017-02-24T00:00:00.000Z",
    "ticketPrice": 270,
    "theater": "Regal LA Live Screen 5",
    "rating": 7.8,
    "language": "English",
    "trailerKey": "DzfpyUB60YY",
    "director": "Jordan Peele",
    "category": "popular",
    "cast": [
      {
        "name": "Daniel Kaluuya",
        "character": "Chris Washington",
        "profileUrl": "https://image.tmdb.org/t/p/w185/danielkaluuya.jpg"
      },
      {
        "name": "Allison Williams",
        "character": "Rose Armitage",
        "profileUrl": "https://image.tmdb.org/t/p/w185/allisonwilliams.jpg"
      }
    ],
    "showtimes": [
      "04:30 PM",
      "08:00 PM",
      "10:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 91900,
    "_id": "65f1b000000000000000004b",
    "title": "Furiosa: A Mad Max Saga",
    "industry": "Hollywood",
    "description": "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers into the hands of a Biker Horde led by Warlord Dementus.",
    "genre": [
      "Action",
      "Sci-Fi",
      "Adventure"
    ],
    "duration": 148,
    "posterUrl": "/posters/furiosa.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mSDmvloA24Q0c2Yc7a8r0t2y.jpg",
    "releaseDate": "2024-05-24T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "iMovies IMAX Laser Screen 1",
    "rating": 7.6,
    "language": "English",
    "trailerKey": "XJMuhwVlca4",
    "director": "George Miller",
    "category": "now_playing",
    "cast": [
      {
        "name": "Anya Taylor-Joy",
        "character": "Imperator Furiosa",
        "profileUrl": "https://image.tmdb.org/t/p/w185/anyataylorjoy.jpg"
      },
      {
        "name": "Chris Hemsworth",
        "character": "Warlord Dementus",
        "profileUrl": "https://image.tmdb.org/t/p/w185/chrishemsworth.jpg"
      },
      {
        "name": "Tom Burke",
        "character": "Praetorian Jack",
        "profileUrl": "https://image.tmdb.org/t/p/w185/tomburke.jpg"
      }
    ],
    "showtimes": [
      "11:45 AM",
      "03:15 PM",
      "06:45 PM",
      "10:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 104549,
    "_id": "65f1b000000000000000004c",
    "title": "The Matrix",
    "industry": "Hollywood",
    "description": "When a computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    "genre": [
      "Action",
      "Sci-Fi"
    ],
    "duration": 136,
    "posterUrl": "https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/fK5ssFhVsUWcfWqCtsf0yM.jpg",
    "releaseDate": "1999-03-31T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "Dolby Cinema Auditorium 1",
    "rating": 8.7,
    "language": "English",
    "trailerKey": "vKQi3bBA1y8",
    "director": "The Wachowskis",
    "category": "popular",
    "cast": [
      {
        "name": "Keanu Reeves",
        "character": "Thomas Anderson / Neo",
        "profileUrl": "https://image.tmdb.org/t/p/w185/keanureeves.jpg"
      },
      {
        "name": "Laurence Fishburne",
        "character": "Morpheus",
        "profileUrl": "https://image.tmdb.org/t/p/w185/laurencefishburne.jpg"
      },
      {
        "name": "Carrie-Anne Moss",
        "character": "Trinity",
        "profileUrl": "https://image.tmdb.org/t/p/w185/carrieannemoss.jpg"
      }
    ],
    "showtimes": [
      "01:15 PM",
      "04:45 PM",
      "08:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 93050,
    "_id": "65f1b000000000000000004d",
    "title": "John Wick: Chapter 4",
    "industry": "Hollywood",
    "description": "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
    "genre": [
      "Action",
      "Crime",
      "Thriller"
    ],
    "duration": 169,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/d/d0/John_Wick_-_Chapter_4_promotional_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/kH4vFw3gCgU2j8K63tUvhbMlhR6.jpg",
    "releaseDate": "2023-03-24T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "Cineworld IMAX SuperScreen",
    "rating": 7.7,
    "language": "English",
    "trailerKey": "qEVUtrk8_B4",
    "director": "Chad Stahelski",
    "category": "popular",
    "cast": [
      {
        "name": "Keanu Reeves",
        "character": "John Wick",
        "profileUrl": "https://image.tmdb.org/t/p/w185/keanureeves.jpg"
      },
      {
        "name": "Donnie Yen",
        "character": "Caine",
        "profileUrl": "https://image.tmdb.org/t/p/w185/donnieyen.jpg"
      },
      {
        "name": "Bill Skarsgård",
        "character": "Marquis de Gramont",
        "profileUrl": "https://image.tmdb.org/t/p/w185/billskarsgard.jpg"
      }
    ],
    "showtimes": [
      "12:00 PM",
      "03:45 PM",
      "07:30 PM",
      "10:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 99950,
    "_id": "65f1b000000000000000004e",
    "title": "K.G.F: Chapter 2",
    "industry": "Bollywood",
    "description": "In the blood-soaked Kolar Gold Fields, Rocky’s name strikes dread into his enemies. As the government sees him as a menace, Rocky must battle Adheera and Inayat Khalil.",
    "genre": [
      "Action",
      "Crime",
      "Drama"
    ],
    "duration": 168,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/8pjWFs9bZtgoh5qK4dYcK7bMlhR.jpg",
    "releaseDate": "2022-04-14T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "PVR P[XL] & IMAX Screen 1",
    "rating": 8.3,
    "language": "Hindi",
    "trailerKey": "JKa05nyUmuQ",
    "director": "Prashanth Neel",
    "category": "popular",
    "cast": [
      {
        "name": "Yash",
        "character": "Raja Krishnappa Bairya / Rocky",
        "profileUrl": "https://image.tmdb.org/t/p/w185/yash.jpg"
      },
      {
        "name": "Sanjay Dutt",
        "character": "Adheera",
        "profileUrl": "https://image.tmdb.org/t/p/w185/sanjaydutt.jpg"
      },
      {
        "name": "Raveena Tandon",
        "character": "Ramika Sen",
        "profileUrl": "https://image.tmdb.org/t/p/w185/raveena.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "02:45 PM",
      "06:30 PM",
      "10:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 86000,
    "_id": "65f1b0000000000000000050",
    "title": "Singham Again",
    "industry": "Bollywood",
    "description": "DCP Bajirao Singham unites with DCP Veer Sooryavanshi, Sangram Bhalerao, and Lady Singham Shakti Shetty in an explosive cinematic universe showdown.",
    "genre": [
      "Action",
      "Drama",
      "Crime"
    ],
    "duration": 154,
    "posterUrl": "/posters/singham-again.jpg",
    "backdropUrl": "https://img.youtube.com/vi/MD7v0-igVIM/maxresdefault.jpg",
    "releaseDate": "2024-11-01T00:00:00.000Z",
    "ticketPrice": 300,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.1,
    "language": "Hindi",
    "trailerKey": "MD7v0-igVIM",
    "director": "Rohit Shetty",
    "category": "now_playing",
    "cast": [
      {
        "name": "Ajay Devgn",
        "character": "DCP Bajirao Singham",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Kareena Kapoor",
        "character": "Avni Kamat",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Ranveer Singh",
        "character": "Sangram Bhalerao (Simmba)",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Akshay Kumar",
        "character": "DCP Veer Sooryavanshi",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "02:00 PM",
      "05:30 PM",
      "09:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 97650,
    "_id": "65f1b0000000000000000052",
    "title": "Munna Bhai M.B.B.S.",
    "industry": "Bollywood",
    "description": "A lovable Mumbai gangster sets out to fulfill his father’s dream of becoming a certified doctor, enrolling in medical college and prescribing laughter and hugs.",
    "genre": [
      "Comedy",
      "Drama"
    ],
    "duration": 156,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/8/84/Munna_Bhai_M.B.B.S._poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mSDmvloA24Q0c2Yc7a8r0t2y.jpg",
    "releaseDate": "2003-12-19T00:00:00.000Z",
    "ticketPrice": 260,
    "theater": "INOX Megaplex Screen 4",
    "rating": 8.1,
    "language": "Hindi",
    "trailerKey": "6L6XqWoS8tw",
    "director": "Rajkumar Hirani",
    "category": "popular",
    "cast": [
      {
        "name": "Sanjay Dutt",
        "character": "Murli Prasad Sharma (Munna Bhai)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/sanjaydutt.jpg"
      },
      {
        "name": "Arshad Warsi",
        "character": "Circuit (Sarkeshwar)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/arshad.jpg"
      },
      {
        "name": "Boman Irani",
        "character": "Dr. J. C. Asthana",
        "profileUrl": "https://image.tmdb.org/t/p/w185/boman.jpg"
      }
    ],
    "showtimes": [
      "01:00 PM",
      "04:30 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 97650,
    "_id": "65f1b0000000000000000053",
    "title": "The Grand Budapest Hotel",
    "industry": "Hollywood",
    "description": "A writer encounters the owner of an aging high-class European hotel, who tells him of his early years serving as a lobby boy to an exceptional concierge.",
    "genre": [
      "Comedy",
      "Adventure",
      "Crime"
    ],
    "duration": 99,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Grand_Budapest_Hotel.png",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/fK5ssFhVsUWcfWqCtsf0yM.jpg",
    "releaseDate": "2014-03-28T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "BFI Southbank Screen 1",
    "rating": 8.1,
    "language": "English",
    "trailerKey": "1Fg5iWmQjwk",
    "director": "Wes Anderson",
    "category": "popular",
    "cast": [
      {
        "name": "Ralph Fiennes",
        "character": "Monsieur Gustave H.",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ralphfiennes.jpg"
      },
      {
        "name": "Tony Revolori",
        "character": "Zero Moustafa",
        "profileUrl": "https://image.tmdb.org/t/p/w185/tonyrevolori.jpg"
      },
      {
        "name": "Saoirse Ronan",
        "character": "Agatha",
        "profileUrl": "https://image.tmdb.org/t/p/w185/saoirse.jpg"
      }
    ],
    "showtimes": [
      "02:15 PM",
      "05:45 PM",
      "08:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 103400,
    "_id": "65f1b0000000000000000055",
    "title": "Saving Private Ryan",
    "industry": "Hollywood",
    "description": "Following the Normandy Landings, Captain John Miller leads a squad behind enemy lines to locate and retrieve paratrooper Private James Ryan whose brothers have fallen.",
    "genre": [
      "War",
      "Drama",
      "Action",
      "History"
    ],
    "duration": 169,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/a/ac/Saving_Private_Ryan_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/8pjWFs9bZtgoh5qK4dYcK7bMlhR.jpg",
    "releaseDate": "1998-07-24T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "Dolby Cinema Screen 2",
    "rating": 8.6,
    "language": "English",
    "trailerKey": "zwhP5b4tD6g",
    "director": "Steven Spielberg",
    "category": "popular",
    "cast": [
      {
        "name": "Tom Hanks",
        "character": "Captain John Miller",
        "profileUrl": "https://image.tmdb.org/t/p/w185/tomhanks.jpg"
      },
      {
        "name": "Matt Damon",
        "character": "Private James Francis Ryan",
        "profileUrl": "https://image.tmdb.org/t/p/w185/mattdamon.jpg"
      },
      {
        "name": "Tom Sizemore",
        "character": "Sergeant Mike Horvath",
        "profileUrl": "https://image.tmdb.org/t/p/w185/tomsizemore.jpg"
      }
    ],
    "showtimes": [
      "12:30 PM",
      "04:30 PM",
      "08:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 98799,
    "_id": "65f1b0000000000000000056",
    "title": "1917",
    "industry": "Hollywood",
    "description": "April 6th, 1917. As an infantry battalion assembles to wage war deep in enemy territory, two British soldiers are assigned to race against time and deliver a message.",
    "genre": [
      "War",
      "Drama",
      "Action",
      "History"
    ],
    "duration": 119,
    "posterUrl": "https://image.tmdb.org/t/p/w780/iZf0KyrE25z1sage4SYFLCCrMi9.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/5nZbvK8oQ2kU4jH7mZ5p2e6c1.jpg",
    "releaseDate": "2019-12-25T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "Cineworld Leicester Square IMAX",
    "rating": 8.2,
    "language": "English",
    "trailerKey": "YqNYrYUiMfg",
    "director": "Sam Mendes",
    "category": "popular",
    "cast": [
      {
        "name": "George MacKay",
        "character": "Lance Corporal William Schofield",
        "profileUrl": "https://image.tmdb.org/t/p/w185/georgemackay.jpg"
      },
      {
        "name": "Dean-Charles Chapman",
        "character": "Lance Corporal Tom Blake",
        "profileUrl": "https://image.tmdb.org/t/p/w185/deancharles.jpg"
      }
    ],
    "showtimes": [
      "01:45 PM",
      "05:15 PM",
      "08:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 64500,
    "_id": "65f1b000000000000000005b",
    "title": "Merry Christmas",
    "aliases": [
      "Merry Christmas 2024",
      "Sriram Raghavan Merry Christmas"
    ],
    "industry": "Bollywood",
    "description": "On Christmas Eve, an uneasy romance between two strangers in Mumbai takes a dark, unpredictable turn as the festive night turns into an intricate labyrinth of secrets, murder, and deception.",
    "genre": [
      "Mystery",
      "Thriller",
      "Neo-Noir",
      "Romance",
      "Drama"
    ],
    "duration": 142,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/b/b0/Merry_Christmas_film_poster.jpg",
    "backdropUrl": "https://img.youtube.com/vi/ugGGNSPMRDk/maxresdefault.jpg",
    "releaseDate": "2024-01-12T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "iMovies INOX Megaplex Malad",
    "rating": 8.3,
    "language": "Hindi",
    "trailerKey": "ugGGNSPMRDk",
    "director": "Sriram Raghavan",
    "category": "popular",
    "cast": [
      {
        "name": "Katrina Kaif",
        "character": "Maria",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Vijay Sethupathi",
        "character": "Albert",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Sanjay Kapoor",
        "character": "Ronnie",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Vinay Pathak",
        "character": "Inspector Paresh Kamdar",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Pratima Kazmi",
        "character": "Laxmi",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Radhika Apte",
        "character": "Rosie (Cameo)",
        "profileUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "12:00 PM",
      "03:30 PM",
      "07:00 PM",
      "10:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 94200,
    "_id": "65f1b000000000000000005e",
    "title": "Badla",
    "aliases": [
      "The Invisible Guest Remake"
    ],
    "industry": "Bollywood",
    "description": "A dynamic young entrepreneur finds herself locked in a hotel room with the corpse of her dead lover. A veteran lawyer is hired to construct a defense over an intense three-hour conversation.",
    "genre": [
      "Mystery",
      "Crime",
      "Thriller",
      "Drama"
    ],
    "duration": 118,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/0/0c/Badla_poster.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/badla_bg.jpg",
    "releaseDate": "2019-03-08T00:00:00.000Z",
    "ticketPrice": 270,
    "theater": "PVR Directors Cut",
    "rating": 7.8,
    "language": "Hindi",
    "trailerKey": "mSlgu8AQAd4",
    "director": "Sujoy Ghosh",
    "category": "popular",
    "cast": [
      {
        "name": "Amitabh Bachchan",
        "character": "Badal Gupta",
        "profileUrl": "https://image.tmdb.org/t/p/w185/amitabh.jpg"
      },
      {
        "name": "Taapsee Pannu",
        "character": "Naina Sethi",
        "profileUrl": "https://image.tmdb.org/t/p/w185/taapsee.jpg"
      },
      {
        "name": "Amrita Singh",
        "character": "Rani Kaur",
        "profileUrl": "https://image.tmdb.org/t/p/w185/amrita.jpg"
      }
    ],
    "showtimes": [
      "11:45 AM",
      "03:00 PM",
      "06:30 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 68400,
    "_id": "65f1b000000000000000005f",
    "title": "Jaane Jaan",
    "aliases": [
      "Jaane Jaan 2023",
      "The Devotion of Suspect X",
      "Jaane Jaan Netflix",
      "Kareena Kapoor Jaane Jaan"
    ],
    "industry": "Bollywood",
    "description": "A gifted, reclusive high school mathematics teacher helps his single-mother neighbor cover up the accidental murder of her abusive ex-husband, sparking an intense battle of wits with an astute police investigator.",
    "genre": [
      "Mystery",
      "Thriller",
      "Crime",
      "Drama"
    ],
    "duration": 139,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/b/bc/Jaane_Jaan_Poster.jpeg",
    "backdropUrl": "https://img.youtube.com/vi/QmHvckh2GMw/maxresdefault.jpg",
    "releaseDate": "2023-09-21T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "iMovies PVR ICON Lower Parel",
    "rating": 8.2,
    "language": "Hindi",
    "trailerKey": "QmHvckh2GMw",
    "director": "Sujoy Ghosh",
    "category": "popular",
    "cast": [
      {
        "name": "Kareena Kapoor Khan",
        "character": "Maya D'Souza",
        "profileUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Jaideep Ahlawat",
        "character": "Naren Vyas",
        "profileUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Vijay Varma",
        "character": "Inspector Karan Anand",
        "profileUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Saurabh Sachdeva",
        "character": "Ajit Mhatre",
        "profileUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=185&auto=format&fit=crop&q=80"
      },
      {
        "name": "Lin Laishram",
        "character": "Prema",
        "profileUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80"
      }
    ],
    "showtimes": [
      "12:30 PM",
      "04:00 PM",
      "07:30 PM",
      "10:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 98799,
    "_id": "65f1b0000000000000000060",
    "title": "Shutter Island",
    "aliases": [
      "Ashecliffe"
    ],
    "industry": "Hollywood",
    "description": "In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane on a secluded Boston island.",
    "genre": [
      "Mystery",
      "Thriller",
      "Drama"
    ],
    "duration": 138,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/7/76/Shutterislandposter.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/c8vdqRjC1m4o5z9w8q8.jpg",
    "releaseDate": "2010-02-19T00:00:00.000Z",
    "ticketPrice": 290,
    "theater": "Odeon Luxe Leicester Square",
    "rating": 8.2,
    "language": "English",
    "trailerKey": "5iaYLCiq5RM",
    "director": "Martin Scorsese",
    "category": "popular",
    "cast": [
      {
        "name": "Leonardo DiCaprio",
        "character": "Teddy Daniels",
        "profileUrl": "https://image.tmdb.org/t/p/w185/dicaprio.jpg"
      },
      {
        "name": "Mark Ruffalo",
        "character": "Chuck Aule",
        "profileUrl": "https://image.tmdb.org/t/p/w185/markruffalo.jpg"
      },
      {
        "name": "Ben Kingsley",
        "character": "Dr. John Cawley",
        "profileUrl": "https://image.tmdb.org/t/p/w185/benkingsley.jpg"
      }
    ],
    "showtimes": [
      "01:00 PM",
      "04:30 PM",
      "08:00 PM",
      "11:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 97650,
    "_id": "65f1b0000000000000000061",
    "title": "Gone Girl",
    "aliases": [
      "Amazing Amy"
    ],
    "industry": "Hollywood",
    "description": "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent.",
    "genre": [
      "Mystery",
      "Thriller",
      "Drama",
      "Crime"
    ],
    "duration": 149,
    "posterUrl": "https://image.tmdb.org/t/p/w780/qymaJhucquUwjpb8oiqynMeXnID.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mDgQvG5t9V2.jpg",
    "releaseDate": "2014-10-03T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "Regal IMAX at LA LIVE",
    "rating": 8.1,
    "language": "English",
    "trailerKey": "2-_-1nJf8Vg",
    "director": "David Fincher",
    "category": "popular",
    "cast": [
      {
        "name": "Ben Affleck",
        "character": "Nick Dunne",
        "profileUrl": "https://image.tmdb.org/t/p/w185/benaffleck.jpg"
      },
      {
        "name": "Rosamund Pike",
        "character": "Amy Dunne",
        "profileUrl": "https://image.tmdb.org/t/p/w185/rosamundpike.jpg"
      },
      {
        "name": "Neil Patrick Harris",
        "character": "Desi Collings",
        "profileUrl": "https://image.tmdb.org/t/p/w185/nph.jpg"
      }
    ],
    "showtimes": [
      "11:15 AM",
      "02:45 PM",
      "06:15 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 103400,
    "_id": "65f1b0000000000000000063",
    "title": "Se7en",
    "aliases": [
      "Seven",
      "Seven 1995"
    ],
    "industry": "Hollywood",
    "description": "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motifs in a rain-soaked, morally decayed metropolis.",
    "genre": [
      "Mystery",
      "Crime",
      "Thriller",
      "Drama"
    ],
    "duration": 127,
    "posterUrl": "https://image.tmdb.org/t/p/w780/6yoghtyTpznpBik8EngEmJskVUO.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/se7en_bg.jpg",
    "releaseDate": "1995-09-22T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "TCL Chinese Theatre IMAX",
    "rating": 8.6,
    "language": "English",
    "trailerKey": "znmZoVkCjpI",
    "director": "David Fincher",
    "category": "popular",
    "cast": [
      {
        "name": "Brad Pitt",
        "character": "Detective David Mills",
        "profileUrl": "https://image.tmdb.org/t/p/w185/bradpitt.jpg"
      },
      {
        "name": "Morgan Freeman",
        "character": "Detective William Somerset",
        "profileUrl": "https://image.tmdb.org/t/p/w185/morganfreeman.jpg"
      },
      {
        "name": "Kevin Spacey",
        "character": "John Doe",
        "profileUrl": "https://image.tmdb.org/t/p/w185/kevinspacey.jpg"
      }
    ],
    "showtimes": [
      "01:30 PM",
      "05:00 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 86150,
    "_id": "65f1b0000000000000000065",
    "title": "Glass Onion: A Knives Out Mystery",
    "aliases": [
      "Glass Onion",
      "Knives Out 2"
    ],
    "industry": "Hollywood",
    "description": "Famed Southern detective Benoit Blanc travels to a private Greek island to unravel a convoluted murder mystery hosted by a eccentric tech billionaire.",
    "genre": [
      "Mystery",
      "Comedy",
      "Crime",
      "Drama"
    ],
    "duration": 139,
    "posterUrl": "https://image.tmdb.org/t/p/w780/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/dKQA85fA2aLq.jpg",
    "releaseDate": "2022-11-23T00:00:00.000Z",
    "ticketPrice": 285,
    "theater": "Alamo Drafthouse Cinema",
    "rating": 7.1,
    "language": "English",
    "trailerKey": "gj5ibYSz8C0",
    "director": "Rian Johnson",
    "category": "popular",
    "cast": [
      {
        "name": "Daniel Craig",
        "character": "Benoit Blanc",
        "profileUrl": "https://image.tmdb.org/t/p/w185/danielcraig.jpg"
      },
      {
        "name": "Edward Norton",
        "character": "Miles Bron",
        "profileUrl": "https://image.tmdb.org/t/p/w185/edwardnorton.jpg"
      },
      {
        "name": "Janelle Monáe",
        "character": "Helen Brand / Andi Brand",
        "profileUrl": "https://image.tmdb.org/t/p/w185/monae.jpg"
      }
    ],
    "showtimes": [
      "12:30 PM",
      "04:15 PM",
      "07:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 86150,
    "_id": "65f1b0000000000000000068",
    "title": "Mahabharat 3D",
    "aliases": [
      "Mahabharat Animation"
    ],
    "industry": "Bollywood",
    "description": "The sacred epic saga of the Pandavas and Kauravas brought to life in state-of-the-art 3D animation featuring Bollywood legends voicing iconic warriors.",
    "genre": [
      "Animation",
      "Action",
      "Drama",
      "History",
      "Fantasy"
    ],
    "duration": 125,
    "posterUrl": "https://upload.wikimedia.org/wikipedia/en/6/6c/Mahabharat_3d.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/mahabharat3d_bg.jpg",
    "releaseDate": "2013-12-27T00:00:00.000Z",
    "ticketPrice": 260,
    "theater": "PVR Heritage Epic Cinema",
    "rating": 7.1,
    "language": "Hindi",
    "trailerKey": "kQDd1AhGIHk",
    "director": "Amaan Khan",
    "category": "popular",
    "cast": [
      {
        "name": "Amitabh Bachchan",
        "character": "Bheeshma Pitamah (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/amitabh.jpg"
      },
      {
        "name": "Ajay Devgn",
        "character": "Duryodhan (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ajaydevgn.jpg"
      },
      {
        "name": "Vidya Balan",
        "character": "Draupadi (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/vidyabalan.jpg"
      },
      {
        "name": "Sunny Deol",
        "character": "Bheem (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/sunnydeol.jpg"
      }
    ],
    "showtimes": [
      "01:00 PM",
      "04:30 PM",
      "08:00 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 99950,
    "_id": "65f1b000000000000000006b",
    "title": "Up",
    "aliases": [
      "Up Pixar"
    ],
    "industry": "Hollywood",
    "description": "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with thousands of helium balloons, inadvertently taking an overzealous young boy scout with him.",
    "genre": [
      "Animation",
      "Adventure",
      "Comedy",
      "Family",
      "Drama"
    ],
    "duration": 96,
    "posterUrl": "https://image.tmdb.org/t/p/w780/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/kC3p0g1g2z.jpg",
    "releaseDate": "2009-05-29T00:00:00.000Z",
    "ticketPrice": 280,
    "theater": "Odeon IMAX Luxe",
    "rating": 8.3,
    "language": "English",
    "trailerKey": "ORFWdXl_zJ4",
    "director": "Pete Docter",
    "category": "popular",
    "cast": [
      {
        "name": "Ed Asner",
        "character": "Carl Fredricksen (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/edasner.jpg"
      },
      {
        "name": "Jordan Nagai",
        "character": "Russell (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jordannagai.jpg"
      },
      {
        "name": "Christopher Plummer",
        "character": "Charles Muntz (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/plummer.jpg"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "01:45 PM",
      "05:15 PM",
      "08:30 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 98799,
    "_id": "65f1b000000000000000006c",
    "title": "Finding Nemo",
    "aliases": [
      "Nemo"
    ],
    "industry": "Hollywood",
    "description": "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish embarks on a perilous journey to bring him home alongside a forgetful blue tang.",
    "genre": [
      "Animation",
      "Adventure",
      "Comedy",
      "Family"
    ],
    "duration": 100,
    "posterUrl": "https://image.tmdb.org/t/p/w780/5lc6nQc0VhWFYFbNv016xze8Jvy.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/nemo_bg.jpg",
    "releaseDate": "2003-05-30T00:00:00.000Z",
    "ticketPrice": 275,
    "theater": "BFI IMAX London",
    "rating": 8.2,
    "language": "English",
    "trailerKey": "2zLkasScy7A",
    "director": "Andrew Stanton",
    "category": "popular",
    "cast": [
      {
        "name": "Albert Brooks",
        "character": "Marlin (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/albertbrooks.jpg"
      },
      {
        "name": "Ellen DeGeneres",
        "character": "Dory (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/ellendegeneres.jpg"
      },
      {
        "name": "Alexander Gould",
        "character": "Nemo (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/alexgould.jpg"
      }
    ],
    "showtimes": [
      "11:00 AM",
      "02:30 PM",
      "06:00 PM",
      "09:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 99950,
    "_id": "65f1b000000000000000006d",
    "title": "Toy Story",
    "aliases": [
      "Toy Story 1"
    ],
    "industry": "Hollywood",
    "description": "A cowboy doll is profoundly threatened and jealous when a high-tech spaceman action figure supplants him as top toy in a boy's bedroom.",
    "genre": [
      "Animation",
      "Adventure",
      "Comedy",
      "Family"
    ],
    "duration": 81,
    "posterUrl": "https://image.tmdb.org/t/p/w780/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/toystory_bg.jpg",
    "releaseDate": "1995-11-22T00:00:00.000Z",
    "ticketPrice": 270,
    "theater": "Regal Dolby Cinema",
    "rating": 8.3,
    "language": "English",
    "trailerKey": "v-PjgYDrg70",
    "director": "John Lasseter",
    "category": "popular",
    "cast": [
      {
        "name": "Tom Hanks",
        "character": "Woody (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/tomhanks.jpg"
      },
      {
        "name": "Tim Allen",
        "character": "Buzz Lightyear (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/timallen.jpg"
      },
      {
        "name": "Don Rickles",
        "character": "Mr. Potato Head (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/donrickles.jpg"
      }
    ],
    "showtimes": [
      "10:15 AM",
      "01:15 PM",
      "04:45 PM",
      "07:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 101100,
    "_id": "65f1b000000000000000006e",
    "title": "Spider-Man: Into the Spider-Verse",
    "aliases": [
      "Spider-Verse",
      "Into the Spider-Verse"
    ],
    "industry": "Hollywood",
    "description": "Teenager Miles Morales becomes the new Spider-Man and joins other Spider-Heroes from alternate dimensions to stop a threat to all existence.",
    "genre": [
      "Animation",
      "Action",
      "Sci-Fi",
      "Adventure",
      "Family"
    ],
    "duration": 117,
    "posterUrl": "https://image.tmdb.org/t/p/w780/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/spiderverse_bg.jpg",
    "releaseDate": "2018-12-14T00:00:00.000Z",
    "ticketPrice": 285,
    "theater": "AMC IMAX Laser 3D",
    "rating": 8.4,
    "language": "English",
    "trailerKey": "tg52up16eq0",
    "director": "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    "category": "popular",
    "cast": [
      {
        "name": "Shameik Moore",
        "character": "Miles Morales (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/shameik.jpg"
      },
      {
        "name": "Jake Johnson",
        "character": "Peter B. Parker (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/jakejohnson.jpg"
      },
      {
        "name": "Hailee Steinfeld",
        "character": "Gwen Stacy (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/haileesteinfeld.jpg"
      }
    ],
    "showtimes": [
      "12:00 PM",
      "03:30 PM",
      "07:00 PM",
      "10:15 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 96500,
    "_id": "65f1b0000000000000000070",
    "title": "Zootopia",
    "aliases": [
      "Zootropolis"
    ],
    "industry": "Hollywood",
    "description": "In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a sinister conspiracy shaking the metropolis.",
    "genre": [
      "Animation",
      "Comedy",
      "Adventure",
      "Family",
      "Mystery"
    ],
    "duration": 108,
    "posterUrl": "https://image.tmdb.org/t/p/w780/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/zootopia_bg.jpg",
    "releaseDate": "2016-03-04T00:00:00.000Z",
    "ticketPrice": 275,
    "theater": "Regal IMAX South Beach",
    "rating": 8,
    "language": "English",
    "trailerKey": "jWM0ct-OLsM",
    "director": "Byron Howard, Rich Moore",
    "category": "popular",
    "cast": [
      {
        "name": "Ginnifer Goodwin",
        "character": "Judy Hopps (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/goodwin.jpg"
      },
      {
        "name": "Jason Bateman",
        "character": "Nick Wilde (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/bateman.jpg"
      },
      {
        "name": "Idris Elba",
        "character": "Chief Bogo (Voice)",
        "profileUrl": "https://image.tmdb.org/t/p/w185/idriselba.jpg"
      }
    ],
    "showtimes": [
      "10:45 AM",
      "02:15 PM",
      "05:45 PM",
      "08:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  },
  {
    "votes": 94200,
    "_id": "65f1b0000000000000000079",
    "title": "Pride & Prejudice",
    "aliases": [
      "Pride and Prejudice"
    ],
    "industry": "Hollywood",
    "description": "Sparks fly when spirited Elizabeth Bennet meets the single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.",
    "genre": [
      "Romance",
      "Drama",
      "History"
    ],
    "duration": 129,
    "posterUrl": "https://image.tmdb.org/t/p/w780/o8UhmEbWPHmTUxP0lMuCoqNkbB3.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/pride_prejudice_bg.jpg",
    "releaseDate": "2005-09-16T00:00:00.000Z",
    "ticketPrice": 275,
    "theater": "Regal Mayfair Luxury Screen",
    "rating": 7.8,
    "language": "English",
    "trailerKey": "1dYv5u6v55Y",
    "director": "Joe Wright",
    "category": "popular",
    "cast": [
      {
        "name": "Keira Knightley",
        "character": "Elizabeth Bennet",
        "profileUrl": "https://image.tmdb.org/t/p/w185/keiraknightley.jpg"
      },
      {
        "name": "Matthew Macfadyen",
        "character": "Mr. Darcy",
        "profileUrl": "https://image.tmdb.org/t/p/w185/macfadyen.jpg"
      },
      {
        "name": "Donald Sutherland",
        "character": "Mr. Bennet",
        "profileUrl": "https://image.tmdb.org/t/p/w185/sutherland.jpg"
      }
    ],
    "showtimes": [
      "11:30 AM",
      "03:00 PM",
      "06:30 PM",
      "09:45 PM"
    ],
    "countryAvailability": [
      "US",
      "GB",
      "IN",
      "CA",
      "AU",
      "DE",
      "JP",
      "SG",
      "AE"
    ]
  }
];

// Replace invalid demo poster URLs with working poster sources or the shared fallback.
const POSTER_OVERRIDES = require('./poster-overrides.json');
INITIAL_MOVIES.forEach((movie) => {
  const posterUrl = POSTER_OVERRIDES[movie.title];
  if (posterUrl) movie.posterUrl = posterUrl;
});

const today = new Date().toISOString().split('T')[0];
const INITIAL_BOOKINGS = [
  {
    _id: '65f1c0000000000000000001',
    bookingRef: 'IMV-2026-X7942',
    user: '65f1a0000000000000000002',
    movie: '65f1b0000000000000000001',
    cinema: 'iMovies IMAX Laser - Screen 1',
    city: 'Mumbai',
    country: 'IN',
    currency: 'INR',
    seats: ['D4', 'D5', 'E6', 'E7'],
    seatTier: 'Standard & VIP',
    totalPrice: 1280,
    showDate: today,
    showTime: '06:30 PM',
    customer: {
      name: 'Eshani Jain',
      email: 'user@imovies.com',
      phone: '+91 98765 43210'
    },
    paymentStatus: 'paid',
    paymentMethod: 'Simulated Card',
    paymentTransactionId: 'TXN_VIP9472A',
    status: 'confirmed',
    bookingDate: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: '65f1c0000000000000000002',
    bookingRef: 'IMV-2026-L8193',
    user: '65f1a0000000000000000002',
    movie: '65f1b0000000000000000021',
    cinema: 'iMovies PVR Luxe Lower Parel',
    city: 'Mumbai',
    country: 'IN',
    currency: 'INR',
    seats: ['F3', 'F4'],
    seatTier: 'VIP Recliner',
    totalPrice: 700,
    showDate: today,
    showTime: '07:30 PM',
    customer: {
      name: 'Eshani Jain',
      email: 'user@imovies.com',
      phone: '+91 98765 43210'
    },
    paymentStatus: 'paid',
    paymentMethod: 'UPI Verified',
    paymentTransactionId: 'TXN_LL8193B',
    status: 'confirmed',
    bookingDate: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    _id: '65f1c0000000000000000003',
    bookingRef: 'IMV-2026-M4412',
    user: '65f1a0000000000000000001',
    movie: '65f1b0000000000000000001',
    cinema: 'iMovies Lincoln Square IMAX',
    city: 'New York',
    country: 'US',
    currency: 'USD',
    seats: ['E4', 'E5'],
    seatTier: 'VIP Recliner',
    totalPrice: 44,
    showDate: today,
    showTime: '06:30 PM',
    customer: {
      name: 'Admin Manager',
      email: 'admin@imovies.com',
      phone: '+1 212 555 0199'
    },
    paymentStatus: 'paid',
    paymentMethod: 'Corporate Card',
    paymentTransactionId: 'TXN_ADM4412C',
    status: 'confirmed',
    bookingDate: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const INITIAL_REVIEWS = [
  {
    _id: '65f1d0000000000000000001',
    movie: '65f1b0000000000000000001',
    user: '65f1a0000000000000000002',
    username: 'Eshani Jain',
    rating: 5,
    comment: 'A monumental cinematic triumph! The scale, Hans Zimmer score, and IMAX visuals were utterly mesmerizing from start to finish.',
    isVerifiedBooking: true,
    likes: 24,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: '65f1d0000000000000000002',
    movie: '65f1b0000000000000000001',
    user: '65f1a0000000000000000003',
    username: 'Sarah Jenkins',
    rating: 5,
    comment: 'Austin Butler and Timothée Chalamet delivered career-defining performances. Best sci-fi experience in a theater since Interstellar!',
    isVerifiedBooking: true,
    likes: 18,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: '65f1d0000000000000000003',
    movie: '65f1b0000000000000000001',
    user: '65f1a0000000000000000004',
    username: 'Marcus Vance',
    rating: 4,
    comment: 'Incredible worldbuilding and stunning desert cinematography. The pacing slows down slightly in the second act, but the finale is electrifying.',
    isVerifiedBooking: true,
    likes: 9,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    _id: '65f1d0000000000000000004',
    movie: '65f1b0000000000000000021',
    user: '65f1a0000000000000000002',
    username: 'Eshani Jain',
    rating: 5,
    comment: 'Heartwarming, hilariously witty, and deeply moving. Kiran Rao has created a modern gem of Indian cinema that everyone must watch!',
    isVerifiedBooking: true,
    likes: 31,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

class InMemoryStore {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.movies = INITIAL_MOVIES.map((m) => ({ votes: m.votes || Math.floor((m.rating || 8.2) * 11500 + 4500), ...m }));
    this.cinemas = [...INITIAL_CINEMAS];
    this.bookings = [...INITIAL_BOOKINGS];
    this.reviews = [...INITIAL_REVIEWS];
    // Map of seat holds: key = `${movieId}_${showDate}_${showTime}_${seat}` => { holdId, userId, expiresAt }
    this.seatHolds = new Map();
    this.idCounter = 1000;
  }

  generateId() {
    this.idCounter += 1;
    return `65f1${this.idCounter.toString(16).padStart(20, '0')}`;
  }

  // Users
  findUserByEmail(email) {
    if (!email) return null;
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id || String(u._id) === String(id)) || null;
  }

  createUser(userData) {
    const user = {
      _id: this.generateId(),
      username: userData.username,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'user',
      preferredCountry: userData.preferredCountry || 'US',
      preferredCity: userData.preferredCity || 'New York',
      resetPasswordToken: null,
      resetPasswordExpires: null,
      favorites: [],
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  }

  findUserByResetToken(token) {
    if (!token) return null;
    const now = new Date();
    return (
      this.users.find(
        (u) =>
          u.resetPasswordToken === token &&
          u.resetPasswordExpires &&
          new Date(u.resetPasswordExpires) > now
      ) || null
    );
  }

  setResetToken(email, token, expiresAt) {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiresAt;
    return user;
  }

  resetPasswordWithToken(token, newHashedPassword) {
    const user = this.findUserByResetToken(token);
    if (!user) return null;
    user.password = newHashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    return user;
  }

  toggleFavorite(userId, movieId) {
    const user = this.findUserById(userId);
    if (!user) return [];
    if (!Array.isArray(user.favorites)) user.favorites = [];
    const index = user.favorites.indexOf(movieId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(movieId);
    }
    return user.favorites;
  }

  // Cinemas: Enhanced with smart city matching, aliases, and auto-provisioning
  getCinemas(country, city, state) {
    let list = [...this.cinemas];

    const cleanCountry = country ? country.toUpperCase().trim() : '';
    const cleanCity = city && city !== 'All' ? city.trim() : '';

    if (cleanCountry) {
      list = list.filter((c) => c.country.toUpperCase() === cleanCountry);
    }

    if (cleanCity) {
      const norm = (str) => (str ? String(str).toLowerCase().replace(/[^a-z0-9]/g, '') : '');
      const targetNorm = norm(cleanCity);

      let matched = list.filter((c) => {
        const cCityNorm = norm(c.city);
        if (cCityNorm === targetNorm) return true;
        if (cCityNorm.includes(targetNorm) || targetNorm.includes(cCityNorm)) return true;
        // Known city aliases
        if ((targetNorm === 'delhi' && cCityNorm === 'newdelhi') || (targetNorm === 'newdelhi' && cCityNorm === 'delhi')) return true;
        if ((targetNorm === 'bengaluru' && cCityNorm === 'bangalore') || (targetNorm === 'bangalore' && cCityNorm === 'bengaluru')) return true;
        if ((targetNorm === 'gurugram' && cCityNorm === 'gurgaon') || (targetNorm === 'gurgaon' && cCityNorm === 'gurugram')) return true;
        if ((targetNorm === 'mumbai' && cCityNorm === 'bombay') || (targetNorm === 'bombay' && cCityNorm === 'mumbai')) return true;
        if ((targetNorm === 'kolkata' && cCityNorm === 'calcutta') || (targetNorm === 'calcutta' && cCityNorm === 'kolkata')) return true;
        if ((targetNorm === 'chennai' && cCityNorm === 'madras') || (targetNorm === 'madras' && cCityNorm === 'chennai')) return true;
        return false;
      });

      // If no cinema exists for this specific city, dynamically generate and register premiere auditoriums
      if (matched.length === 0) {
        matched = this.generateCinemasForCity(cleanCountry || 'IN', cleanCity, state);
      }

      list = matched;
    }

    return list;
  }

  generateCinemasForCity(countryCode, cityName, stateName) {
    const code = (countryCode || 'IN').toUpperCase();
    const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 10);

    const countryMeta = {
      IN: {
        name: 'India', cur: 'INR', sym: '₹', p1: 380, p2: 320, p3: 450,
        c1: `PVR INOX Director's Cut ${cityName} IMAX Laser`,
        c2: `PVR ICON Megaplex ${cityName} Galleria`,
        c3: `Cinepolis VIP Luxury Recliners ${cityName}`,
        c4: `MovieMax Executive Suites ${cityName} Central`,
        ad1: `Phoenix Marketcity Mall, Level 3, ${cityName}`,
        ad2: `Inorbit Galleria, High Street, ${cityName}`,
        ad3: `City Centre Mall, Ring Road, ${cityName}`,
        ad4: `Celebration Mall, Station Road, ${cityName}`
      },
      US: {
        name: 'United States', cur: 'USD', sym: '$', p1: 22, p2: 19, p3: 25,
        c1: `AMC Theatres ${cityName} 16 IMAX Laser & Dolby`,
        c2: `Regal Cinemas ${cityName} 4DX & ScreenX`,
        c3: `Cinemark ${cityName} Century XD & Luxury Loungers`,
        c4: `Alamo Drafthouse Cinema ${cityName} Downtown`,
        ad1: `100 Commercial Promenade, Downtown ${cityName}`,
        ad2: `Fashion Valley Plaza, Suite 400, ${cityName}`,
        ad3: `Grand Central Boulevard, West ${cityName}`,
        ad4: `Main Street Arts District, ${cityName}`
      },
      GB: {
        name: 'United Kingdom', cur: 'GBP', sym: '£', p1: 18, p2: 15, p3: 22,
        c1: `ODEON Luxe ${cityName} IMAX Laser & Bar`,
        c2: `Vue Cinemas ${cityName} Dolby Atmos VIP`,
        c3: `Cineworld ${cityName} Superscreen & 4DX`,
        c4: `Everyman Cinema ${cityName} Luxury Sofa Suites`,
        ad1: `High Street Galleria, City Centre, ${cityName}`,
        ad2: `Westgate Shopping Center, ${cityName}`,
        ad3: `Victoria Square, Commercial Way, ${cityName}`,
        ad4: `Canal Wharf Arts Quarter, ${cityName}`
      },
      CA: {
        name: 'Canada', cur: 'CAD', sym: 'CA$', p1: 20, p2: 17, p3: 24,
        c1: `Cineplex Scotiabank Theatre ${cityName} IMAX`,
        c2: `Cineplex VIP Cinemas ${cityName} Adults-Only`,
        c3: `Landmark Cinemas ${cityName} Laser Ultra`,
        c4: `Cineplex Odeon ${cityName} UltraAVX & D-BOX`,
        ad1: `Metropolis Shopping Centre, ${cityName}`,
        ad2: `Downtown Entertainment Quarter, ${cityName}`,
        ad3: `Gateway Lifestyle Center, ${cityName}`,
        ad4: `Lakeside Promenade, ${cityName}`
      },
      AU: {
        name: 'Australia', cur: 'AUD', sym: 'A$', p1: 26, p2: 22, p3: 30,
        c1: `Event Cinemas ${cityName} IMAX Laser & Vmax`,
        c2: `Hoyts Cinemas ${cityName} Xtremescreen & D-BOX`,
        c3: `Village Cinemas ${cityName} Gold Class Luxury`,
        c4: `Palace Cinemas ${cityName} Platinum Suites`,
        ad1: `Westfield Shopping Centre, Level 4, ${cityName}`,
        ad2: `Broadway Promenade, Central ${cityName}`,
        ad3: `Harbourview Complex, ${cityName}`,
        ad4: `Cultural Precinct, South ${cityName}`
      },
      JP: {
        name: 'Japan', cur: 'JPY', sym: '¥', p1: 2200, p2: 1900, p3: 2600,
        c1: `TOHO Cinemas ${cityName} IMAX Laser 4K`,
        c2: `Grand Cinema Sunshine ${cityName} IMAX Laser GT`,
        c3: `109 Cinemas Premium ${cityName} SAION Sound`,
        c4: `Aeon Cinema ${cityName} Theatus Dolby Atmos`,
        ad1: `Roppongi Hills Complex, ${cityName}`,
        ad2: `Sunshine City Square, ${cityName}`,
        ad3: `Shinjuku East Gate Boulevard, ${cityName}`,
        ad4: `Station Plaza Tower, ${cityName}`
      },
      SG: {
        name: 'Singapore', cur: 'SGD', sym: 'S$', p1: 19, p2: 16, p3: 22,
        c1: `Shaw Theatres Lido ${cityName} IMAX Laser 4K`,
        c2: `Golden Village Suntec City ${cityName} Gold Class`,
        c3: `Cathay Cineplexes ${cityName} Platinum Movie Suites`,
        c4: `The Projector ${cityName} Grand Laser Hall`,
        ad1: `350 Orchard Road, Shaw House, Singapore`,
        ad2: `3 Temasek Blvd, Suntec City, Singapore`,
        ad3: `50 Jurong Gateway Rd, Jem, Singapore`,
        ad4: `6001 Beach Rd, Golden Mile Tower, Singapore`
      },
      AE: {
        name: 'United Arab Emirates', cur: 'AED', sym: 'AED ', p1: 75, p2: 60, p3: 90,
        c1: `VOX Cinemas ${cityName} IMAX Laser Sapphire`,
        c2: `Reel Cinemas ${cityName} Platinum Luxury Suites`,
        c3: `Roxy Cinemas ${cityName} Diamond Plus Lounge`,
        c4: `Novo Cinemas ${cityName} 7-Star VIP`,
        ad1: `Mall of the Emirates, Level 2, ${cityName}`,
        ad2: `The Dubai Mall, Downtown ${cityName}`,
        ad3: `Dubai Hills Mall, Boulevard, ${cityName}`,
        ad4: `IMG Worlds Boulevard, ${cityName}`
      },
      DE: {
        name: 'Germany', cur: 'EUR', sym: '€', p1: 17, p2: 14, p3: 20,
        c1: `CineStar IMAX ${cityName} Laser Palace`,
        c2: `UCI Luxe ${cityName} iSense & Recliners`,
        c3: `Zoo Palast ${cityName} Club Kino & Dolby Atmos`,
        c4: `Mathäser Filmpalast ${cityName} Dolby Cinema`,
        ad1: `Potsdamer Platz 4, ${cityName}`,
        ad2: `Mercedes Platz 1, ${cityName}`,
        ad3: `Hardenbergstraße 29a, ${cityName}`,
        ad4: `Bayerstraße 3-5, ${cityName}`
      }
    };

    const meta = countryMeta[code] || {
      name: countryCode, cur: 'USD', sym: '$', p1: 19, p2: 16, p3: 22,
      c1: `Premier IMAX Laser ${cityName} Central`,
      c2: `Dolby Cinema ${cityName} Grand`,
      c3: `VIP Luxury Recliners ${cityName}`,
      c4: `Cineplex ${cityName} Square`,
      ad1: `City Grand Center, ${cityName}`,
      ad2: `Downtown High Street, ${cityName}`,
      ad3: `Fashion Boulevard, ${cityName}`,
      ad4: `West Mall Promenade, ${cityName}`
    };

    const c1 = {
      _id: `cin_${code.toLowerCase()}_${citySlug}_01`,
      name: meta.c1,
      chain: 'iMovies VIP',
      country: code,
      countryName: meta.name,
      state: stateName || '',
      city: cityName,
      address: meta.ad1,
      screens: 12,
      formats: ['IMAX Laser 4K', 'Dolby Atmos', '4DX Motion', 'VIP Recliners'],
      currency: meta.cur,
      currencySymbol: meta.sym,
      basePrice: meta.p1,
      amenities: ['180° Motorized Recliners', 'Gourmet In-Seat Dining', 'Dolby Atmos 12-Channel', 'Valet Parking'],
      rating: 4.9
    };

    const c2 = {
      _id: `cin_${code.toLowerCase()}_${citySlug}_02`,
      name: meta.c2,
      chain: 'iMovies VIP',
      country: code,
      countryName: meta.name,
      state: stateName || '',
      city: cityName,
      address: meta.ad2,
      screens: 10,
      formats: ['INSIGNIA VIP', 'ScreenX 270°', 'Dolby Cinema', 'VIP Recliners'],
      currency: meta.cur,
      currencySymbol: meta.sym,
      basePrice: meta.p2,
      amenities: ['Plush Leather Loungers', 'Chef-Crafted Artisan Menu', 'Butler on Call', 'Laser 4K Projection'],
      rating: 4.8
    };

    const c3 = {
      _id: `cin_${code.toLowerCase()}_${citySlug}_03`,
      name: meta.c3,
      chain: 'iMovies VIP',
      country: code,
      countryName: meta.name,
      state: stateName || '',
      city: cityName,
      address: meta.ad3,
      screens: 8,
      formats: ['VIP Luxury Club', 'Dolby Atmos', 'RealD 3D', 'Macro XE'],
      currency: meta.cur,
      currencySymbol: meta.sym,
      basePrice: meta.p3 || meta.p1,
      amenities: ['Electric Recliners', 'VIP Coffee Bar', 'Personal Headsets', 'Dolby Surround'],
      rating: 4.9
    };

    const c4 = {
      _id: `cin_${code.toLowerCase()}_${citySlug}_04`,
      name: meta.c4,
      chain: 'iMovies VIP',
      country: code,
      countryName: meta.name,
      state: stateName || '',
      city: cityName,
      address: meta.ad4,
      screens: 6,
      formats: ['Laser 4K', 'Dolby 7.1', 'Executive Recliner Suites'],
      currency: meta.cur,
      currencySymbol: meta.sym,
      basePrice: Math.round(meta.p2 * 0.9),
      amenities: ['Curved Silver Screen', 'Gourmet Popcorn Bar', 'Quick Pass Entry'],
      rating: 4.7
    };

    // Register into memory store so showtimes & booking queries locate them
    this.cinemas.push(c1, c2, c3, c4);

    return [c1, c2, c3, c4];
  }

  getCinemaById(id) {
    return this.cinemas.find((c) => c._id === id || String(c._id) === String(id)) || null;
  }

  // Movies: Enhanced with Industry filter, Genre sorting, and Minimum Rating filter
  getMovies(search, genre, category, country, language, industry, sortBy, minRating) {
    let list = [...this.movies];

    if (search) {
      const s = search.toLowerCase().trim();
      const sClean = s.replace(/[^a-z0-9]/g, '');
      const sDeVowel = s.replace(/aa+/g, 'a').replace(/ee+/g, 'e').replace(/oo+/g, 'o');

      list = list.filter((m) => {
        const titleLower = m.title.toLowerCase();
        const titleClean = titleLower.replace(/[^a-z0-9]/g, '');
        const titleDeVowel = titleLower.replace(/aa+/g, 'a').replace(/ee+/g, 'e').replace(/oo+/g, 'o');

        const titleMatch =
          titleLower.includes(s) ||
          (sClean.length > 2 && titleClean.includes(sClean)) ||
          (sDeVowel.length > 2 && titleDeVowel.includes(sDeVowel));

        const aliasMatch =
          Array.isArray(m.aliases) &&
          m.aliases.some((a) => {
            const aLower = a.toLowerCase();
            const aClean = aLower.replace(/[^a-z0-9]/g, '');
            const aDeVowel = aLower.replace(/aa+/g, 'a').replace(/ee+/g, 'e').replace(/oo+/g, 'o');
            return (
              aLower.includes(s) ||
              (sClean.length > 2 && aClean.includes(sClean)) ||
              (sDeVowel.length > 2 && aDeVowel.includes(sDeVowel))
            );
          });

        const descMatch = m.description && m.description.toLowerCase().includes(s);
        const directorMatch = m.director && m.director.toLowerCase().includes(s);
        const castMatch = Array.isArray(m.cast) && m.cast.some((c) => c.name.toLowerCase().includes(s));
        const genreMatch = Array.isArray(m.genre) && m.genre.some((g) => g.toLowerCase().includes(s));

        return titleMatch || aliasMatch || descMatch || directorMatch || castMatch || genreMatch;
      });
    }

    if (industry && industry !== 'All') {
      list = list.filter((m) => m.industry && m.industry.toLowerCase() === industry.toLowerCase());
    }

    if (genre && genre !== 'All') {
      list = list.filter((m) => Array.isArray(m.genre) && m.genre.includes(genre));
    }

    if (minRating && Number(minRating) > 0) {
      list = list.filter((m) => Number(m.rating || 0) >= Number(minRating));
    }

    if (category && category !== 'all') {
      if (category === 'past') {
        list = list.filter((m) => {
          const relYear = m.releaseDate ? new Date(m.releaseDate).getFullYear() : 2020;
          return m.category === 'past' || m.category === 'popular' || relYear < 2024;
        });
      } else {
        list = list.filter((m) => m.category === category);
      }
    }

    if (language && language !== 'All') {
      list = list.filter((m) => m.language && m.language.toLowerCase() === language.toLowerCase());
    }

    if (country) {
      list = list.filter((m) => !m.countryAvailability || m.countryAvailability.includes(country.toUpperCase()));
    }

    // Sorting logic
    if (sortBy === 'upcoming_first') {
      list.sort((a, b) => {
        const isUpA = a.category === 'upcoming' ? 1 : 0;
        const isUpB = b.category === 'upcoming' ? 1 : 0;
        if (isUpA !== isUpB) return isUpB - isUpA;
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      });
    } else if (sortBy === 'past_first') {
      list.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    } else if (sortBy === 'releaseDate') {
      list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortBy === 'genre') {
      // Sort alphabetically by the primary genre
      list.sort((a, b) => {
        const genreA = (a.genre && a.genre[0]) || '';
        const genreB = (b.genre && b.genre[0]) || '';
        return genreA.localeCompare(genreB) || a.title.localeCompare(b.title);
      });
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration') {
      list.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0));
    }

    return list;
  }

  getMovieById(id) {
    return (
      this.movies.find(
        (m) =>
          m._id === id ||
          String(m._id) === String(id) ||
          (m.tmdbId && String(m.tmdbId) === String(id))
      ) || null
    );
  }

  createMovie(movieData) {
    const movie = {
      _id: this.generateId(),
      title: movieData.title,
      aliases: Array.isArray(movieData.aliases) ? movieData.aliases : [],
      industry: movieData.industry || 'Hollywood',
      description: movieData.description || '',
      genre: Array.isArray(movieData.genre)
        ? movieData.genre
        : movieData.genre
        ? movieData.genre.split(',').map((g) => g.trim())
        : ['Action'],
      duration: Number(movieData.duration) || 120,
      posterUrl: movieData.posterUrl || '',
      backdropUrl: movieData.backdropUrl || '',
      trailerKey: movieData.trailerKey || '',
      releaseDate: movieData.releaseDate ? new Date(movieData.releaseDate).toISOString() : new Date().toISOString(),
      ticketPrice: Number(movieData.ticketPrice) || 250,
      theater: movieData.theater || 'iMovies IMAX Laser - Screen 1',
      rating: Number(movieData.rating) || 8.5,
      votes: Number(movieData.votes) || 12500,
      language: movieData.language || 'English',
      director: movieData.director || '',
      cast: Array.isArray(movieData.cast) ? movieData.cast : [],
      category: movieData.category || 'now_playing',
      showtimes:
        Array.isArray(movieData.showtimes) && movieData.showtimes.length > 0
          ? movieData.showtimes
          : ['10:30 AM', '02:00 PM', '06:30 PM', '09:45 PM'],
      countryAvailability: movieData.countryAvailability || ['US', 'GB', 'IN', 'CA', 'AU', 'DE', 'JP', 'SG', 'AE'],
      createdAt: new Date().toISOString()
    };
    this.movies.unshift(movie);
    return movie;
  }

  // Temporary Seat Holds (Concurrency Protection)
  cleanExpiredHolds() {
    const now = Date.now();
    for (const [key, hold] of this.seatHolds.entries()) {
      if (hold.expiresAt <= now) {
        this.seatHolds.delete(key);
      }
    }
  }

  holdSeats({ userId, movieId, showDate, showTime, seats }) {
    this.cleanExpiredHolds();
    const occupied = this.getOccupiedSeats(movieId, showDate, showTime, userId);
    const conflicts = seats.filter((s) => occupied.includes(s));
    if (conflicts.length > 0) {
      throw new Error(`Seat(s) ${conflicts.join(', ')} are currently reserved or locked by another patron.`);
    }

    const holdId = `HOLD_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = Date.now() + 8 * 60 * 1000; // 8 minutes TTL

    seats.forEach((seat) => {
      const key = `${movieId}_${showDate}_${showTime}_${seat}`;
      this.seatHolds.set(key, { holdId, userId, expiresAt, seat });
    });

    return { holdId, expiresAt, seats };
  }

  releaseHold({ holdId, userId }) {
    for (const [key, hold] of this.seatHolds.entries()) {
      if (hold.holdId === holdId && (!userId || hold.userId === userId)) {
        this.seatHolds.delete(key);
      }
    }
  }

  // Bookings
  getOccupiedSeats(movieId, showDate, showTime, excludeUserId = null) {
    this.cleanExpiredHolds();

    // Confirmed bookings (excluding cancelled ones)
    const matching = this.bookings.filter(
      (b) =>
        (b.movie === movieId || String(b.movie) === String(movieId)) &&
        b.showDate === showDate &&
        b.showTime === showTime &&
        b.status !== 'cancelled'
    );
    const confirmedSeats = matching.flatMap((b) => b.seats);

    // Active holds from other users
    const heldSeats = [];
    const prefix = `${movieId}_${showDate}_${showTime}_`;
    for (const [key, hold] of this.seatHolds.entries()) {
      if (key.startsWith(prefix)) {
        if (!excludeUserId || hold.userId !== excludeUserId) {
          heldSeats.push(hold.seat);
        }
      }
    }

    return [...new Set([...confirmedSeats, ...heldSeats])];
  }

  createBooking({
    userId,
    movie,
    seats,
    totalPrice,
    showDate,
    showTime,
    cinema,
    city,
    country,
    currency,
    seatTier,
    customer,
    paymentMethod
  }) {
    // Release any temporary holds for this user on these seats
    seats.forEach((seat) => {
      const key = `${movie}_${showDate}_${showTime}_${seat}`;
      this.seatHolds.delete(key);
    });

    const booking = {
      _id: this.generateId(),
      bookingRef: `IMV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      user: userId,
      movie,
      cinema: cinema || 'iMovies IMAX Laser - Screen 1',
      city: city || 'New York',
      country: country || 'US',
      currency: currency || 'USD',
      seatTier: seatTier || 'VIP Recliner',
      seats,
      totalPrice,
      showDate,
      showTime,
      customer: customer || { name: 'VIP Guest', email: 'guest@imovies.com' },
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'Test Payment Gateway (Verified)',
      paymentTransactionId: `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    this.bookings.push(booking);
    return booking;
  }

  cancelBooking(bookingId, userId) {
    const booking = this.bookings.find(
      (b) =>
        (b._id === bookingId || String(b._id) === String(bookingId)) &&
        (b.user === userId || String(b.user) === String(userId))
    );
    if (!booking) {
      throw new Error('Booking not found or not authorized to cancel');
    }
    if (booking.status === 'cancelled') {
      throw new Error('This reservation is already cancelled');
    }
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    return booking;
  }

  getUserBookings(userId) {
    const userBookings = this.bookings
      .filter((b) => b.user === userId || String(b.user) === String(userId))
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    return userBookings.map((b) => {
      const movieDoc = this.getMovieById(b.movie) || {};
      const userDoc = this.findUserById(b.user) || {};
      return {
        ...b,
        movie: movieDoc,
        user: {
          _id: userDoc._id,
          username: userDoc.username,
          email: userDoc.email
        }
      };
    });
  }

  // ----------------------------------------------------
  // Reviews & Verified Booking Checks
  // ----------------------------------------------------
  hasUserBookedMovie(userId, movieId) {
    if (!userId || !movieId) return false;
    const uStr = String(userId);
    const mStr = String(movieId);
    return this.bookings.some(
      (b) =>
        (b.user === userId || String(b.user) === uStr) &&
        (b.movie === movieId || String(b.movie) === mStr) &&
        b.status !== 'cancelled'
    );
  }

  getMovieReviews(movieId, currentUserId = null) {
    const mStr = String(movieId);
    const movieReviews = this.reviews
      .filter((r) => r.movie === movieId || String(r.movie) === mStr)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = movieReviews.length;
    const sum = movieReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const averageRating = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    movieReviews.forEach((r) => {
      const star = Math.round(Number(r.rating));
      if (distribution[star] !== undefined) {
        distribution[star] += 1;
      }
    });

    const userReview = currentUserId
      ? movieReviews.find((r) => r.user === currentUserId || String(r.user) === String(currentUserId)) || null
      : null;

    const hasBooked = currentUserId ? this.hasUserBookedMovie(currentUserId, movieId) : false;

    return {
      reviews: movieReviews,
      stats: {
        totalReviews: total,
        averageRating,
        ratingDistribution: distribution
      },
      hasBooked,
      userReview,
      canReview: hasBooked
    };
  }

  addOrUpdateReview({ userId, movieId, rating, comment, username }) {
    if (!userId || !movieId) {
      throw new Error('User ID and Movie ID are required');
    }
    const hasBooked = this.hasUserBookedMovie(userId, movieId);
    if (!hasBooked) {
      throw new Error('Only viewers who have previously booked this movie can submit a review.');
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      throw new Error('Rating must be between 1 and 5 stars');
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
      throw new Error('Please provide a short comment (at least 3 characters)');
    }

    const uStr = String(userId);
    const mStr = String(movieId);
    const existingIndex = this.reviews.findIndex(
      (r) =>
        (r.user === userId || String(r.user) === uStr) &&
        (r.movie === movieId || String(r.movie) === mStr)
    );

    const now = new Date().toISOString();
    let savedReview;

    if (existingIndex >= 0) {
      this.reviews[existingIndex].rating = numRating;
      this.reviews[existingIndex].comment = comment.trim();
      this.reviews[existingIndex].updatedAt = now;
      if (username) this.reviews[existingIndex].username = username;
      savedReview = this.reviews[existingIndex];
    } else {
      savedReview = {
        _id: this.generateId(),
        movie: movieId,
        user: userId,
        username: username || 'Verified Guest',
        rating: numRating,
        comment: comment.trim(),
        isVerifiedBooking: true,
        likes: 0,
        createdAt: now,
        updatedAt: now
      };
      this.reviews.unshift(savedReview);
    }

    return savedReview;
  }

  deleteReview(userId, movieId) {
    const uStr = String(userId);
    const mStr = String(movieId);
    const initialLen = this.reviews.length;
    this.reviews = this.reviews.filter(
      (r) =>
        !((r.user === userId || String(r.user) === uStr) &&
          (r.movie === movieId || String(r.movie) === mStr))
    );
    return this.reviews.length < initialLen;
  }

  likeReview(reviewId) {
    const review = this.reviews.find((r) => r._id === reviewId || String(r._id) === String(reviewId));
    if (review) {
      review.likes = (review.likes || 0) + 1;
      return review.likes;
    }
    return 0;
  }
}

const inMemoryStore = new InMemoryStore();
module.exports = inMemoryStore;

