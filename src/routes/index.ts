import { Request, Response } from "express";
import ApiResponse from "../utils/apiResponse";
import { Router } from 'express'
const router = Router();


import roleRoute from './role.routes'
import userRoute from './user.routes'

router.use( '/role', roleRoute )
router.use( '/user', userRoute )


// Root Route
router.get( "/", async ( req: Request, res: Response ) => {
    return ApiResponse.OK( { res, message: `Welcome to the Backend apis!` } )
} );


// Wrong Route
router.use( ( req: Request, res: Response ) => {
    return ApiResponse.NOT_FOUND( { res, message: `Oops! Looks like you're lost.` } )
} );


export default router;
