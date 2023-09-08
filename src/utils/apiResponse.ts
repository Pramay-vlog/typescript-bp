import { Response } from "express";
import { enums } from "../constants";


const ApiResponse = {

    BAD_REQUEST: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.BAD_REQUEST ).json( {
            success: false,
            status: enums.HTTP_CODES.BAD_REQUEST,
            message,
            data,
        } );
    },

    DUPLICATE_VALUE: ( { res, message, data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.DUPLICATE_VALUE ).json( {
            success: false,
            status: enums.HTTP_CODES.DUPLICATE_VALUE,
            message: message || "Duplicate value.",
            data,
        } );
    },

    FORBIDDEN: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.FORBIDDEN ).json( {
            success: false,
            status: enums.HTTP_CODES.FORBIDDEN,
            message,
            data,
        } );
    },

    CATCH_ERROR: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        let responseCode = enums.HTTP_CODES.INTERNAL_SERVER_ERROR;

        if ( ( message && message.includes( "validation failed" ) ) || message.includes( "duplicate key error collection" ) ) {
            responseCode = enums.HTTP_CODES.BAD_REQUEST;
        }

        res.status( responseCode ).json( {
            success: false,
            status: responseCode,
            message,
            data,
        } );
    },

    NOT_ACCEPTABLE: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.NOT_ACCEPTABLE ).json( {
            success: false,
            status: enums.HTTP_CODES.NOT_ACCEPTABLE,
            message,
            data,
        } );
    },

    NOT_FOUND: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.NOT_FOUND ).json( {
            success: false,
            status: enums.HTTP_CODES.NOT_FOUND,
            message,
            data,
        } );
    },

    OK: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.OK ).json( {
            success: true,
            status: enums.HTTP_CODES.OK,
            message,
            data,
        } );
    },

    UNAUTHORIZED: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.UNAUTHORIZED ).json( {
            success: false,
            status: enums.HTTP_CODES.UNAUTHORIZED,
            message,
            data,
        } );
    },

    VALIDATION_ERROR: ( { res, message = "-", data = {} }: { res: Response, message?: string, data?: any } ) => {
        res.status( enums.HTTP_CODES.VALIDATION_ERROR ).json( {
            success: false,
            status: enums.HTTP_CODES.VALIDATION_ERROR,
            message,
            data,
        } );
    },

}


export default ApiResponse;