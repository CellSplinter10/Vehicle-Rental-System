import {Request,Response} from "express";
import { authService } from './auth.service';

const signup = async (req:Request,res:Response)=>{
    const {name,email,password,phone,role} = req.body;

    if(role==="admin"){
        return res.status(403).json({
            "success": false,
            "message": "Admin Registration is Forbidden, It has to done manually"
        });
    }

    try{
        const result = await authService.createUser(name,email,password,phone);
        res.status(201).json({
            "success": true,
            "message": "User registered successfully",
            "data": result
        });
    }
    catch(err:any){
        res.status(400).json({
            "success": false,
            "message": "User registration failed",
            "errors": err
        });
    }
};

const signin = async (req:Request,res:Response)=>{
    const {email,password} = req.body;
    try{
        const result = await authService.signinUser(email,password);
        res.status(200).json({
            "success": true,
            "message": "Login successful",
            "data": result
        });
    }
    catch(err:any){
        res.status(400).json({
            "success": false,
            "message": "User signin failed",
            "errors": err
        });
    }
};

export const authController = {
    signup,
    signin
};