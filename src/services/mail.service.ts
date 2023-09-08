import nodemailer from 'nodemailer';
import config from '../config';
import { logger } from '../utils/logger';
import { sendEmailOptions } from '../types/helper.types';

let transporter = nodemailer.createTransport( {

    host: config.email_host,
    port: config.email_port,
    secure: true, // true for 465, false for other ports
    auth: {
        user: config.email_user, // generated ethereal user
        pass: config.email_password, // generated ethereal password
    },

} );

export const sendEmail = async ( { to, name }: sendEmailOptions ) => {

    const otp = Math.floor( Math.random() * ( 999999 - 100000 + 1 ) + 100000 );

    try {

        await transporter.sendMail( {
            from: config.email_user,
            to: to, // list of receivers
            subject: "One Time Password",
            html: `<p>Hi, This is Otp <b>${otp}</b> 🙂<p/>`,
        } );

        return otp;

    } catch ( error ) {

        logger.error( ` MAIL SENDING ERROR: ${ error }` );
        throw new Error( `Error in sending email` );

    }
};