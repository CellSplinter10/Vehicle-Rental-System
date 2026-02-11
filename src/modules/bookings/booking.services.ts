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


const createBooking = async (customer_id:string,vehicle_id:string,rent_start_date:string,rent_end_date:number)=> {
    await updateBookingAndVehicleStatus();  

    const vehicleResult = await pool.query(
        `SELECT id, vehicle_name, daily_rent_price, availability_status
        FROM vehicles
        WHERE id = $1`,
        [vehicle_id]
    );

    if (vehicleResult.rows.length === 0) {
        throw new Error('Vehicle not found');
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== 'available') {
        throw new Error('Vehicle is not available');
    }

    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    if (endDate <= startDate) {
        throw new Error('rent_end_date must be after rent_start_date');
    }

    const numberOfDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    const total_price = numberOfDays * vehicle.daily_rent_price;
    
    const bookingResult = await pool.query(
        `INSERT INTO bookings 
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *`,
        [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        ]
    );

    //update korte hobe je vehicle ta booked.
    await pool.query(
        `UPDATE vehicles
        SET availability_status = 'booked'
        WHERE id = $1`,
        [vehicle_id]
    );

  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.daily_rent_price
    FROM bookings b
    INNER JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1
    `,
    [bookingResult.rows[0].id]
  );

  return result.rows[0];
};

const getAllBookings = async (role:string,id?:string)=>{
    await updateBookingAndVehicleStatus();
    if (role==="admin"){
        const result = await pool.query(
            `
            SELECT 
                b.id,
                b.customer_id,
                b.vehicle_id,
                b.rent_start_date,
                b.rent_end_date,
                b.total_price,
                b.status,
                u.name AS customer_name,
                u.email AS customer_email,
                v.vehicle_name,
                v.registration_number
            FROM bookings b
            INNER JOIN users u ON b.customer_id = u.id
            INNER JOIN vehicles v ON b.vehicle_id = v.id
            `
        );

        return result.rows;
    }
    else{
        const result = await pool.query(
            `
            SELECT 
            b.id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            v.vehicle_name,
            v.registration_number,
            v.type
            FROM bookings b
            INNER JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = $1
            ORDER BY b.id DESC
            `,
            [id]
        );

        return result.rows;
    }
    
}

const updateBooking = async (
  user: { id: number; role: string },
  bookingId: string,
  body: { status: string }
) => {
  await updateBookingAndVehicleStatus();
  
  const { status } = body;

  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    throw new Error('Booking not found');
  }

  const booking = bookingResult.rows[0];
  const today = new Date();
  const rentStartDate = new Date(booking.rent_start_date);

  if (user.role === 'customer') {
    if (status !== 'cancelled') {
      throw new Error('Customers can only cancel bookings');
    }

    if (booking.customer_id !== user.id) {
      throw new Error('You are not allowed to cancel this booking');
    }

    if (booking.status !== 'active') {
      throw new Error('Only active bookings can be cancelled');
    }

    if (today >= rentStartDate) {
      throw new Error('Booking can only be cancelled before start date');
    }

    const updatedBooking = await pool.query(
      `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
      `,
      [bookingId]
    );
    await pool.query(
      `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      `,
      [booking.vehicle_id]
    );

    return updatedBooking.rows[0];
  }

  if (user.role === 'admin') {
    if (status !== 'returned') {
      throw new Error('Admin can only mark bookings as returned');
    }

    if (booking.status !== 'active') {
      throw new Error('Only active bookings can be returned');
    }

    const updatedBooking = await pool.query(
      `
      UPDATE bookings
      SET status = 'returned'
      WHERE id = $1
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
      `,
      [bookingId]
    );

    await pool.query(
      `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = $1
      `,
      [booking.vehicle_id]
    );

    return {
      ...updatedBooking.rows[0],
      vehicle: {
        availability_status: 'available',
      },
    };
  }

  throw new Error('Unauthorized role');
};

export const bookingService = {
    createBooking,
    getAllBookings,
    updateBooking
}

