const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

// High-speed in-memory buffer cache for instant high-DPI poster delivery
const imageCache = new Map();
const MAX_CACHE_SIZE = 200;

router.get('/proxy', (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('Missing url parameter');
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return res.status(400).send('Invalid url protocol');
  }

  // Fast-path in-memory cache hit
  if (imageCache.has(url)) {
    const cached = imageCache.get(url);
    res.setHeader('Content-Type', cached.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    return res.send(cached.buffer);
  }

  const client = url.startsWith('https') ? https : http;
  const options = {
    headers: {
      'User-Agent': 'iMoviesApp/1.0 (https://imovies.com; contact@imovies.com)',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    timeout: 8000
  };

  const request = client.get(url, options, (remoteRes) => {
    // Follow redirect if 301/302/307/308
    if ([301, 302, 307, 308].includes(remoteRes.statusCode)) {
      const redirectUrl = remoteRes.headers.location;
      if (redirectUrl) {
        return res.redirect(`/api/images/proxy?url=${encodeURIComponent(redirectUrl)}`);
      }
    }

    if (remoteRes.statusCode !== 200) {
      res.setHeader('Cache-Control', 'public, max-age=60');
      return res.redirect('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=90');
    }

    const contentType = remoteRes.headers['content-type'] || 'image/jpeg';
    const chunks = [];

    remoteRes.on('data', (chunk) => chunks.push(chunk));
    remoteRes.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (imageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = imageCache.keys().next().value;
        imageCache.delete(firstKey);
      }
      imageCache.set(url, { buffer, contentType });

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      res.send(buffer);
    });
  });

  request.on('error', (err) => {
    res.status(502).send('Error proxying image: ' + err.message);
  });
  request.on('timeout', () => {
    request.destroy();
    res.status(504).send('Image fetch timeout');
  });
});

module.exports = router;
