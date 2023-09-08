import { ObjectId } from 'mongoose';

export interface JwtToken {
    _id: ObjectId;
    role: string;
    is_verified?: boolean;
}

export interface AuthOptions {
    isTokenRequired?: boolean;
    usersAllowed?: string[];
}

export interface decoded {
    user: {
        _id: ObjectId;
        role: string;
    }
}

export interface sendEmailOptions {
    to: string;
    name: string;
};
