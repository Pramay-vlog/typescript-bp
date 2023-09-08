import { Schema, model } from 'mongoose';
import { logger } from '../utils/logger';
import { helper } from "../utils/helper";
import { UserModel } from '../types/model.types';



const userSchema = new Schema<UserModel>( {

    user_name: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role' },
    is_active: { type: Boolean, default: true },

}, { timestamps: true, versionKey: false } );


userSchema.pre( 'save', async function ( next ) {
    try {

        interface User {

            password: string;
            isModified: Function;
            isNew: boolean;

        }

        const user: User = this;

        if ( user.isModified( 'password' ) || user.isNew ) {
            user.password = await helper.hashPassword( { password: user.password } )
        }

    } catch ( err ) {
        logger.error( err )
    }
} )

userSchema.methods.toJSON = function () {

    var obj = this.toObject()
    delete obj[ 'password' ]
    return obj

}


const User = model( 'User', userSchema, 'User' );
export default User;