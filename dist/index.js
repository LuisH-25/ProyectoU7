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
const client_1 = require("@prisma/client");
const middleware_1 = require("./middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
//import bcrypt from "bcrypt";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`El servidor se ejecuta en http://localhost:${PORT}`);
});
//PRINT ALL USER (MOSTRAR TODOS LOS USUARIOS) CON AUTENTICACION
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.send(users);
}));
//SIGN UP (CREAR USUARIO)
app.post("/api/v1/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, date_born } = req.body;
    const last_session = new Date();
    const update_at = new Date();
    const saltRounds = 10;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    const user_email = yield prisma.user.findUnique({
        where: { email }
    });
    try {
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                last_session,
                update_at,
                date_born: new Date(date_born)
            },
        });
        res.json({ message: 'User created successfully', user });
    }
    catch (e) {
        res.status(500).json({ message: 'Error creating user' });
    }
}));
//LOGIN
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
    const token = jsonwebtoken_1.default.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
    });
    return res.json({ message: 'Logged in successfully', user, token });
}));
//CREAR SONG
app.post("/api/v1/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const song = yield prisma.song.create({
            data
        });
        return res.json({ message: 'Song created successfully', song });
    }
    catch (e) {
        return res.status(500).json({ message: 'Error creating song', e });
    }
}));
//LISTAR CANCIONES
app.post("/api/v1/songs/all", middleware_1.validateAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield prisma.song.findMany();
    return res.send({ message: 'Song listed successfully', songs });
}));
//LISTAR CANCIONES POR ID
app.get("/api/v1/songs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const result = yield prisma.song.findUnique({
        where: {
            id
        },
    });
    return res.json({ message: 'Song listed by id successfully', result });
}));
//CREAR PLAYLIST
app.post("/api/v1/createplaylist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, user_id } = req.body;
    const playlist = yield prisma.playlist.create({
        data: {
            name,
            user: { connect: { id: user_id } },
        },
    });
    return res.json({ message: 'Playlist created successfully', playlist });
}));
//CREAR CANCION EN PLAYLIST 
app.post("/api/v1/playlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const playlist = yield prisma.playlist.update({
        where: {
            id: data.id_playlist
        },
        include: {
            songs: true,
        },
        data: {
            songs: { connect: { id: data.id_song } }
        }
    });
    return res.json({ message: 'Song added to playlist successfully', playlist });
}));
