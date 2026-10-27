const mongoose = require('mongoose');
const net = require('net');

const checkMongoAvailable = (uri) => {
  return new Promise((resolve) => {
    try {
      const url = new URL(uri.replace('mongodb://', 'http://').replace('mongodb+srv://', 'https://'));
      const host = url.hostname;
      const port = parseInt(url.port || '27017', 10);

      if (host === 'localhost' || host === '127.0.0.1') {
        const socket = new net.Socket();
        socket.setTimeout(200);
        socket.once('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.once('error', () => {
          socket.destroy();
          resolve(false);
        });
        socket.once('timeout', () => {
          socket.destroy();
          resolve(false);
        });
        socket.connect(port, host);
        return;
      }
      resolve(true);
    } catch {
      resolve(false);
    }
  });
};

const connectDB = async () => {
  mongoose.set('bufferCommands', false);

  if (!process.env.MONGO_URI) {
    return;
  }

  const isAvailable = await checkMongoAvailable(process.env.MONGO_URI);
  if (!isAvailable) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 1500
    });
  } catch {
    // Graceful silent fallback to in-memory store
  }
};

module.exports = connectDB;