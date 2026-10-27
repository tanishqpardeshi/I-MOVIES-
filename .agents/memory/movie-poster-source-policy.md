---
name: Movie poster source policy
description: Guidance for keeping the demo catalog's movie posters reliable without runtime image lookups.
---

For demo movies without reliable catalog poster data, keep a static set of verified poster overrides and a generic image fallback. Do not fetch poster metadata separately for each movie during page requests.

**Why:** Public image-summary lookups were rate-limited during bulk repair, and some titles had no reliable public poster. Repeating these lookups at runtime would add latency and create more missing-image failures.

**How to apply:** Validate new poster URLs before changing catalog data. Prefer the configured movie-data provider when available, retain the image-error fallback, and verify usage rights before publishing.
