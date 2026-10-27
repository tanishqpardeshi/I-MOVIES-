---
phase: full-directory-review
reviewed: 2026-10-16T15:15:17Z
depth: deep
files_reviewed: 31
files_reviewed_list:
  - client/package.json
  - client/postcss.config.js
  - client/tailwind.config.js
  - client/vite.config.js
  - client/src/App.jsx
  - client/src/index.css
  - client/src/main.jsx
  - client/src/components/MovieCard.jsx
  - client/src/components/Navbar.jsx
  - client/src/components/ProtectedRoute.jsx
  - client/src/context/AuthContext.jsx
  - client/src/pages/Bookings.jsx
  - client/src/pages/Home.jsx
  - client/src/pages/Login.jsx
  - client/src/pages/MovieDetails.jsx
  - client/src/pages/Register.jsx
  - client/src/services/api.js
  - server/package.json
  - server/seed.js
  - server/server.js
  - server/config/db.js
  - server/controllers/authController.js
  - server/controllers/bookingController.js
  - server/controllers/movieController.js
  - server/middleware/authMiddleware.js
  - server/models/Booking.js
  - server/models/Movie.js
  - server/models/User.js
  - server/routes/authRoutes.js
  - server/routes/bookingRoutes.js
  - server/routes/movieRoutes.js
findings:
  critical: 5
  warning: 4
  info: 0
  total: 9
status: issues_found
---

# Full Directory: Code Review Report

**Reviewed:** 2026-10-16T15:15:17Z
**Depth:** deep
**Files Reviewed:** 31
**Status:** issues_found

## Summary

Reviewed all 31 JavaScript, JSX, CSS, and package-manifest files under `IMovies`, tracing the registration, booking, database-startup, and seed flows. The client-side implementation and configuration files are empty, registration permits unauthenticated admin creation, booking prices are client-controlled, and seat checks are not atomic. The seed command also deletes all users, movies, and bookings. The server files were reviewed in full; the client files are zero-byte files except for an empty `{}` package manifest.

## Follow-up remediation

The findings in this review snapshot have since been addressed:

- **BL-01:** Added the Vite HTML entry point and populated the client; the production build now succeeds.
- **BL-02:** Public registration always creates a regular user.
- **BL-03:** Booking prices are calculated from the movie's server-side ticket price.
- **BL-04:** A unique MongoDB index now atomically reserves seats; duplicate-key conflicts return HTTP 409.
- **BL-05 / WR-03:** Seeding requires development mode, an explicit reset flag, destructive-operation confirmation, and non-default passwords from environment variables.
- **WR-01:** The server waits for MongoDB and the seat index before listening.
- **WR-02:** `.gitignore` excludes `.env`; `server/.env.example` documents local configuration.
- **WR-04:** Occupied-seat queries require a valid movie, date, and showtime.

Follow-up checks: frontend production build passed; six backend regression tests passed; the production dependency audit reported no vulnerabilities. A local MongoDB server was unavailable, so database integration and index creation against existing data were not exercised. The full dependency audit still reports development-tool advisories; its suggested fixes require major Tailwind/Vite upgrades.

## Critical Issues

### BL-01: Client application has no runnable implementation

**Severity:** BLOCKER
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\client\src\main.jsx:1` (empty); `client\package.json:1`
**Issue:** The client entry point and all client source/config files are zero bytes. `client/package.json` contains only `{}`, and there is no `index.html`. The frontend therefore has no application entry point, dependencies, scripts, or HTML document for Vite to serve; none of the advertised client flows can run.
**Fix:** Restore the frontend source and Vite entry document, and define the client dependencies and start/build scripts in `client/package.json`. At minimum, make `src/main.jsx` mount the app into a root element declared in `index.html`.

### BL-02: Public registration allows privilege escalation to admin

**Severity:** BLOCKER
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\controllers\authController.js:35`
**Issue:** `registerUser` accepts `role` from the unauthenticated request body and persists `admin` when the caller submits `role: "admin"`. Anyone can create an administrator account and use the protected admin movie-creation route.
**Fix:** Assign `role: 'user'` unconditionally during public registration. Provide a separate, authenticated and authorized admin-only mechanism for promoting users.

### BL-03: Booking amount is trusted from the caller

**Severity:** BLOCKER
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\controllers\bookingController.js:37-44`
**Issue:** The endpoint uses `totalPrice` from the request whenever it is truthy, then stores that amount without checking it against the movie's ticket price or selected seats. An authenticated customer can submit an arbitrary low or negative total and obtain a booking without paying the configured price.
**Fix:** Calculate the amount on the server from the trusted movie price and validated seat count. Do not accept a client-supplied total as authoritative; if retained for display, reject requests whose amount differs from the server calculation.

### BL-04: Seat availability check can be bypassed by concurrent bookings

**Severity:** BLOCKER
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\controllers\bookingController.js:22-46`
**Issue:** The controller checks for an existing booking and inserts a new booking in separate operations. Two simultaneous requests for the same movie, date, showtime, and seat can both pass the read and create bookings, selling the same seat twice. The schema has no uniqueness constraint that prevents this.
**Fix:** Make seat reservation atomic. Store one record per reserved seat with a unique compound key on movie, show date, showtime, and seat, and translate duplicate-key conflicts into a seat-unavailable response (or use an equivalent transactional reservation design).

### BL-05: Running the seed command unconditionally erases all application data

**Severity:** BLOCKER
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\seed.js:15-17`
**Issue:** The documented `seed` script deletes every booking, movie, and user before inserting demo data. Running it against a populated or production database permanently removes application data without a confirmation or environment guard.
**Fix:** Restrict seeding to an explicitly identified development/test database and refuse production-like database targets. Make destructive reset behavior opt-in (for example, a separate explicit reset flag) and do not delete existing collections during ordinary seeding.

## Warnings

### WR-01: HTTP server starts before the database connection is ready

**Severity:** WARNING
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\server.js:7,23`
**Issue:** `connectDB()` is invoked without awaiting its promise, and `app.listen()` runs immediately. The process can report that the server is running and accept requests before MongoDB is connected.
**Fix:** Start listening only after `await connectDB()` resolves, and report startup failure through the existing non-zero exit path.

### WR-02: Local environment secrets are not protected from accidental publication

**Severity:** WARNING
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\.env:1`; no `.gitignore` exists under the workspace
**Issue:** The app has a populated `server/.env` containing database and JWT settings, but no ignore file excludes it. The current workspace is not a Git repository, so there is no evidence these values have been committed; however, creating or publishing a repository from this tree could expose them.
**Fix:** Add ignore rules for `server/.env` and other local environment files before initializing or publishing the repository. Rotate the values if this file has ever been shared or committed.

### WR-03: Seeded administrator uses a publicly predictable password

**Severity:** WARNING
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\seed.js:20,138`
**Issue:** The seed creates an admin account with a fixed, guessable password and prints the credentials. If the seed data is used in a deployed environment, anyone who knows the code can authenticate as that administrator.
**Fix:** Keep demo accounts confined to local development. For any non-local seed, require a securely provided initial credential and avoid printing passwords.

### WR-04: Occupied-seat lookup may combine different dates or showtimes

**Severity:** WARNING
**File:** `C:\Users\Tanishq Pardeshi\OneDrive\Pictures\ドキュメント\New folder\i movies FSDB\IMovies\server\controllers\bookingController.js:76-86`
**Issue:** Only `movieId` is required; `showDate` and `showTime` are optional filters. When either is omitted, bookings from other dates or showtimes are included, so the returned seat list may incorrectly mark seats unavailable for the requested screening.
**Fix:** Require and validate `movieId`, `showDate`, and `showTime` for this screening-specific endpoint, or define explicit defaults that exactly match booking creation behavior.

---

_Reviewed: 2026-10-16T15:15:17Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: deep_
