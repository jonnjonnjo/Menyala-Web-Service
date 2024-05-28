import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { getAllIotData, getWeeklyData, insertIot } from "./src/iot";
import { getAllIncident } from "./src/incident";
import router from "./src/user";
import { authMiddleware } from "./src/auth";
import cookieParser from "cookie-parser";



const app = express();
const port = 9012
export const prisma = new PrismaClient();

app.use(express.json())
app.use(cookieParser())

app.post('/iot', insertIot)  // This is for geting the data from the iot device

app.get('/iot',getAllIotData) // this is for fetching all data in database in table iotperformance
 
app.get('/incident', getAllIncident) // this is for fetching all data in database in table incident

app.use('/user/',router); // this is for user registration and login

app.get('/iot-data',authMiddleware, getWeeklyData)

app.listen(port,()=>{
    console.log("Listening on port ", port)
})



