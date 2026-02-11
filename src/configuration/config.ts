import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const connection_url = process.env.DATABASE_URL;
export const jwt_secret_key = process.env.JWT_SECRET;
