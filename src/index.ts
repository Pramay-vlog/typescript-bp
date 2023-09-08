import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors"; 2
import path from "path";
import config from "./config";
import routes from "./routes";
import errorHandler from "./middlewares/error.handler";
import { logger } from "./utils/logger";
import "./config/db.config"


const app: Application = express();
const { port } = config;


// External  Middleware
app.use( express.static( path.resolve( "./public" ) ) );


app.use( helmet( { contentSecurityPolicy: false } ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( cors() );


// Error Handling
app.use( errorHandler );


// api routes
app.use( "/api/v1", routes );


// listen
app.listen( port, () => {
    logger.debug( `Server running on http://localhost:${ port }` );
} );

export default app;