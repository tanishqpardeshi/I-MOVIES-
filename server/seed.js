const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Booking = require('./models/Booking');

dotenv.config();

const seedData = async () => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Database seeding is only allowed when NODE_ENV=development');
    }
    if (process.env.SEED_ALLOW_DESTRUCTIVE !== 'true' || !process.argv.includes('--reset')) {
      throw new Error('Seeding deletes existing data. Set SEED_ALLOW_DESTRUCTIVE=true and pass --reset to continue.');
    }
    if (
      !process.env.SEED_ADMIN_PASSWORD ||
      process.env.SEED_ADMIN_PASSWORD.length < 12 ||
      !process.env.SEED_USER_PASSWORD ||
      process.env.SEED_USER_PASSWORD.length < 12
    ) {
      throw new Error('SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD must each be at least 12 characters.');
    }

    await connectDB();

    await Booking.deleteMany();
    await Movie.deleteMany();
    await User.deleteMany();
    await Booking.createIndexes();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, salt);
    const userPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD, salt);

    const [adminUser, demoUser] = await User.insertMany([
      {
        username: 'Admin Manager',
        email: 'admin@imovies.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        username: 'Eshani Jain',
        email: 'user@imovies.com',
        password: userPassword,
        role: 'user'
      }
    ]);

    const inMemoryStore = require('./config/inMemoryStore');
    const movieDocs = inMemoryStore.movies.map((m) => {
      const { _id, ...rest } = m;
      return {
        ...rest,
        releaseDate: new Date(m.releaseDate)
      };
    });

    const movies = await Movie.insertMany(movieDocs);

    // Pre-book a few seats on Dune: Part Two so the seat grid immediately shows taken seats!
    const today = new Date().toISOString().split('T')[0];
    await Booking.create({
      user: demoUser._id,
      movie: movies[0]._id,
      seats: ['D4', 'D5', 'E6', 'E7'],
      totalPrice: 1280,
      showDate: today,
      showTime: '06:30 PM'
    });

    console.log('Database seeded successfully.');
    console.log('-------------------------------------------');
    console.log('Admin account:    admin@imovies.com');
    console.log('Customer account: user@imovies.com');
    console.log('-------------------------------------------');
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedData();