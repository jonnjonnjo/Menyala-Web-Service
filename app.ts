import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { getAllIotData, insertIot } from "./src/iot";
import { getAllIncident } from "./src/incident";
import router from "./src/user";



const app = express();
const port = 9012
export const prisma = new PrismaClient();

app.use(express.json())

app.post('/iot', insertIot)

app.get('/iot',getAllIotData)

app.get('/incident', getAllIncident)

app.use('/user/',router);

app.listen(port,()=>{
    console.log("Listening on port ", port)
})



