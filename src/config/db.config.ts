import mongoose from "mongoose";
import config from "../config";
const { mongoURL } = config;
import { logger } from "../utils/logger";

interface Error {
    message: string;
    stack: string;
}

mongoose
    .connect( mongoURL )
    .then( () => logger.verbose( `DB connected 🤝` ) )
    .catch( ( err: Error ) => {

        logger.error( `DB connection failed ❌`, err );
        process.exit( 1 ); // Exit process with failure

    } );
