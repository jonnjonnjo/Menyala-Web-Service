import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from './src/user';
import cookieParser from 'cookie-parser';
import { iotRouter } from './src/iot';
import { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT!) || 8012;;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/iot', iotRouter);
app.use('/user', router); // this is for user registration and login

app.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'HELLO',
	});
});
app.listen(PORT,() => {
	console.log('Listening on port ', PORT);
});
