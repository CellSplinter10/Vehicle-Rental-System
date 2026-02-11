import { pool } from './../../configuration/db';

const updateBookingAndVehicleStatus = async ()=>{
    const now = new Date().toISOString().split('T')[0];

    await pool.query(
    `UPDATE bookings b
    SET status = 'returned'
    FROM vehicles v
    WHERE b.vehicle_id = v.id
        AND b.status = 'active'
        AND b.rent_end_date < $1
    RETURNING b.id`,
    [now]
    );

    await pool.query(
    `UPDATE vehicles
    SET availability_status = 'available'
    WHERE id IN (
        SELECT vehicle_id FROM bookings
        WHERE status = 'returned' AND rent_end_date < $1
    )`,
    [now]
    );

}


const createVehicle = async (vehicle_name:string,type:string,registration_number:string,daily_rent_price:number,availability_status:string)=> {
    await updateBookingAndVehicleStatus();

    const result = await pool.query(
    `INSERT INTO vehicles 
    (vehicle_name,type,registration_number,daily_rent_price,availability_status)
    VALUES ($1,$2,$3,$4,$5) returning *
    `, [vehicle_name,type,registration_number,daily_rent_price,availability_status]  
    );
    // console.log(result.rows[0]);
    return result.rows[0];
};

const getAllVehicles = async ()=>{
    await updateBookingAndVehicleStatus();

    const result = await pool.query(
        `SELECT * FROM vehicles`
    );
    return result.rows;
}

const getVehicleByID = async (id:string)=>{

    await updateBookingAndVehicleStatus();


    const result = await pool.query(
        `SELECT * FROM vehicles WHERE ID=$1`,[id]
    );
    return result.rows;
}

const updateVehicle = async (id:string,updates:any)=>{

    await updateBookingAndVehicleStatus();


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

    const query = `UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
    
    const result = await pool.query(
        query,values
    );


    return result.rows[0];
}

const deleteVehicle = async (id:string)=>{

    await updateBookingAndVehicleStatus();

    const bookingResult = await pool.query(
        `SELECT availability_status FROM vehicles WHERE id=$1 AND status='active'`,[id]);
    
    if(bookingResult.rowCount!==0 && bookingResult.rows[0].availability_status==="booked"){
        return {"booked":true,"rowCount":0};
    }
    
    const result = await pool.query(
        `DELETE FROM vehicles WHERE id=$1`,[id]
    );
    
    return result;
}

export const vehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleByID,
    updateVehicle,
    deleteVehicle
};