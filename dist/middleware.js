"use strict";
// header:{
//     Aithorization: "Bearer token"
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthorization = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let TOKEN_SECRET = process.env.TOKEN_SECRET || "claveSecreta";
function validateAuthorization(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ message: "Campo no enviado" });
    if (!authorization.startsWith("Bearer "))
        return res.status(401).json({ message: "Token format is wrong, must start with 'Bearer'" });
    const token = authorization.replace("Bearer ", "");
    const user = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
    req.user = user;
    next();
}
exports.validateAuthorization = validateAuthorization;
