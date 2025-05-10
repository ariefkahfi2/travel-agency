import { config } from "dotenv"
import { DataSource } from "typeorm"
import User from "../models/user"
import Booking from "../models/booking"
import path from "path"

try {
  config({
    path: path.resolve(__dirname, '../../.env')
  })
} catch (error: any) {
  console.error('Error loading .env', error)
}

const { DB_URL } = process.env;

const migrationsDir = path.resolve(__dirname, '../migrations/*.js')

const AppDataSource = new DataSource({
  type: "postgres",
  url: DB_URL,
  entities: [User, Booking],
  synchronize: false,
  migrations: [migrationsDir],
  logging: true
})

export default AppDataSource