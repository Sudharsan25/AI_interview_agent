import { db } from "@/drizzle/db";
import { schema } from "@/drizzle/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js" 

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true, 
  }, 
  database: drizzleAdapter  (db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: schema
  }),
  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
  },
  plugins: [nextCookies()],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
});