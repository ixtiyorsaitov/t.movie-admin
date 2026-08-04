import mongoose, { ConnectOptions } from "mongoose";

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  // NEXT_PUBLIC_ prefiksli o'zgaruvchi klient bundle'ga tushadi — server uchun
  // maxfiy URI MONGO_URI dan olinishi kerak (eskisi fallback sifatida qoladi)
  const mongoUri =
    process.env.MONGO_URI || process.env.NEXT_PUBLIC_MONGO_URI;

  if (!mongoUri) {
    return console.log("Mongo URI is not defined");
  }

  // Ulanish allaqachon aktiv bo'lsa qayta ulanmaymiz;
  // aks holda (uzilgan bo'lsa) qayta ulanishga harakat qilamiz
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: "t-movie",
      autoCreate: true,
    };

    await mongoose.connect(mongoUri, options);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
