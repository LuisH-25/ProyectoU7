"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Importando Prisma Client
const client_1 = require("@prisma/client");
dotenv_1.default.config();
// Iniciando el cliente
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
const TOKEN_SECRET = process.env.TOKEN_SECRET;
console.log("TOKEN_SECRET");
console.log(TOKEN_SECRET);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`El servidor se ejecuta en http://localhost:${port}`);
});
app.post("/api/v1/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, date_born } = req.body;
    const last_session = new Date();
    const update_at = new Date();
    const saltRounds = 10;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    const user = yield prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            last_session,
            update_at,
            date_born: new Date()
        },
    });
    res.json(user);
}));
app.post("/api/v1/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log(user);
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    //revisar aqui  
    console.log(TOKEN_SECRET);
    console.log(email);
    //   const token = jwt.sign(user, TOKEN_SECRET, {
    //     expiresIn: "1h",
    // });
    // res.cookie('token', token, { httpOnly: true });  
    return res.json({ message: 'Logged in successfully' });
    //return res.status(201).json({user, token});      // 201: creado  
}));
app.post(" /api/v1/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, genre, duration } = req.body;
    const song = yield prisma.song.create({
        data: {
            name: name,
            artist: artist,
            album: album,
            year: year,
            genre: genre,
            duration: duration
        },
    });
    res.json(song);
}));
app.get("/api/v1/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findMany();
    res.json(result);
}));
app.get("/api/v1/songs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const result = yield prisma.user.findUnique({
        where: {
            id
        },
    });
    res.json(result);
}));
