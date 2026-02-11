import {Router,Request,Response} from "express";
import { userControllers } from './user.controllers';
import { requireAdmin,requireAuth } from './../../middlewares/auth.middleware';

const router = Router();

router.get("/",requireAdmin,userControllers.getAllUsers);
router.put("/:userId",requireAuth,userControllers.updateUser);
router.delete("/:userId",requireAdmin,userControllers.deleteUser);

router.use((req:Request,res:Response)=>{
    res.status(404).json({
        "success": false,
        "message": "Route not found",
        "error": "Route not found error"
    });
});

export default router;