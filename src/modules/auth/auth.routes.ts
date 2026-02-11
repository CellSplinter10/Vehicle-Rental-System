import {Router} from "express";
import { authController } from './auth.controller';
import {Request,Response} from "express";

const router = Router();

router.post("/signup",authController.signup);
router.post("/signin",authController.signin);

router.use((req:Request,res:Response)=>{
    res.status(404).json({
        "success": false,
        "message": "Route not found",
        "error": "Route not found error"
    });
});

export default router;