import mongoose from 'mongoose';
import { NODE_ENV, DB_URI } from '../config/env.js';

if (!DB_URI) {
  throw new Error('Please Define Database On ENV ');
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

export default connectToDatabase;
