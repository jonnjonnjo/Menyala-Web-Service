
import { prisma } from "../app";
import { Request, Response } from "express";

export async function insertIot(req:Request,res:Response){
    const body = req.body;
    
    const data = await prisma.iotMeasurement.create({
        data: {
            temperature:body.temperature,
            base64Encode:body.base64encode,
            gas:body.gas,
        }
    })

    const responseFromAI = await fetch('https://dummy-ai-chi.vercel.app/classify',{
        method:'POST',
        body:body
    })

    const dataFromAI = await responseFromAI.json()

    if(dataFromAI.result === 0){
        // no incident
    }else{
        // there is incident
        // insert it
        const incidentData = await prisma.incident.create({
            data:{
                measureId:data.id
            }
        })

    }
    res.send("OK")
}

export async function getAllIotData(req:Request,res:Response){
    const alldata = await prisma.iotMeasurement.findMany()
    res.json(alldata)
}


export async function getWeeklyData(req:Request,res:Response){
    res.json({
        "message":"Not implemented yet"
    })
}
