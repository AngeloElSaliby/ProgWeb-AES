import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";  //for the check function 
import verifyToken from "../middleware/auth";
const router = express.Router();

router.post("/register",[ //express-validator middleware
    check("firstName", "First Name is required").isString().trim().isLength({min:1}),
    check("lastName", "last Name is required").isString(),
    check("email", "Username is required, must be between 3 and 15 characters and alphanumeric").isString().trim().isLength({min:3, max:15}).isAlphanumeric(),
    check("password", "6 or more characters").isLength({min: 6})
  
], async (req: Request, res: Response) =>{
    //handle express-validator errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.array()[0].msg});
    }



    try{
        console.log('Received registration request:', req.body);

        //checking if user exists
        let user = await User.findOne({ 
            email: req.body.email
        })
        if(user) {
            return res.status(400).json({message: "Username already in use."}) //bad requeste
        } 

        //save user to db
        user = new User(req.body);
        await user.save();
        console.log('User saved:', user);

        //authentication through JWT
        console.log(process.env.JWT_SECRET_KEY as string);
        const token = jwt.sign({email: user.email}, process.env.JWT_SECRET_KEY as string, 
            {
            expiresIn: "1d"
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //Standard practice not to use http in production 
            maxAge: 86400000 //1 day in milliseconds
        })
        console.log('JWT token created:', token);



        //sending request
        res.status(200).json({message: "User registered succesfully"});

    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Something went wrong."});
    }
})

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        // Fetch all users from the database
        const users = await User.find({}, { email: 1, firstName:1, lastName:1  }).exec(); // select only specific fields

        // Send the users back to the client
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to retrieve users." });
    }
});

export default router;