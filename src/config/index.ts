import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import { logger } from "../utils/logger";

dotenv.config( { path: path.join( __dirname, "../../.env" ) } );

// get the intended host and port number, use localhost and port 3000 if not provided
const envVarsSchema = Joi.object().keys( {

    PORT: Joi.number().default( 3000 ),
    DB_MONGODB_URI: Joi.string().required().description( "MONGO URL" ),
    JWT_SECRET_KEY: Joi.string().required().description( "JWT secret key" ),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default( 30 ).description( "minutes after which access tokens expire" ),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default( 30 ).description( "days after which refresh tokens expire" ),
    EMAIL_HOST: Joi.string().default( "smtp.gmail.com" ),
    EMAIL_PORT: Joi.number().default( 465 ),
    EMAIL_USER: Joi.string().required().description( "Email user" ),
    EMAIL_PASSWORD: Joi.string().required().description( "Email password" ),
    BUCKET: Joi.string().required().description( "AWS Bucket Name" ),
    REGION: Joi.string().required().description( "AWS Bucket Region" ),
    SECRET_KEY: Joi.string().required().description( "AWS Bucket Secret key" ),
    ACCESSKEYID: Joi.string().required().description( "AWS Bucket Access Key ID" ),

} ).unknown();

const { value: envVars, error } = envVarsSchema.prefs( { errors: { label: "key" } } ).validate( process.env );

if ( error ) {
    logger.error( `Config validation error: ${ error.message }` );
    throw new Error( `Config validation error: ${ error.message }` );
}

const config = {

    port: envVars.PORT,
    mongoURL: envVars.DB_MONGODB_URI,
    email_host: envVars.EMAIL_HOST,
    email_port: envVars.EMAIL_PORT,
    email_user: envVars.EMAIL_USER,
    email_password: envVars.EMAIL_PASSWORD,
    jwt: {
        secret: envVars.JWT_SECRET_KEY,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: 10,
    },
    s3_bucket: {
        bucket: envVars.BUCKET,
        region: envVars.REGION,
        secretKey: envVars.SECRET_KEY,
        accessKeyId: envVars.ACCESSKEYID,
    }

}

export default config;
