import { Request, Response, query } from 'express'
import { message } from "../../constants";
import { USER_MODEL, ROLE_MODEL, OTP_MODEL } from '../../model';
import { helper } from "../../utils/helper";
import { User, FetchUser } from "../../types/controller.types"
import { sendEmail } from "../../services";
import ApiResponse from "../../utils/apiResponse";
import { logger } from '../../utils/logger';
import enums from "../../constants/enums";



export const UserController = {

    signIn: async ( req: Request, res: Response ) => {


        const user: User = await USER_MODEL.findOne( { email: req.body.email, is_active: true } ).populate( "role_id", "name" ).lean();
        if ( !user ) return ApiResponse.NOT_FOUND( { res, message: message.NOT_FOUND } );

        const isPasswordValid = await helper.comparePassword( { password: req.body.password, hashedPassword: user.password } );
        if ( !isPasswordValid ) return ApiResponse.BAD_REQUEST( { res, message: message.INVALID_PASSWORD } );

        const token = await helper.generateToken( { data: { _id: user._id, role: user.role_id.name } } );

        return ApiResponse.OK( {

            res,
            message: message.SUCCESS,
            data: {
                email: user.email,
                user_name: user.user_name,
                role: user.role_id.name,
                token
            }

        } )

    },


    signUp: async ( req: Request, res: Response ) => {

        if ( await USER_MODEL.findOne( { $or: [ { email: req.body.email }, { mobile: req.body.mobile } ] } ).lean() ) {

            return ApiResponse.DUPLICATE_VALUE( { res, message: message.USER_ALREADY_EXISTS } );

        }

        const roleExists = await ROLE_MODEL.findById( req.body.role_id ).lean();
        if ( !roleExists ) return ApiResponse.NOT_FOUND( { res, message: message.INVALID_ROLE } );

        req.body.role_id = roleExists._id;

        let user = await USER_MODEL.create( req.body );

        const token = await helper.generateToken( { data: { _id: user._id, role: roleExists.name } } );

        return ApiResponse.OK( {

            res,
            message: message.SUCCESS,
            data: {
                email: user.email,
                user_name: user.user_name,
                role: roleExists.name,
                token
            }

        } )

    },


    forgotPassword: async ( req: Request, res: Response ) => {

        const userExists = await USER_MODEL.findOne( { email: req.body.email, is_active: true } ).populate( "role_id", "name" ).lean();
        if ( !userExists ) return ApiResponse.NOT_FOUND( { res, message: message.NOT_FOUND } );

        const otp = await sendEmail( { to: userExists.email, name: userExists.user_name } );
        logger.warn( `OTP: ${ otp }` );

        await OTP_MODEL.findOneAndUpdate( { email: req.body.email }, { otp }, { upsert: true } );

        return ApiResponse.OK( { res, message: message.SUCCESS } );

    },


    verifyOtp: async ( req: Request, res: Response ) => {

        const verifyOtp = await OTP_MODEL.findOne( { email: req.body.email, otp: req.body.otp } ).lean();
        if ( !verifyOtp ) return ApiResponse.BAD_REQUEST( { res, message: message.INVALID_OTP } );

        if ( new Date( new Date().setSeconds( 0, 0 ) ).toISOString() > new Date( new Date( verifyOtp.updatedAt ).getTime() + ( 1 * 60 * 60 * 1000 ) ).toISOString() ) {

            return ApiResponse.BAD_REQUEST( { res, message: message.OTP_EXPIRED } );

        }

        await OTP_MODEL.findByIdAndDelete( verifyOtp._id );

        const userExists: User = await USER_MODEL.findOne( { email: req.body.email, is_active: true }, { _id: 1, role_id: 1 } ).populate( "role_id", "name" ).lean();

        const token = await helper.generateToken( { data: { _id: userExists._id, role: userExists.role_id.name, is_verified: true } } );

        return ApiResponse.OK( { res, message: message.SUCCESS, data: token } );

    },


    changeForgotPassword: async ( req: Request, res: Response ) => {

        const token = req.header( "x-auth-token" );
        if ( !token ) return ApiResponse.BAD_REQUEST( { res, message: message.TOKEN_REQUIRED } );

        const decoded: any = await helper.decodeToken( { token } );
        if ( !decoded || !decoded.is_verified ) return ApiResponse.UNAUTHORIZED( { res, message: message.INVALID_TOKEN } );

        const update = await USER_MODEL.findByIdAndUpdate( decoded._id, { password: await helper.hashPassword( { password: req.body.password } ) } );
        if ( !update ) return ApiResponse.NOT_FOUND( { res, message: message.NOT_FOUND } );

        return ApiResponse.OK( { res, message: message.SUCCESS } );

    },


    changePassword: async ( req: Request, res: Response ) => {

        const userExists = await USER_MODEL.findOne( { _id: req.user._id, is_active: true } ).lean();
        if ( !userExists ) return ApiResponse.NOT_FOUND( { res, message: message.NOT_FOUND } );

        const isPasswordValid = await helper.comparePassword( { password: req.body.old_password, hashedPassword: userExists.password } );
        if ( !isPasswordValid ) return ApiResponse.BAD_REQUEST( { res, message: message.INVALID_PASSWORD } );

        await USER_MODEL.findByIdAndUpdate( req.user._id, { password: await helper.hashPassword( { password: req.body.password } ) } );

        return ApiResponse.OK( { res, message: message.SUCCESS } );

    },


    update: async ( req: Request, res: Response ) => {

        const userExists = await USER_MODEL.findOne( { _id: req.params._id, is_active: true } ).lean();
        if ( !userExists ) return ApiResponse.NOT_FOUND( { res, message: message.NOT_FOUND } );

        if ( req.user.role_id.name !== enums.ROLE.ADMIN && req.user._id.toString() !== req.params._id ) return ApiResponse.UNAUTHORIZED( { res, message: message.UNAUTHORIZED } );

        if ( req.body.email && await USER_MODEL.findOne( { _id: { $ne: userExists._id }, email: req.body.email } ).lean() ) return ApiResponse.DUPLICATE_VALUE( { res, message: message.EMAIL_ALREADY_EXISTS } );

        const data = await USER_MODEL.findByIdAndUpdate( req.params._id, req.body, { new: true } ).lean();

        return ApiResponse.OK( { res, message: message.SUCCESS, data } );

    },


    delete: async ( req: Request, res: Response ) => {

        const userExists = await USER_MODEL.findOne( { _id: req.params._id, is_active: true } ).lean();
        if ( !userExists ) return ApiResponse.NOT_FOUND( { res, message: message.NOT_FOUND } );

        await USER_MODEL.findByIdAndUpdate( req.params._id, { is_active: !userExists.is_active }, { new: true } );

        return ApiResponse.OK( { res, message: message.SUCCESS } );

    },


    get: async ( req: Request, res: Response ) => {

        let { skip, page, limit, sort_by, sort_order, search, ...query }: FetchUser = req.query;

        skip = ( ( page || 1 ) - 1 ) * ( limit || 10 );
        let sort_options: any = {};
        sort_options[ ( sort_by || "createdAt" ) ] = ( sort_order || -1 );

        search ? query.$or = [
            { user_name: { $regex: search, $options: 'i' } },
        ] : ""

        query = req.user.role_id.name === enums.ROLE.ADMIN ? { ...query } : { ...query, _id: req.user._id, is_active: true };

        const data = await USER_MODEL
            .find( query )
            .skip( skip )
            .limit( limit || 10 )
            .sort( sort_options )
            .populate( "role_id", "name" )
            .lean();

        return ApiResponse.OK( { res, message: message.SUCCESS, data: { count: await USER_MODEL.countDocuments( query ), data } } );

    },


    dashboard_counts: async ( req: Request, res: Response ) => {

        const data = {
            user_count: await USER_MODEL.countDocuments( { role_id: await ROLE_MODEL.find( { name: enums.ROLE.USER } ), is_active: true } ),
        }

        return ApiResponse.OK( { res, message: message.SUCCESS, data } );

    },

};