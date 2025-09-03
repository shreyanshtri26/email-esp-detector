import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGODB_URI!;
  await mongoose.connect(uri);
  console.log('Mongo connected');
}
