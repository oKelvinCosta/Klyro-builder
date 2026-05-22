import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI environment variable is not defined");
}

const clientOptions = {
  serverApi: {
    version: "1" as const,
    strict: true,
    deprecationErrors: true,
  },
};

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    const client = mongoose.connection.getClient();
    const result = await client.db().admin().command({ ping: 1 });
    console.log("MongoDB conectado com sucesso", result);
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
};