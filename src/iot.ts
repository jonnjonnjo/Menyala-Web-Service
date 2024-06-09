import { prisma } from '../app';
import { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { supabase } from './supabase/supabase';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const iotRouter = express.Router();

iotRouter.post('/iot-cam', upload.single('imageFile'), async (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}
	const file = req.file;
	const base64Data = file.buffer.toString('base64');

	const { error } = await supabase.from('IoTCam').insert({ base64Encode: base64Data });
	if (error) {
		return res.status(500).send(error);
	}
	res.status(201).send('Image uploaded and logged in base64 format.');
});

iotRouter.post("/iot-gas-temperature",async(req:Request,res:Response)=>{
	const {gas,temperature} = req.body;

	if(!gas || !temperature){
		res.status(400).json({message:"There is no gas / temperature"})
	}

	// insert gas
	const data = await supabase.from("IoTGasTemperature").insert({
		gas,
		temperature
	})


	if(data){
		res.status(200).json({message:"succes"})
	}else{
		res.status(400).json({message:"error"})
	}
})