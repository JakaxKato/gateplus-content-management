import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  console.log(`MongoDB terhubung: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
