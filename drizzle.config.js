import dotenv from 'dotenv';
dotenv.config();

/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: "postgresql://neondb_owner:npg_mx4gbitjdT2l@ep-divine-voice-a1di1cbu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    }
};
