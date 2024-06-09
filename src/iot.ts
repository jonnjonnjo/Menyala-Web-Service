import { prisma } from '../app';
import { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const iotRouter = express.Router();

iotRouter.post('/iot-cam', async (req: Request, res: Response) => {
	const { base64encode } = req.body;

	//
});

iotRouter.post('/uploadImage', upload.single('imageFile'), async (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}

	// The uploaded file is available in req.file
	const file = req.file;

	// Log the file data in base64
	const base64Data = file.buffer.toString('base64');
	console.log('Base64 Image Data:', base64Data);

	// Send a response to the client
	res.send('Image uploaded and logged in base64 format.');
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
