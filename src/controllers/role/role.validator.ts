import Joi from 'joi';
import { enums } from "../../constants"
import { validator } from '../../middlewares/validator';

export const RoleValidators = {

    createRole: validator( {

        body: Joi.object( {
            name: Joi.string().required().valid( ...Object.values( enums.ROLE ) ),
            description: Joi.string().required(),
        } ),

    } ),

}