import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/apiResponse";

import { enums } from "../constants";
import { USER_MODEL } from "../model";
import { message } from "../constants";
import { helper } from "../utils/helper";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import config from "../config";
import { AuthOptions } from "../types/helper.types"
import { User } from "../types/controller.types"


const auth = ( { isTokenRequired = true, usersAllowed = [] }: AuthOptions = {} ) => {

    return async ( req: any, res: Response, next: NextFunction ) => {

        const token: string = req.header( "x-auth-token" );
        if ( isTokenRequired && !token ) return ApiResponse.BAD_REQUEST( { res, message: message.TOKEN_REQUIRED } );
        if ( !isTokenRequired && !token ) return next();

        let user: User;

        try {

            let decoded: any = await helper.decodeToken( { token } );

            user = await USER_MODEL.findOne( { _id: decoded._id, is_active: true } ).populate( "role_id" ).lean();
            if ( !user ) return ApiResponse.UNAUTHORIZED( { res, message: message.INVALID_TOKEN } );

        } catch ( error ) {

            logger.error( `ERROR: ${ error }` );
            return ApiResponse.UNAUTHORIZED( { res, message: message.INVALID_TOKEN } );

        }

        req.user = user;

        if ( usersAllowed.length ) {

            if ( req.user.role_id.name === enums.ROLE.ADMIN ) return next();
            if ( usersAllowed.includes( "*" ) ) return next();
            if ( usersAllowed.includes( req.user.role_id.name ) ) return next();

            return ApiResponse.UNAUTHORIZED( { res, message: message.UNAUTHORIZED } );

        } else {

            if ( req.user.role_id.name === enums.ROLE.ADMIN ) return next();
            return ApiResponse.UNAUTHORIZED( { res, message: message.UNAUTHORIZED } );

        }
    };

};

export default auth;
