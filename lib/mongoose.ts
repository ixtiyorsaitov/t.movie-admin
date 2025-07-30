import mongoose, { ConnectOptions } from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.NEXT_PUBLIC_MONGO_URI) {
    return console.log("Mongo URI is not defined");
  }
  if (isConnected) {
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: "t-movie",
      autoCreate: true,
    };

    await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI, options);
    isConnected = true;
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
