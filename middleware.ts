// header:{
//     Aithorization: "Bearer token"
// }

import { NextFunction } from "express";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
let TOKEN_SECRET = process.env.TOKEN_SECRET || "claveSecreta";

export function validateAuthorization(req: any, res: any, next: any) { 
    const { authorization } = req.headers; 
    console.log(authorization); 

    if (!authorization) return res.status(401).json({ message: "Campo no enviado" }); 

    if (!authorization.startsWith("Bearer ")) 
        return res.status(401).json({ message: "Token format is wrong, must start with 'Bearer'" });

    const token = authorization.replace("Bearer ", "");

    console.log(token); 
    console.log("token"); 
    console.log(TOKEN_SECRET); 
    console.log("TOKEN_SECRET"); 

    try {
        const decoded = verify(token, TOKEN_SECRET);
        console.log(decoded); 
        console.log("decoded"); 
        return decoded;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            console.log("Token expired");
        } else if (err instanceof JsonWebTokenError) {
            console.log("Invalid token");
        }
        return null;
    }
}