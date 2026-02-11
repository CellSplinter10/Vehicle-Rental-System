import {Pool} from "pg";
import {port, connection_url} from "./config";

export const pool = new Pool({
    connectionString: connection_url
});

export const initDB = async ()=>{
    await pool.query(
        `CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(60) NOT NULL UNIQUE CHECK(email=lower(email)),
        password VARCHAR(150) NOT NULL CHECK(char_length(password)>=6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('admin','customer'))
        )
        `
    );

    await pool.query(
        `CREATE TABLE IF NOT EXISTS Vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(50) NOT NULL,
            type VARCHAR(15) NOT NULL CHECK (type IN ('car','bike','van','SUV')),
            registration_number VARCHAR(50) NOT NULL UNIQUE,
            daily_rent_price INTEGER NOT NULL CHECK (daily_rent_price>0),
            availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available','booked'))
        )      
        `
    );

    await pool.query(
        `CREATE TABLE IF NOT EXISTS Bookings (
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
            vehicle_id INT NOT NULL REFERENCES Vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price INTEGER NOT NULL CHECK (total_price>0),
            status VARCHAR(20) NOT NULL CHECK (status IN ('active','cancelled','returned'))
        )
        `
    );


    
};