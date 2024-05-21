import express from 'express';
import { register, login } from './auth';

const router = express.Router();



router.post('/login/', async (req,res)=>{
    const body = req.body;

    const result = await login(body.email,body.password);  
    res.json(result)
})

router.post('/register/', async (req,res)=>{
    const body = req.body;

    const result = await register(body.email,body.password);
    res.json(result)
})


export default router;

