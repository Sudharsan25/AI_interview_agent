/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

// Managing auth with Server SDK (admin) is much more secure (TODO: LEARN MORE ABOUT THE TOPIC)
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7

export async function signUp(params: SignUpParams){
    const {uid, name , email } = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: "User already exists! Please Sign In instead."
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account created successfully! Please Sign In"
        }
    } catch(e: any) {
        console.log("Error creating a user",e)

        if (e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'This email is already taken'
            }
        }

            return {
                success: false,
                message: 'Error creating a user'
            }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set('session',sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function signIn(params: SignInParams){
    console.log("SignIn Triggered")
    const {email, idToken } = params;
    try{
        const userRecord = await auth.getUserByEmail(email);
        
        if(!userRecord){
            return{
                success: false,
                message: "User does not exist! Create an account please!"
            }
        }

        await setSessionCookie(idToken)

        return {
            success: true,
            message: "Signed In successfully!"
        }
    } catch(e: any){
        console.log(e)
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if (!userRecord.exists) return null;

        return{
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch(e){
        console.log("Error fetching user:", e);

        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user; // convert an object to a true or false boolean value using "!!"   
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete('session'); // Delete the session cookie
    // Optionally, you might want to revoke the session token on Firebase Admin SDK
    return { success: true, message: "Logged out successfully!" };
}