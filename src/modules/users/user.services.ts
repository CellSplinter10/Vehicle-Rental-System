
import { pool } from './../../configuration/db';



const getAllUsers = async () => {
  
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
  return result;

};

const updateUser = async (id:string,updates:any) => {
  const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for(const [key,value] of Object.entries(updates)){
        if(value!=undefined){
            fields.push(`${key} = $${idx++}`);
            values.push(value);
        }
    }

    if(fields.length === 0) return null; 
    // console.log(fields);
    values.push(id);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    
    const result = await pool.query(
        query,values
    );

    // console.log(result.rows[0]);
    return result.rows[0];
};

const deleteUser = async (id:string)=>{
    const bookingResult = await pool.query(
        `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,[id]);
    
    if(bookingResult.rowCount!==0){
        return {"booked":true,"rowCount":0};
    } 
    const result = await pool.query(
        `DELETE FROM users WHERE id=$1`,[id]
    );
    
    return result;
}

export const userServices = {
    getAllUsers,
    updateUser,
    deleteUser
}