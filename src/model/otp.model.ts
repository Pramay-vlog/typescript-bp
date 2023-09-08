import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { OtpModel } from "../types/model.types";

const otpSchema = new Schema<OtpModel>( {

    email: { type: String },
    otp: { type: String },

},
    { timestamps: true, versionKey: false, }
);

const Otp = mongoose.model( 'Otp', otpSchema, 'Otp' );
export default Otp;
