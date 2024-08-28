import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/splittify';  //mainly for docker deployment

let cachedDB: mongoose.Connection | null = null;

export const connectDB = async () => {
    if (cachedDB) {
        return cachedDB;
    }
    try {
        await mongoose.connect(mongoUri);
        cachedDB = mongoose.connection;
        return cachedDB;
    } catch (error) {
        console.error("Error acquiring DB connection", error);
        throw {message: "db is down", error};
    }
};
