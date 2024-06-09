require('dotenv').config();

import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import router from './src/user';
import cookieParser from 'cookie-parser';
import { iotRouter } from './src/iot';
import { Request,Response } from 'express';
import cors from "cors"

const app = express();
const port = 7000;
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

app.use(cors())

//app.post('/iot', insertIot)  // This is for geting the data from the iot device

app.use('/iot', iotRouter);
app.use('/user', router); // this is for user registration and login

//app.get('/iot-data',authMiddleware, getWeeklyData)

app.get("/",(req:Request,res:Response)=>{
	res.json({
		message:"HELLO"
	})
})
app.listen(port,"0.0.0.0", () => {
	console.log('Listening on port ', port);
});
