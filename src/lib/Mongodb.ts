import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js DNS SRV resolution issues on Windows / corporate / university networks
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // ignore if not supported in environment
}

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export default async function connectMongoDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "กรุณาระบุ MONGODB_URI ในไฟล์ .env ก่อนเริ่มใช้งาน (เช่น mongodb+srv://...)"
    );
  }

  if (cached && cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  if (cached && !cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 7000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("Connected to MongoDB Atlas successfully.");
        return m;
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        cached!.promise = null;
        let helpfulMsg = err.message;
        if (err.message.includes("querySrv") || err.message.includes("ETIMEOUT")) {
          helpfulMsg =
            "ไม่สามารถเชื่อมต่อ MongoDB Atlas ได้ (DNS ETIMEOUT): โปรดตรวจสอบว่า Cluster ใน MongoDB Atlas ยังทำงานอยู่หรือไม่ (หากขึ้น Paused ให้กด Resume) หรือตรวจสอบ MONGODB_URI ในไฟล์ .env";
        }
        throw new Error(helpfulMsg);
      });
  }

  if (cached && cached.promise) {
    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }
  }

  return cached!.conn!;
}
