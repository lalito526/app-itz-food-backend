import { type Request, type Response, type NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId: string;
            auth0Id: string;
        }
    }
}
export declare const jwtCheck: import("express").Handler;
export declare const jwtParse: (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=auth.d.ts.map