import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Prevent multiple connections in development hot-reload
const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

const cache = globalWithMongoose.mongooseCache;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

// Submission model
const submissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, maxlength: 1000 },
    ip: { type: String },
  },
  { timestamps: true }
);

export const Submission =
  mongoose.models.Submission ??
  mongoose.model("Submission", submissionSchema);
