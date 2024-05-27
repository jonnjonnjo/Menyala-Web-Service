import { supabase } from "./auth";
import { Request,Response,NextFunction } from "express";

export async function authMiddleware(req:Request, res:Response,next:NextFunction){
    
    const { authorization } = req.headers;

    if(!authorization){
        res.status(401).json({
            error: "Unauthorized"
        })
    }

    const token  = authorization?.split(' ')[1];

    try{
        const {data,error} = await supabase.auth.getUser(token!);

        if(error){
            return res.status(401).json({
                error:"Unauthorized"    
            })
        }
    
        next()
    }catch(err){
        return res.status(401).json({error:"Unauthorized"})
    }

}