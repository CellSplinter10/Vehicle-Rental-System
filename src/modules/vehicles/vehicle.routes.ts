import {Router,Response,Request} from "express";
import { vehicleController } from './vehicle.controller';
import { requireAdmin } from './../../middlewares/auth.middleware';

const router = Router();

router.post("/",requireAdmin,vehicleController.createVehicle);
router.get("/",vehicleController.getAllVehicles);
router.get("/:vehicleId",vehicleController.getVehicleByID);
router.put("/:vehicleId",requireAdmin,vehicleController.updateVehicle);
router.delete("/:vehicleId",requireAdmin,vehicleController.deleteVehicle);

router.use((req:Request,res:Response)=>{
    res.status(404).json({
        "success": false,
        "message": "Route not found",
        "error": "Route not found error"
    });
});

export default router;