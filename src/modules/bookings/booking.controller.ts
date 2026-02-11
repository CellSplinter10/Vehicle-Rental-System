
import { Request, Response } from 'express';
import { bookingService } from './booking.services';

const formatDate = (date: Date|string) => new Date(date).toISOString().split("T")[0];

const createBooking = async (req:Request,res:Response)=>{
    const {customer_id,vehicle_id,rent_start_date,rent_end_date} = req.body;
        try{
            const result = await bookingService.createBooking(customer_id,vehicle_id,rent_start_date,rent_end_date);
            // console.log(result);
            res.status(201).json({
               "success": true,
                "message": "Booking created successfully",
                "data": {
                   "id": result.id,
                    "customer_id": result.customer_id,
                    "vehicle_id": result.vehicle_id,
                    "rent_start_date": formatDate(result.rent_start_date),
                    "rent_end_date": formatDate(result.rent_end_date),
                    "total_price": result.total_price,
                    "status": result.status,
                    "vehicle": {
                        "vehicle_name": result.vehicle_name,
                        "daily_rent_price": result.daily_rent_price
                    }
                }
            });
        }
        catch(err:any){
            res.status(400).json({
                "success": false,
                "message": err.message || "booking creation failed",
                "errors": err
            })
        }
}

const getAllBookings = async (req:Request, res:Response)=> {
    const role = req.user!.role;
    const user_id = req.user!.id;
    try {
        const result = role==="admin"?
        await bookingService.getAllBookings(role)
        : await bookingService.getAllBookings(role,user_id.toString())
        ;


        const i = 1;
        if(role=="admin"){
            return res.status(200).json({
                "success": true,
                "message": 'Bookings retrieved successfully',
                "data": result.map((row: any) => ({
                    id: row.id,
                    customer_id: row.customer_id,
                    vehicle_id: row.vehicle_id,
                    rent_start_date: row.rent_start_date,
                    rent_end_date: row.rent_end_date,
                    total_price: row.total_price,
                    status: row.status,
                    customer: {
                        name: row.customer_name,
                        email: row.customer_email,
                    },
                    vehicle: {
                        vehicle_name: row.vehicle_name,
                        registration_number: row.registration_number,
                    }
                })
            )
        });
        }
        res.status(200).json({
            "success": true,
            "message": 'Your bookings retrieved successfully',
            "data": result.map((row: any) => ({
                id: row.id,
                vehicle_id: row.vehicle_id,
                rent_start_date: row.rent_start_date,
                rent_end_date: row.rent_end_date,
                total_price: row.total_price,
                status: row.status,
                vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type,
                },
            })),
        });
        
    } catch (err:any) {
        res.status(400).json({
            "success": false,
            "message": err.message || 'Failed to retrieve bookings',
            "errors": err,
        });
    }
}

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    // console.log(bookingId);
    // if (isNaN(bookingId)) {
    //   return res.status(400).json({
    //     "success": false,
    //     "message": 'Invalid booking ID',
    //     "errors": 'Invalid booking ID'
    //   });
    // }

    const booking = await bookingService.updateBooking(
      req.user!,            
      bookingId as string,            
      req.body        
    );

    return res.status(200).json({
      "success": true,
      "message":
        req.user!.role === 'admin'
          ? 'Booking marked as returned. Vehicle is now available'
          : 'Booking cancelled successfully',
      "data": booking,
    });

  } catch (error: any) {
    return res.status(400).json({
      "success": false,
      "message": error.message || 'Failed to update booking',
      "errors": error,
    });
  }
};


export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
}

