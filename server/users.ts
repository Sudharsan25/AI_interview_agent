'use server'


// sign-in and sign-up


import { auth } from "@/lib/auth";



export const signIn = async (email:string, password:string) => {
    try {
        await auth.api.signInEmail({
        body:{
            email,
            password
        }
    })  
        return {
            success: true,
            message: "Signed In Successfully!!"
        }
    } catch (error) {

        const e = error as Error
        console.log("Error occured during signIn:",error)
        
        return {
            success: false,
            message: `Error occured: ${e.message}` 
        }
    }
    
};

export const signUp  = async (email:string, password:string, name: string) =>{
    try {
       await auth.api.signUpEmail({
        body:{
            email,
            password,
            name
        }
    }) 
        return {
            success: true,
            message: "User created Successfully!!"
        }
    } catch (error) {
        const e = error as Error
        console.log("Error occured during signUp:", error)
        return {
            success: false,
            message: `Error occured: ${e.message}` 
        }
    }
    
    
}