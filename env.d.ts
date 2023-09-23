declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            DATABASE_URL: string;
            JWT_SECRET: string;
            JWT_ISSUER: string;
        }
    }
}
