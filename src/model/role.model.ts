import { Schema, model } from 'mongoose';
import { RoleModel } from '../types/model.types';


const roleSchema = new Schema<RoleModel>( {

    name: { type: String },
    description: { type: String },
    is_active: { type: Boolean, default: true },

}, { timestamps: true, versionKey: false } );


const Roles = model( 'Role', roleSchema, 'Role' );
export default Roles;