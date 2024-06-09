require('dotenv').config();

import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import router from './src/user';
import cookieParser from 'cookie-parser';
import { iotRouter } from './src/iot';

const app = express();
const port = 9012;
export const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

//app.post('/iot', insertIot)  // This is for geting the data from the iot device

//app.use('/iot', iotRouter);

app.use('/user', router); // this is for user registration and login

//app.get('/iot-data',authMiddleware, getWeeklyData)

app.listen(port, () => {
	console.log('Listening on port ', port);
});
