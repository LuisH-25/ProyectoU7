import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { validateAuthorization } from './middleware';
// Importando Prisma Client
import { PrismaClient } from '@prisma/client'


dotenv.config();

// Iniciando el cliente
const prisma = new PrismaClient()
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
const TOKEN_SECRET = process.env.TOKEN_SECRET || "claveSecreta";

app.get('/', async (req: Request, res: Response) =>{
  const users = await prisma.user.findMany();

  res.send(users);
})

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}`);
});

//CREAR USER
app.post("/api/v1/users", async (req, res) => {
    const { name, email, password, date_born} = req.body;
    const last_session= new Date()
    const update_at= new Date()
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const user = await prisma.user.create({
        data: {
            name ,
            email ,
            password : hashedPassword,
            last_session ,
            update_at ,
            date_born : new Date()
          },
    });
    res.json(user);
  });

  
//LOGIN
  app.post("/api/v1/users/login", async (req: Request, res: Response) => {  
    const { email, password } = req.body;  
    const user = await prisma.user.findUnique({  
      where: { email },  
      });  

    if (!user) {  
        return res.status(401).json({ message: 'Invalid email or password' });  
    }  
    console.log(user) 
    
    const isMatch = await bcrypt.compare(password, user.password );  
    if (!isMatch) {  
      return res.status(401).json({ message: 'Invalid email or password' });  
    }  
    
    //revisar aqui  
    console.log(TOKEN_SECRET) 
    console.log(email) 

   
    const token = jwt.sign(user,TOKEN_SECRET, {  
      expiresIn: "1h",  
    })  
    // const token = jwt.sign({ username }, jwtKey, {
    //   algorithm: "HS256",
    //   expiresIn: jwtExpirySeconds,
    //  })

    console.log(token) 
    console.log(TOKEN_SECRET) 
    // token = "Bearer " + token;
    // res.cookie('token', token, { httpOnly: true });  
    return res.json({ message: 'Logged in successfully' ,user, token});  

  });

//CREAR SONG
  app.post("/api/v1/songs", async (req, res) => {
    const { name, artist ,album, year , genre ,duration, status} = req.body;
    const song = await prisma.song.create({
      data: {
        name,
        artist,
        album,
        year,
        genre,
        duration,
        status
      },
    });
    res.json(song);
  });

//LISTAR CANCIONES
  app.get("/api/v1/songs", async (req, res) => {
    const result = await prisma.song.findMany();
    res.json(result);
  });

  //LISTAR CANCIONES POR ID
  app.get("/api/v1/songs/:id", async (req, res) => {
    const {id} = req.body;
    const result = await prisma.song.findUnique({
        where: {
          id
        },
      })
    res.json(result);
  });

  //CREAR PLAYLIST
    // EJEMPLO DE CREACION DE UN PLAYLIST
    // { 
    //   "name": "Playlist 1", 
    //   "user_id": 1
    // }
  app.post("/api/v1/createplaylist", async (req, res) => {
    const { name, user_id} = req.body;
    const playlist = await prisma.playlist.create({
      data: {
       name,
       user: { connect: { id: user_id } },
      },
    });
    return res.json({ message: 'Playlist creado satisfactoriamente' ,playlist});  
  });
  //CREAR CANCION EN PLAYLIST 
  app.post("/api/v1/playlist", async (req, res) => {
    const data = req.body;

    const playlist = await prisma.playlist.update({
      where:{
        id: data.id_playlist
      },
      include: {
        songs: true,
      },
      data: {
        songs: { connect: { id: data.id_song } }
      }
    });
  
    return res.json({ message: 'Cancion añadida al Playlist satisfactoriamente' ,playlist});  
  });

  // app.post("/api/v1/playlist", async (req, res) => {  
  //   const { id_playlist, id_song } = req.body;  
  //   const playlist = await prisma.playlistSongs.create({ 
  //     data: { 
  //       playlist: { connect: { id: id_playlist } }, 
  //       song: { connect: { id: id_song } } ,
  //       id_playlist: id_playlist, 
  //       id_song: id_song, 
  //     }, 
  //   }); 
  //   res.json(playlist);  
  // });