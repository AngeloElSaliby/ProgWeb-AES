import express, {Request, Response} from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";


const router = express.Router();

router.post("/login", [
    //validate request with express-validator
    check("email", "Username is required, must be between 3 and 15 characters and alphanumeric").isString().trim().isLength({min:3, max:15}).isAlphanumeric(),
    check("password", "Password must be at leasst 6 characters long").isLength({min:6})
], async (req: Request, res: Response) =>{

    //handle express-validator errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(400).json({message: errors.array()[0]});
    }

    const {email, password} = req.body; //destructuring the data from request


    try{
        const user = await User.findOne({email});

        //Check if user exists
        if(!user){
            return res.status(400).json({message: "The user does not exist or the password is wrong."});
        }

        //Check if password matches after encryption
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "The user does not exist or the password is wrong."}); 
        }

        //JWT token
        const token =jwt.sign({email: user.email}, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d"});
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV ==="production", //only https requests in production
            maxAge: 86400000 //1 day in milliseconds
        })

        res.status(200).json({email: user.email}); //Useful in frontend since it cannot access the token. 



    } catch (error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"}) //Server error
    }

})

router.post("/logout", (req:Request, res: Response) =>{
    res.cookie("auth_token", "", { //delete token to reset session
        expires: new Date(0),
    });
    res.send();
})


router.get("/whoami", verifyToken, (req: Request,res: Response) =>{
    res.status(200).json({email:req.email}) //added by verifyToken
})

export default router;