import express from 'express';
import { connectDB } from './db';
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from 'path'; 
import cookieParser from "cookie-parser";
import {populateDB} from "./demo";

//routes imports
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myExpenses from './routes/myExpenses';
import myBalance from './routes/myBalance';
import User from './models/user';



// Correctly configure dotenv, this is being used in deployment
dotenv.config({ path: path.resolve(__dirname, '../.env') });

//Initialize express and basic request parsing
const app = express();
const port = 5000;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

let db: mongoose.Connection | null = null;
let isConnecting = false; 

// Initialize database
const initializeDB = async () => {
  //prevent connection flood
  if(isConnecting){
    console.log("DB: waiting for previous connection attempt to end")
    return;
  }
  try {
      console.log("DB: Starting a connection attempt")
      isConnecting=true;
      db = await connectDB();
  } catch(error) {
      console.error(error);
  }finally{
    console.log(`DB: Connection attempt ended. Connection successful: ${!!db}`)
    isConnecting= false;
    
    if(db){
      const users= await User.find({});
      console.log(users);
      if(users.length === 0){
        const success = await populateDB();
        console.log(success ? "Database Populated successfully" : "Something went wrong populating the database")}
    }

  }
};

initializeDB() //first try before any request


//Userful in development
//dotenv configuration test
// app.get('/test-env', (req, res) => {
//     res.json({
//       jwtSecretKey: process.env.JWT_SECRET_KEY,
//       mongoUri: process.env.MONGODB_CONNECTION_STRING,
//       port: process.env.PORT,
//       message: "ciao"
//     });
//   });



//api routes
app.use(express.static(path.join(__dirname, "../../frontend/build"))) //let the backend serve the static build of react
//Handle db not connected, positioned here so that it is placed in the frontend context instead of json in browser
//Does not handle frontend refresh with db down
app.use("/*", (req,res, next)=> {

  if(!db){
    res.status(500).json({message: "(dev only)db is down, contact administrator"})
    initializeDB();
  }
  else {next();}
})

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budget", myExpenses);
app.use("/api/balance", myBalance);

app.use("/*", (req, res) => { //Fixing refresh on frontend, if not any other endpoint serve react build 
  res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
