import { createClient } from "@supabase/supabase-js";
import { prisma } from "../app";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);  

export async function register(email:string, password:string){
    
    const { data, error} = await supabase.auth.signUp({
        email,
        password
    })

    if(error){
        return {
            error
        }
    }

    return {data}
}

export async function login(email:string, password:string){
    const { data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    })



    if(error){
        return {
            error
        }
    }

    return {data}
}
