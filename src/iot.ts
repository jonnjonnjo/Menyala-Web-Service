import { prisma } from '../app';
import { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { supabase } from './supabase/supabase';
import { authMiddleware } from './auth';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const iotRouter = express.Router();

iotRouter.post('/iot-cam', upload.single('imageFile'), async (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}
	const file = req.file;
	const base64Data = file.buffer.toString('base64');

	const { data, error } = await supabase
		.from('IoTCam')
		.insert({ base64Encode: base64Data })
		.select('id')
		.single();
	if (error) {
		return res.status(500).send(error);
	}

	const response = await fetch(`${process.env.AI_MODEL_URL}/predict`, {
		method: 'POST',
		body: JSON.stringify({ b64imgstr: base64Data }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const fazaData: {
		fire: boolean;
		confidence?: number;
		image: string;
	} = await response.json();

	console.log({
		fire: fazaData.fire,
		confidence: fazaData.confidence,
	});

	if (fazaData.fire) {
		// console.log('There is a fire!');
		await supabase.from('Incident').insert({ iotCamId: data.id });
		return res.status(201).send('THERE IS A FIRE! Image and incident succesfully logged.');
	}

	return res.status(201).send('Image succesfully uploaded and logged.');
});

iotRouter.post('/iot-gas-temperature', async (req: Request, res: Response) => {
	const { gas, temperature } = req.body;

	if (!gas || !temperature) {
		res.status(400).json({ message: 'There is no gas / temperature' });
	}

	// insert gas
	const data = await supabase.from('IoTGasTemperature').insert({
		gas,
		temperature,
	});

	if (data) {
		res.status(200).json({ message: 'succes' });
	} else {
		res.status(400).json({ message: 'error' });
	}
});

iotRouter.get('/data', authMiddleware, async (req: Request, res: Response) => {
	// const getAllCam;
});
