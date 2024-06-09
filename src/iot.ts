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
		supabase.from('Incident').insert({ iotCamId: data.id });
		return res.status(201).send('THERE IS A FIRE! Image and incident succesfully logged.');
	}

	return res.status(201).send('Image succesfully uploaded and logged.');
});

/*
export async function insertIot(req:Request,res:Response){
    const body = req.body;
    
    const data = await prisma.iotMeasurement.create({
        data: {
            temperature:body.temperature,
            base64Encode:body.base64encode,
            gas:body.gas,
        }
    })

	const responseFromAI = await fetch('https://dummy-ai-chi.vercel.app/classify', {
		method: 'POST',
		body: body,
	});

	const dataFromAI = await responseFromAI.json();

	if (dataFromAI.result === 0) {
		// no incident
	} else {
		// there is incident
		// insert it
		const incidentData = await prisma.incident.create({
			data: {
				measureId: data.id,
			},
		});
	}
	res.send('OK');
}

export async function getAllIotData(req: Request, res: Response) {
	const alldata = await prisma.iotMeasurement.findMany();
	res.json(alldata);
}

export async function getWeeklyData(req: Request, res: Response) {
	res.json({
		message: 'Not implemented yet',
	});
}

*/

type iotMeasurement = {
	id: number;
	temperature: number;
	base64Encode: string;
	gas: number;
	createdAt: Date;
};

export async function getWeeklyData(req: Request, res: Response) {
	const getData = await prisma.iotMeasurement.findMany({
		take: 120960,

		orderBy: {
			createdAt: 'desc',
		},
	});

	const getFlagged = await prisma.incident.findMany({
		take: 120960,
		orderBy: {
			id: 'desc',
		},
	});

	let newData: (iotMeasurement & { incident: boolean })[] = [];

	for (let i = 0; i < getData.length; i++) {
		let incident = false;
		for (let j = 0; j < getFlagged.length; j++) {
			console.log(getData[i], getFlagged[j]);

			if (getData[i].id == getFlagged[j].measureId) {
				incident = true;
			}
		}

		const iotMeasurementData = getData[i] as iotMeasurement;

		newData.push({
			...iotMeasurementData, // Spread the properties from the original measurement object
			incident: incident,
		});
	}

	return res.json(newData);
}
