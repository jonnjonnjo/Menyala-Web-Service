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
		res.status(400).json({ message: 'There is no gas / temperature' });
	}

	// insert gas
	const { data, error } = await supabase
		.from('IoTGasTemperature')
		.insert({
			gas,
			temperature,
		})
		.select('*')
		.single();

	console.log(data);

	if (error) res.status(400).json({ message: 'error' });
	res.status(201).json({ message: 'succes' });
});

type sendData = {
	gas:number|null,
	temperature:number|null,
	createdAt:string,
	base64encode:string|null,
	incident:boolean,
}

iotRouter.get('/data', authMiddleware, async (req: Request, res: Response) => {
	const getAllCam = await supabase.from('IoTCam').select().order('id', { ascending: false });

	const camData = getAllCam.data;

	const getAllGasTemp = await supabase
		.from('IoTGasTemperature')
		.select()
		.order('id', { ascending: false });

	const gasTempData = getAllGasTemp.data;

	const minim = Math.min(camData?.length || 0, gasTempData?.length || 0, 120960);

	const allIncident = await supabase.from('Incident').select();

	let newData: sendData[] = [];

	if (!gasTempData || !camData) {
		res.status(400).json({
			message: 'Empty',
		});
	}

	if (camData === null) {
		res.status(400).json({
			message: 'Camera Data Empty',
		});
		return;
	}

	if (gasTempData === null) {
		res.status(400).json({
			message: 'Gas Temperature Empty',
		});
		return;
	}

	for(let i = 0 ;i < minim;i++){
		const cd = camData[i];
		const gt = gasTempData[i];

		if (cd && gt) {
			// find incident

			let exist = false;

			for (
				let j = 0;
				j < (allIncident.data?.length === undefined ? 0 : allIncident.data.length);
				j++
			) {
				if (allIncident.data === null) {
					break;
				}
				if (allIncident.data[j].iotCamId == cd.id) {
					exist = true;
				}
			}
			const toPush = {
				gas:gt.gas,
				temperature:gt.temperature,
				createdAt:cd.created_at,
				base64encode:cd.base64Encode,
				incident:exist,
			}

			newData.push(toPush);
		}
	}

	res.status(200).json({
		data: newData,
	});
});
