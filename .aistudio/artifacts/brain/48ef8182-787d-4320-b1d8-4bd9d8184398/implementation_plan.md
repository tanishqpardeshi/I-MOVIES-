# Implementation Plan: iMovies Worldwide Real-Time Movie Ticket Booking System

## Executive Overview
Upgraded the existing **iMovies** MERN-stack application into a worldwide, real-time movie ticket booking platform. The upgrade preserves the established codebase, design language, and database models while introducing global cinema discovery, localized pricing in 9 currencies, interactive seat maps with 8-minute reservation holds, TMDB movie integration, simulated test checkout, and digital boarding pass management with cancellation and refund support.

---

## Technical Audit & Architecture

### 1. Hollywood & Bollywood Movie Discovery
- **Comprehensive Dual-Industry Catalog (26 Total Titles)**:
  - **Hollywood Blockbusters (14)**: *Dune: Part Two*, *Oppenheimer*, *Spider-Man: Across the Spider-Verse*, *Deadpool & Wolverine*, *Gladiator II*, *Inside Out 2*, *Interstellar*, *The Batman*, *Wicked*, *Top Gun: Maverick*, *Avatar: The Way of Water*, *Inception*, *Barbie*, *Alien: Romulus*.
  - **Bollywood Hindi Cinema (12)**: *Jawan*, *Stree 2: Sarkate Ka Aatank*, *Kalki 2898 AD*, *Animal*, *Pathaan*, *12th Fail*, *Fighter*, *RRR*, *Bhool Bhulaiyaa 3*, *Dunki*, *Shaitaan*, *Brahmāstra: Part One – Shiva*.
  - Each movie is complete with high-resolution TMDB posters, 4K backdrop banners, cast carousels, directors, languages, release dates, durations, and official YouTube trailer keys.
- **Industry & Genre Filtering**:
  - Industry filter bar: **All Cinema (26)**, **Hollywood Blockbusters**, and **Bollywood Hindi Cinema**.
  - Multi-genre selector: Action, Sci-Fi, Drama, Comedy, Thriller, Horror, Romance, Animation, Adventure, Crime, Biography, Fantasy, Musical, Mystery.
  - Sorting options: **Sort by Genre (Grouped A–Z)**, Newest Releases, Highest Rated, Alphabetical (A–Z), and Duration.
  - Industry badges on each card ("Hollywood" in gold, "Bollywood" in emerald).

### 2. Worldwide Cinema Networks & Showtimes
- **Cinemas Model & Controller (`/server/models/Cinema.js`, `/server/controllers/cinemaController.js`)**:
  - 14 premiere cinema chains across 9 countries and global metropolitan hubs:
    - 🇺🇸 United States: New York (Lincoln Square IMAX, Times Square Dolby Palace), Los Angeles (Century City Premiere)
    - 🇬🇧 United Kingdom: London (Odeon Luxe Leicester Square, BFI IMAX Southbank)
    - 🇮🇳 India: Mumbai (PVR ICON Lower Parel, INOX Megaplex Malad), Delhi (Directors Cut Vasant Kunj)
    - 🇨🇦 Canada: Toronto (Scotiabank Theatre IMAX)
    - 🇦🇺 Australia: Sydney (IMAX Sydney Harbour)
    - 🇯🇵 Japan: Tokyo (TOHO Cinemas Roppongi Hills)
    - 🇸🇬 Singapore: (Shaw Theatres Lido IMAX)
    - 🇦🇪 United Arab Emirates: Dubai (Reel Cinemas Dubai Mall)
    - 🇩🇪 Germany: Berlin (Zoo Palast Berlin)
  - Details screen formats: IMAX Laser, Dolby Cinema, 4DX, ScreenX, VIP Recliners, and luxury amenities.
  - Localized ticket currency: USD (`$`), GBP (`£`), INR (`₹`), CAD (`CA$`), AUD (`A$`), EUR (`€`), JPY (`¥`), SGD (`S$`), AED (`AED`).

### 3. Ticket Booking & Concurrency Protection
- **Temporary Seat Locking with 8-minute TTL (`/api/bookings/hold`, `/api/bookings/release`)**:
  - Eliminates seat hoarding and prevents double-booking race conditions by locking seats atomically for 8 minutes during checkout.
  - If a guest abandons checkout or time expires, holds are automatically reclaimed.
- **Seat Map Auditorium**:
  - 64-seat auditorium (Rows A-E Standard Recliners, Rows F-H VIP Luxury Motorized Recliners).
  - Real-time occupied-seat query (`/api/bookings/occupied`) filtering both confirmed bookings and active user holds.
  - Server-side ticket price calculation strictly derived from movie and cinema pricing, rejecting client-submitted amounts.
- **Simulated Test Payment Gateway (`CheckoutModal.jsx`)**:
  - Step-by-step customer details confirmation, itemized fee breakdown, and promo voucher code (`VIP15` for 15% discount).
  - 1-click "Auto-Fill Test Card" (Visa `4242 •••• •••• 4242`) and Apple Pay / Google Pay simulated biometric auth.
  - Clearly labeled Sandbox Test Mode (zero actual charges).

### 4. Boarding Passes & Account Dashboard
- **Pass Verification & Cancellation (`/client/src/pages/Bookings.jsx`)**:
  - Authentic perforated VIP digital boarding pass with unique reference code (`IMV-2026-XXXXX`), QR code preview, cinema details, and seat tier.
  - Print Pass feature.
  - "Cancel Pass" button that releases reserved seats back to the public pool and issues a simulated refund.
- **Profile Page (`/client/src/pages/Profile.jsx`)**:
  - Displays user profile, booking history count, Diamond VIP tier status, and quick links.

---

## Verification & Test Results
- **Automated Security Test Suite (`server/test/security.test.js`)**: All 6 tests passing (100% pass rate).
- **Frontend Production Build**: `vite build client` completed in 5.52s.
- **Lint Check**: `npm run lint` passed with zero errors.
- **API Tests**: Verified Hollywood and Bollywood industry filtering, Comedy genre filtering (6 titles), and Genre sorting.
