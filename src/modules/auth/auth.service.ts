import { pool } from './../../configuration/db';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jwt_secret_key } from './../../configuration/config';

const createUser = async (name:string,email:string,
    password:string, phone:string)=> { 
    
    const hashedPass = await bcrypt.hash(password,10);

    
    const result = await pool.query(
            `INSERT INTO users (name,email,password,phone,role) values ($1,$2,$3,$4,$5)
            RETURNING name,email,phone,role
            `,[name,email,hashedPass,phone,"customer"]
    );
    
    return result.rows[0];

};

const signinUser = async (email:string,password:string)=> {
    const result = await pool.query(
        `SELECT * FROM users WHERE email=$1`, [email]
    );
    const user = result.rows[0];
    if(!user){
        throw new Error("Invalid credentials");
    }
    
    const isMatch = bcrypt.compare(user.password,password);
    if(!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
        {id:user.id,email:user.email,role:user.role},
        jwt_secret_key!,
        {expiresIn: "10h"}
    );

    return {
        "token": token,
        "user": {
            "id" : user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        }
    };

};

export const authService = {
    createUser,
    signinUser
};