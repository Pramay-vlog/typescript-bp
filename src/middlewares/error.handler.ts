import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { logger } from "../utils/logger";
import ApiResponse from "../utils/apiResponse";


const errorHandler = async ( err: any, req: Request, res: Response, next: NextFunction ) => {
    console.log(123)

    logger.warn( `ERROR at PATH: [${ req.path }] METHOD: [${ req.method }] MESSAGE: [${ err.message }]` )

    if ( err instanceof MulterError ) return ApiResponse.BAD_REQUEST( { res, message: err.message } )

    if ( err instanceof JsonWebTokenError || err instanceof TokenExpiredError ) return ApiResponse.UNAUTHORIZED( { res, message: err.message } )

    logger.error( `STACK_ERROR: ${ err }` )

    return ApiResponse.CATCH_ERROR( { res, message: err.message } )

}

export default errorHandler;