# 🎬 iMovies — Streamlined Movie Ticket Booking Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Security_Tests-6%2F6_Passing-brightgreen)](#testing--security)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack, enterprise-grade movie discovery and ticket booking web application built with **React 18, Vite, Node.js, Express, and MongoDB**. Features real-time seat reservation, dynamic city/cinema selection, trailer popups, review system, interactive checkout, and seamless offline in-memory data fallback.

---

## ✨ Features

- 🎟️ **Interactive Seat Selection:** Real-time visual seat layout with VIP, Premium, and Standard tiers, live occupied seat calculation, and sub-second locking.
- 🌍 **Global City & Cinema Locator:** Select locations across major metropolitan hubs with cinema finder and nearby theater distances.
- 🎥 **Rich Movie Showcase:** 80+ curated titles with posters, genre tags, trailer modals, cast details, ratings, and runtime info.
- 🛡️ **Atomic Reservation & Concurrency Safety:** Unique compound database indexing prevents double-booking race conditions (returns HTTP 409 on conflict).
- 🔐 **Secure Authentication:** JWT token authentication, bcrypt password hashing, privilege-escalation defense (no client-controlled admin roles), and protected routes.
- 💰 **Server-Enforced Pricing:** Total booking prices are verified and calculated server-side from authoritative movie ticket prices.
- 💾 **Seamless In-Memory Fallback:** The application operates smoothly even when MongoDB is offline, using an embedded in-memory datastore with pre-seeded listings.
- 🖼️ **Smart Poster Proxy & Caching:** High-speed in-memory poster caching with remote fallback and Wikimedia rate-limit mitigation.
- 📱 **Responsive Modern UI:** Crafted with a warm cream/crimson cinema aesthetic, smooth animations, and mobile-friendly design.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router DOM 7
- **Styling:** Tailwind CSS 3 & PostCSS
- **Icons:** Lucide React
- **HTTP Client:** Axios (with automatic token interceptor and retry logic)

### Backend
- **Runtime:** Node.js (v18+)
- **Server:** Express 4
- **Database:** MongoDB with Mongoose 8
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Fallback Data:** Embedded in-memory store with 80+ movies and multi-city cinema listings

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- *(Optional)* **MongoDB** (A local or Atlas MongoDB connection, or run in offline fallback mode)

### 2. Clone the Repository
```bash
git clone https://github.com/tanishqpardeshi/I-MOVIES-.git
cd I-MOVIES-
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` (optional for local development, as safe defaults are pre-configured):
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port for the unified server | `3000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | Safe fallback provided |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/imovies` |
| `SEED_ADMIN_PASSWORD` | Password for seeding admin account | `AdminSecurePass123!` |
| `SEED_USER_PASSWORD` | Password for seeding user account | `UserSecurePass123!` |
| `SEED_ALLOW_DESTRUCTIVE` | Guard for running destructive database seed | `false` |

### 5. Run the Application
Start the unified full-stack development server:
```bash
npm run dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 📦 Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Runs the unified Express server with Vite middleware in development mode |
| `npm run build` | Builds the optimized production frontend bundle to `client/dist` |
| `npm start` | Starts the production server (serves pre-built static client assets) |
| `npm run lint` | Syntax checks `server.js` and `server/server.js` |
| `npm test` | Runs the automated Node.js security & regression test suite |
| `npm --prefix server run seed` | Seeds MongoDB with initial demo data (requires dev flags) |

---

## 🧪 Testing & Security

The repository contains an automated security test suite under `server/test/security.test.js`:
- ✅ **Privilege Escalation Protection:** Public registration strictly assigns the `user` role, discarding any user-supplied `admin` role.
- ✅ **Server-Side Price Calculation:** Prevents client-supplied ticket amounts from tampering with billing.
- ✅ **Atomic Seat Reservation:** Verifies MongoDB compound index `(movie, showDate, showTime, seats)` uniqueness.
- ✅ **Concurrency Conflict Handling:** Concurrent booking collisions return HTTP 409 Conflict.
- ✅ **Date Validation:** Invalid calendar dates (e.g. `2026-02-31`) are rejected with HTTP 400.
- ✅ **Occupied-Seat Filter Validation:** Screening date and showtime are mandatory to prevent cross-screening seat contamination.

To execute tests:
```bash
npm test
```

---

## 🌐 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Healthcheck and timestamp | No |
| `GET` | `/api/movies` | Get all movies (supports genre/city/query filters) | No |
| `GET` | `/api/movies/:id` | Get single movie by ID with showtimes | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (`Bearer <token>`) |
| `GET` | `/api/cinemas` | List all partner cinemas and locations | No |
| `GET` | `/api/bookings/occupied` | Get reserved seats for a given movie, date, and showtime | No |
| `POST` | `/api/bookings` | Book seats with atomic server validation | Yes (`Bearer <token>`) |
| `GET` | `/api/bookings/my` | View all user bookings & digital passes | Yes (`Bearer <token>`) |
| `GET` | `/api/images/proxy` | High-speed cached image proxy with rate-limit protection | No |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
