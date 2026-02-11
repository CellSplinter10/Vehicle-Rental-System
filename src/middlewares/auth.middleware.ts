import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { jwt_secret_key } from './../configuration/config';

export const requireAuth=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token as string,
            jwt_secret_key as string
        ) as {
            id: number,
            email: string,
            role: string
        }

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
    
}

export const requireAdmin=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token as string,
            jwt_secret_key as string
        ) as {
            id: number,
            email: string,
            role: string
        }

        if(decoded.role!=="admin"){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        
        req.user = decoded;
        
        

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    
}