import { Router,Request,Response } from 'express';
import { bookingController } from './booking.controller';
import { requireAuth } from './../../middlewares/auth.middleware';

const router = Router();

router.post("/",requireAuth,bookingController.createBooking);
router.get("/",requireAuth,bookingController.getAllBookings);
router.put("/:bookingId",requireAuth,bookingController.updateBooking);

router.use((req:Request,res:Response)=>{
    res.status(404).json({
        "success": false,
        "message": "Route not found",
        "error": "Route not found error"
    });
});

export default router;