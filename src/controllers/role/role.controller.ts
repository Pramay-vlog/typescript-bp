import { Request, Response } from 'express'
import { ROLE_MODEL } from "../../model";
import { message } from "../../constants";
import ApiResponse from "../../utils/apiResponse";


export const RoleController = {

    createRole: async ( req: Request, res: Response ) => {


        let roleExists = await ROLE_MODEL.findOne( { name: req.body.name, is_active: true } );
        if ( roleExists ) return ApiResponse.DUPLICATE_VALUE( { res, message: message.DUPLICATE_KEY } )

        let result = await ROLE_MODEL.create( req.body )
        return ApiResponse.OK( { res, message: message.SUCCESS, data: result } )

    },

    getRole: async ( req: Request, res: Response ) => {

        let result = await ROLE_MODEL.find( { is_active: true } )

        return ApiResponse.OK( { res, message: message.SUCCESS, data: result } )

    },

}
