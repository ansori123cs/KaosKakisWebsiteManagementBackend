import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from './config/env.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/users.routes.js';
import kaosKakiRouter from './routes/kaosKakis.routes.js';

import connectToDatabase from './database/mongodb.js';

import errorMiddleware from './middleware/error.middleware.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import sequelize from './config/databaseConfig.js';

const app = express();

const isProd = process.env.NODE_ENV === 'production';

const whitelist = isProd
  ? ['https://website-anda.com'] // production origin(s)
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:5500'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed by server'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Pasang CORS **sebelum** route lain
app.use(cors(corsOptions));

// Tangani preflight request untuk semua route
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

//middleware upload with multer
app.use('/uploads', express.static('uploads'));

//Router
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/kaosKakis', kaosKakiRouter);
app.use('/api/v1/users', userRouter);

//error handler middleware
app.use(errorMiddleware);

//home
app.use('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

//listen port
app.listen(PORT, async () => {
  console.log(`Jangkar Mas API is runnin on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
