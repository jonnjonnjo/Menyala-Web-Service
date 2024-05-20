import {prisma} from "../app"
import {Request, Response} from "express"

export async function getAllIncident(req:Request, res:Response){
    const alldata = await prisma.incident.findMany()
    res.json(alldata)
}