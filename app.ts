import { Prisma, PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { getAllIotData, insertIot } from "./src/iot";
import { getAllIncident } from "./src/incident";



const app = express();
const port = 9012
export const prisma = new PrismaClient();

app.use(express.json())

app.post('/iot', insertIot)

app.get('/iot',getAllIotData)

app.get('/incident', getAllIncident)

app.listen(port,()=>{
    console.log("Listening on port ", port)
})



