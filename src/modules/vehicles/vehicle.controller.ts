
import { Request } from 'express';
import { Response } from 'express';
import { vehicleService } from './vehicle.service';


const createVehicle = async (req:Request,res:Response)=>{
    const {vehicle_name,type,registration_number,daily_rent_price,availability_status} = req.body;
    try{
        const result = await vehicleService.createVehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status);
        // console.log(result);
        res.status(201).json({
           "success": true,
            "message": "Vehicle created successfully",
            "data": {
                "id": result.id,
                "vehicle_name": result.name,
                "type": result.type,
                "registration_number": result.registration_number,
                "daily_rent_price": result.daily_rent_price,
                "availability_status": result.availability_status
            }
        });
    }
    catch(err:any){
        res.status(500).json({
            "success": false,
            "message": "Vehicle creation failed",
            "errors": err
        })
    }
}

const getAllVehicles= async (req:Request,res:Response)=>{
    try{
        const vehicles = await vehicleService.getAllVehicles();
        res.status(200).json({
            "success": true,
            "message": "Vehicles retrieved successfully",
            "data": vehicles
        })
    }
    catch(err:any){
        res.status(500).json({
            "success": false,
            "message": "Vehicle retrieval failed",
            "errors": err
        })
    }
};

const getVehicleByID = async (req:Request,res:Response)=>{
    const { vehicleId } = req.params;
    
    try{
        const vehicle = await vehicleService.getVehicleByID(vehicleId as string);
        if(vehicle.length===0){
            res.status(200).json({
            "success": false,
            "message": "Vehicle not found",
            "errors": "Vehicle not found"
            });
        }
        else{
            res.status(200).json({
            "success": true,
            "message": "Vehicle retrieved successfully",
            "data": vehicle[0]
        })
        }
        
    }
    catch(err:any){
        res.status(500).json({
            "success": false,
            "message": "Vehicle retrieval failed",
            "errors": err
        })
    }
};

const updateVehicle = async (req:Request,res:Response)=>{
    const {vehicleId} = req.params;
    try{
        const result = await vehicleService.updateVehicle(vehicleId as string,req.body);
        
        if(!result){
            return res.status(404).json({
                "success": false, 
                "message": "Vehicle not found",
                "errors": "Vehicle not found"
            })
        }

        res.status(200).json({
            "success": true,
            "message": "Vehicle updated successfully",
            "data": result
        });

    }
    catch(err:any){
        res.status(400).json({
            "success": false,
            "message": "Vehicle update failed",
            "errors": err
        });

        

    }
}

const deleteVehicle = async (req:Request, res:Response)=>{
    const {vehicleId} = req.params;
    try{
        const result = await vehicleService.deleteVehicle(vehicleId as string);
        
        if("booked" in result && result.booked){
            return res.status(400).json({ 
                "success": false, 
                "message": "Vehicle is currently booked and cannot be deleted",
                "errors": "Vehicle is currently booked and cannot be deleted"
            });
        }

        if(result.rowCount === 0){
            return res.status(404).json({
                "success": false, 
                "message": "Vehicle not found",
                "errors": "Vehicle not found"
            })
        }
        

        res.status(200).json({
            "success": true,
            "message": "Vehicle deleted successfully"
        });
    }
    catch(err:any){
        res.status(500).json({
                "success": false,
                "message": "Vehicle delete failed",
                "errors": err
        })
    }
}




export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicleByID,
    updateVehicle,
    deleteVehicle
}