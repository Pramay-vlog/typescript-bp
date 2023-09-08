import Joi from 'joi';
import { enums } from "../../constants"
import { validator } from '../../middlewares/validator';

export const UserValidators = {

    signUp: validator( {

        body: Joi.object( {
            user_name: Joi.string(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            mobile: Joi.string().required().length( 10 ),
            role_id: Joi
                .string()
                .pattern( /^[0-9a-fA-F]{24}$/ )
                .required(),
        } ),

    } ),


    signIn: validator( {

        body: Joi.object( {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        } ),

    } ),


    forgotPassword: validator( {

        body: Joi.object( {
            email: Joi.string().email().required(),
        } ),

    } ),


    verifyOtp: validator( {

        body: Joi.object( {
            email: Joi.string().email().required(),
            otp: Joi.string().required(),
        } ),

    } ),


    changeForgotPassword: validator( {

        body: Joi.object( {
            password: Joi.string().required(),
        } ),

    } ),


    changePassword: validator( {

        body: Joi.object( {
            old_password: Joi.string().required(),
            password: Joi.string().required(),
        } ),

    } ),


    update: validator( {

        body: Joi.object( {
            user_name: Joi.string(),
            email: Joi.string().email(),
            mobile: Joi.string().length( 10 ),
        } ),

        params: Joi.object( {
            _id: Joi
                .string()
                .pattern( /^[0-9a-fA-F]{24}$/ )
                .required(),
        } ),

    } ),


    toggleActive: validator( {

        params: Joi.object( {
            _id: Joi
                .string()
                .pattern( /^[0-9a-fA-F]{24}$/ )
                .required(),
        } ),

    } ),


    get: validator( {

        query: Joi.object( {
            page: Joi.number().default( 1 ),
            limit: Joi.number().default( 10 ),
            skip: Joi.number(),
            sort_by: Joi.string().default( "createdAt" ),
            sort_order: Joi.number().default( -1 ),
            search: Joi.string().allow( "" ),
            _id: Joi
                .string()
                .pattern( /^[0-9a-fA-F]{24}$/ ),
            user_name: Joi.string(),
            email: Joi.string().email(),
            mobile: Joi.string().length( 10 ),
        } ),

    } ),

}