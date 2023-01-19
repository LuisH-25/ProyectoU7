"use strict";
// header:{
//     Aithorization: "Bearer token"
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthorization = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let TOKEN_SECRET = process.env.TOKEN_SECRET || "claveSecreta";
function validateAuthorization(req, res, next) {
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization)
        return res.status(401).json({ message: "Campo no enviado" });
    if (!authorization.startsWith("Bearer "))
        return res.status(401).json({ message: "Token format is wrong, must start with 'Bearer'" });
    const token = authorization.replace("Bearer ", "");
    console.log(token);
    console.log("token");
    console.log(TOKEN_SECRET);
    console.log("TOKEN_SECRET");
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, TOKEN_SECRET);
        console.log(decoded);
        console.log("decoded");
        return decoded;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            console.log("Token expired");
        }
        else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            console.log("Invalid token");
        }
        return null;
    }
}
exports.validateAuthorization = validateAuthorization;
