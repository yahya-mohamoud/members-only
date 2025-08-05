import dotenv from 'dotenv'
import { Pool } from "pg";
dotenv.config()

const pool = new Pool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.DB_port
})

export default pool