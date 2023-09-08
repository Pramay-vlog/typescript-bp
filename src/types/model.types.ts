import { ObjectId } from 'mongoose';

export interface OtpModel {
    _id: ObjectId,
    otp: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface RoleModel {
    name: string,
    description: string,
    is_active: boolean,
}

export interface UserModel {
    _id: ObjectId,
    user_name: string,
    email: string,
    mobile: string,
    password: string,
    role_id: ObjectId,
    is_active: boolean,
}