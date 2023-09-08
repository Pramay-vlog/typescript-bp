import { ObjectId } from 'mongoose';


export interface User {
    _id: ObjectId;
    user_name: string;
    email: string;
    mobile: string;
    password: string;
    role_id: {
        _id: ObjectId;
        name: string;
    };
    is_active: boolean;
}

export interface FetchUser {
    page?: number;
    limit?: number;
    skip?: number;
    sort_by?: string;
    sort_order?: number;
    search?: string;
    [ key: string ]: any;
}