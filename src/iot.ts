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
	console.log('POST /iot-gas-temperature');
	const { gas, temperature } = req.body;

	if (!gas || !temperature) {
		return res.status(400).json({ message: 'There is no gas / temperature' });
	}

	// insert gas
	const { data, error } = await supabase
		.from('IoTGasTemperature')
		.insert({
			gas: parseFloat(gas),
			temperature: parseFloat(temperature),
		})
		.select('*')
		.single();

	console.log('data: ', data);
	console.log('error: ', error);

	if (error) {
		return res.status(400).json({ message: 'error' });
	}
	return res.status(201).json({ message: 'succes' });
});

type sendData = {
	gas: number | null;
	temperature: number | null;
	createdAt: string;
	base64encode: string | null;
	incident: boolean;
};

iotRouter.get('/data', async (req: Request, res: Response) => {
	const { date } = req.query;
	let queryDate: Date | null = null;

	if (date) {
		queryDate = new Date(parseInt(date as string));
		console.log(queryDate);
		console.log('day:', queryDate.getDate());
		console.log('month:', queryDate.getMonth());
		console.log('year:', queryDate.getFullYear());
	}

	const getAllCam = await supabase.from('IoTCam').select().order('id', { ascending: false });
	const camData = getAllCam.data;

	const getAllGasTemp = await supabase
		.from('IoTGasTemperature')
		.select()
		.order('id', { ascending: false });
	const gasTempData = getAllGasTemp.data;

	const allIncident = await supabase.from('Incident').select();

	let newData: sendData[] = [];

	if (!gasTempData || !camData) {
		return res.status(400).json({
			message: 'Empty',
		});
	}

	if (camData === null) {
		return res.status(400).json({
			message: 'Camera Data Empty',
		});
	}

	if (gasTempData === null) {
		return res.status(400).json({
			message: 'Gas Temperature Empty',
		});
	}

	for (let i = 0; i < camData.length && i < gasTempData.length; i++) {
		const cd = camData[i];
		const gt = gasTempData[i];

		if (cd && gt) {
			// Filter by date if queryDate is provided
			if (queryDate) {
				const camDate = new Date(cd.created_at);
				const gasTempDate = new Date(gt.created_at);

				const isSameDay = (date1: Date, date2: Date) =>
					date1.getDate() === date2.getDate() &&
					date1.getMonth() === date2.getMonth() &&
					date1.getFullYear() === date2.getFullYear();

				if (!isSameDay(queryDate, camDate) || !isSameDay(queryDate, gasTempDate)) {
					continue;
				}
			}

			// find incident
			let exist = false;
			for (let j = 0; j < (allIncident.data?.length ?? 0); j++) {
				if (allIncident.data![j].iotCamId == cd.id) {
					exist = true;
					break;
				}
			}

			const toPush = {
				gas: gt.gas,
				temperature: gt.temperature,
				createdAt: cd.created_at,
				base64encode: cd.base64Encode,
				incident: exist,
			};

			newData.push(toPush);
		}
	}

	return res.status(200).json({
		data: newData,
	});
});
