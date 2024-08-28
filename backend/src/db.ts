import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/splittify';  //mainly for docker deployment

let cachedDB: mongoose.Connection | null = null;

export const connectDB = async () => {
    if (cachedDB) {
        console.log("Existing cached connection found");
        return cachedDB;
    }
    console.log(`Acquiring new DB connection at ${mongoUri}`);
    try {
        await mongoose.connect(mongoUri);
        cachedDB = mongoose.connection;
        console.log('MongoDB connected...');
        return cachedDB;
    } catch (error) {
        console.log("Error acquiring DB connection", error);
        throw {message: "db is down", error};
    }
};
