
import { Request, Response } from 'express';
import { userServices } from './user.services';

const getAllUsers = async (req:Request, res:Response)=>{
    try {
        const result = await userServices.getAllUsers();

        res.status(200).json({
            "success": true,
            "message": "Users retrieved successfully",
            "data": result.rows,
        });
  } catch (err: any) {
    res.status(400).json({
      "success": false,
      "message": err.message,
      "errors": err,
    });
  }
}

const updateUser = async (req: Request, res: Response) => {
  const {userId} = req.params;
  if(req.user!.role!=="admin" && req.user!.id.toString()!==userId){
    // console.log("I am here");
    // console.log("typeof req.ueser.id = ",typeof(req.user.id)," typeof userId",typeof(userId));
    
    return res.status(401).json({
            "success": false,
            "message": "Unauthorized",
            "errors": "Unauthorized access wanted"
        });
  }
  try {
    const result = await userServices.updateUser(userId as string,req.body);

    if (!result) {
      res.status(404).json({
        "success": false,
        "message": "User not found",
        "errors": "User not found"
      });
    } else {
      res.status(200).json({
        "success": true,
        "message": "User updated successfully",
        "data": {
            "id": result.id,
            "name": result.name,
            "email": result.email,
            "phone": result.phone,
            "role": result.role
        }
      });
    }
  } catch (err: any) {
    res.status(400).json({
      "success": false,
      "message": err.message,
      "errors": err
    });
  }
};

const deleteUser = async (req:Request,res:Response)=>{
    const {userId: userId} = req.params;
    try{
        const result = await userServices.deleteUser(userId as string);
        
        if("booked" in result && result.booked){
            return res.status(400).json({ 
                "success": false, 
                "message": "user has booked a vehicle and cannot be deleted" ,
                "errors": "user has booked a vehicle and cannot be deleted"
            });
        }
        
        if(result.rowCount === 0){
            return res.status(404).json({
                    "success": false, 
                    'message': "User not found",
                    "errors": "User not found"
            })
        }
    
        res.status(200).json({
            "success": true,
            "message": "User deleted successfully"
        });
    }
    catch(err:any){
            res.status(500).json({
                    "success": false,
                    "message": "User delete failed",
                    "errors": err
            })
    }
}




export const userControllers = {
    getAllUsers,
    updateUser,
    deleteUser
}