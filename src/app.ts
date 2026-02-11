import express from "express";
import {initDB} from "./configuration/db";
import authRoutes from "./modules/auth/auth.routes";
import vehicleRoutes from "./modules/vehicles/vehicle.routes";
import userRoutes from "./modules/users/user.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import {Request,Response} from "express";

const app = express();

app.use(express.json());

initDB();

app.use("/api/v1/auth/",authRoutes);
app.use("/api/v1/vehicles/",vehicleRoutes);
app.use("/api/v1/users/",userRoutes);
app.use("/api/v1/bookings/",bookingRoutes);

//not found route has to be implemented
app.use((req:Request,res:Response)=>{
    res.status(404).json({
        "success": false,
        "message": "Route not found",
        "error": "Route not found error"
    });
})

export default app;