// header:{
//     Aithorization: "Bearer token"
// }

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from "express";

dotenv.config();
let TOKEN_SECRET = process.env.TOKEN_SECRET || "claveSecreta";

export function validateAuthorization(req: any, res: any, next: any) { 
    const { authorization } = req.headers; 
    
    if (!authorization) return res.status(401).json({ message: "Campo no enviado" }); 

    if (!authorization.startsWith("Bearer ")) 
        return res.status(401).json({ message: "Token format is wrong, must start with 'Bearer'" });

    const token = authorization.replace("Bearer ", "");

    const user = jwt.verify(token, TOKEN_SECRET);
    (req as any).user = user;
    next()
}