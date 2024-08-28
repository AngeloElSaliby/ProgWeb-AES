//middlewares related to auth operations

import { NextFunction, Request, Response} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global { //add userId property to Request type of express
    namespace Express{
        interface Request{
            email: string;
        }
    }
}

const verifyToken = (req: Request, res:Response, next: NextFunction) =>{
    const token = req.cookies["auth_token"];
    if(!token){
        return res.status(401).json({message: "unauthorized"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
        req.email = (decoded as JwtPayload).email
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({message: "unauthorized"})
    }
}




export default verifyToken;