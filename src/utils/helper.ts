import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import config from "../config";
import { JwtToken } from "../types/helper.types";


export const helper = {


    hashPassword: async ( { password }: { password: string } ) => {

        const salt = await bcrypt.genSalt( 10 );
        const hashedPassword = await bcrypt.hash( password, salt );
        return hashedPassword;

    },


    generateToken: async ( { data }: { data: JwtToken } ) => {

        const token = await JWT.sign( data, config.jwt.secret, /* { expiresIn: 360000 } */ );
        return token;

    },


    decodeToken: async ( { token }: { token: string } ) => {

        const decoded = await JWT.verify( token, config.jwt.secret );
        return decoded;

    },


    comparePassword: async ( { password, hashedPassword }: { password: string, hashedPassword: string } ) => {

        const isMatch = await bcrypt.compare( password, hashedPassword );
        return isMatch;

    },

};