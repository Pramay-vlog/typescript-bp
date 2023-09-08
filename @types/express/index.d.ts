export { };

declare global {
    namespace Express {
        interface Request {
            file?: any;
            files?: any;
            query?: string;
            params?: string;
            headers?: string;
            user?: any
        }
        interface Response {
            api: any;
        }
    }
}