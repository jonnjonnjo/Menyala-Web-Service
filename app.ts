import { Prisma, PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { insertIot } from "./src/iot";



const app = express();
const port = 9012
export const prisma = new PrismaClient();

app.use(express.json())

app.post('/iot', insertIot)

app.get('/iot', async (req,res)=>{
    const alldata = await prisma.iotMeasurement.findMany()
    res.json(alldata)
})

app.get('/incident', async (req,res)=>{
    const alldata = await prisma.incident.findMany()
    res.json(alldata)
})

app.listen(port,()=>{
    console.log("Listening on port ", port)
})



