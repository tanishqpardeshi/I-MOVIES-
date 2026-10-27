const assert = require('node:assert/strict');
const test = require('node:test');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { registerUser } = require('../controllers/authController');
const { createBooking, getOccupiedSeats } = require('../controllers/bookingController');

const createResponse = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

test('public registration never grants the requested admin role', async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret-with-at-least-thirty-two-characters';
  t.after(() => {
    if (previousSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = previousSecret;
    }
  });

  let createdUser;
  t.mock.method(User, 'findOne', async () => null);
  t.mock.method(User, 'create', async (user) => {
    createdUser = { ...user, _id: 'user-id' };
    return createdUser;
  });

  const res = createResponse();
  await registerUser({
    body: {
      username: 'New User',
      email: 'user@example.com',
      password: 'a-long-test-password',
      role: 'admin'
    }
  }, res);

  assert.equal(res.statusCode, 201);
  assert.equal(createdUser.role, 'user');
});

test('booking price is calculated from the movie price, not the request', async (t) => {
  let createdBooking;
  t.mock.method(Movie, 'findById', async () => ({
    ticketPrice: 300,
    showtimes: ['06:30 PM']
  }));
  t.mock.method(Booking, 'find', async () => []);
  t.mock.method(Booking, 'create', async (booking) => {
    createdBooking = booking;
    return { _id: 'booking-id' };
  });
  t.mock.method(Booking, 'findById', () => {
    const query = {
      populate() {
        return query;
      },
      then(resolve, reject) {
        return Promise.resolve(createdBooking).then(resolve, reject);
      }
    };
    return query;
  });

  const res = createResponse();
  await createBooking({
    body: {
      movie: '507f1f77bcf86cd799439011',
      seats: ['A1', 'A2'],
      totalPrice: 1,
      showDate: '2026-10-17',
      showTime: '06:30 PM'
    },
    user: { id: 'user-id' }
  }, res);

  assert.equal(res.statusCode, 201);
  assert.equal(createdBooking.totalPrice, 600);
});

test('unique seat index protects reservations across concurrent requests', () => {
  const index = Booking.schema.indexes().find(([, options]) => options.name === 'unique_movie_show_seat');
  assert.ok(index);
  assert.equal(index[1].unique, true);
  assert.deepEqual(index[0], { movie: 1, showDate: 1, showTime: 1, seats: 1 });
});

test('concurrent seat reservation conflicts return HTTP 409', async (t) => {
  t.mock.method(Movie, 'findById', async () => ({
    ticketPrice: 300,
    showtimes: ['06:30 PM']
  }));
  t.mock.method(Booking, 'find', async () => []);
  t.mock.method(Booking, 'create', async () => {
    throw Object.assign(new Error('Duplicate seat reservation'), { code: 11000 });
  });

  const res = createResponse();
  await createBooking({
    body: {
      movie: '507f1f77bcf86cd799439011',
      seats: ['A1'],
      showDate: '2026-10-17',
      showTime: '06:30 PM'
    },
    user: { id: 'user-id' }
  }, res);

  assert.equal(res.statusCode, 409);
});

test('invalid calendar dates are rejected as client errors', async (t) => {
  let movieLookupCalled = false;
  t.mock.method(Movie, 'findById', async () => {
    movieLookupCalled = true;
    return null;
  });

  const res = createResponse();
  await createBooking({
    body: {
      movie: '507f1f77bcf86cd799439011',
      seats: ['A1'],
      showDate: '2026-02-31',
      showTime: '06:30 PM'
    },
    user: { id: 'user-id' }
  }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(movieLookupCalled, false);
});

test('occupied-seat lookup requires both screening date and time', async (t) => {
  let queried = false;
  t.mock.method(Booking, 'find', () => {
    queried = true;
    return [];
  });

  const res = createResponse();
  await getOccupiedSeats({
    query: { movieId: '507f1f77bcf86cd799439011' }
  }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(queried, false);
});
