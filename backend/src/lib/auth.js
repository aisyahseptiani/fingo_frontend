import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import dotenv from "dotenv";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
    trustedOrigins: ["http://localhost:5173"],
    secret: process.env.BETTER_AUTH_SECRET || "change-this-to-a-secure-random-string",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        }
    }
});
