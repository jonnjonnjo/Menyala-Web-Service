import express, { CookieOptions } from 'express';
import { register, login, authMiddleware } from './auth';

const router = express.Router();



router.post('/login/', async (req,res)=>{
    const body = req.body;

    const result = await login(body.email,body.password);  
    
    const cookieOptions:CookieOptions = {
        httpOnly:true,
        sameSite :'strict'
    }

    const accessToken = result.data?.session.access_token;
    const refreshToken = result.data?.session.refresh_token


    if(accessToken){
        res.cookie("access_token",accessToken,cookieOptions)
        res.cookie("refresh_token",refreshToken,cookieOptions)
        res.status(200).json(result)

    }else{
        res.status(401).json({
            error:"Unauthorized"
        })
    }
})


router.post('/register/', async (req,res)=>{
    const body = req.body;
    const result = await register(body.email,body.password);
    res.json(result)
})




export default router;

