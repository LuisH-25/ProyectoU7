import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { validateAuthorization } from "./middleware";

import bcrypt from "bcrypt"
//import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e from 'express';

dotenv.config();

const prisma = new PrismaClient()
const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`El servidor se ejecuta en http://localhost:${PORT}`);
});

//PRINT ALL USER (MOSTRAR TODOS LOS USUARIOS) CON AUTENTICACION
app.get('/', async (req: Request, res: Response) =>{
  const users = await prisma.user.findMany();
  res.send(users);
})

//SIGN UP (CREAR USUARIO)
app.post("/api/v1/users", async (req: Request, res: Response) => {
    const { name, email, password, date_born} = req.body;
    const last_session= new Date()
    const update_at= new Date()
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user_email = await prisma.user.findUnique(
      {
        where : {email}
      }
    );

    try {
      const user = await prisma.user.create({
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
    } catch (e) { 
        res.status(500).json({ message: 'Error creating user' });
    }
      
    
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
    
    const token = jwt.sign(user,process.env.TOKEN_SECRET!, {  
      expiresIn: "1h",  
    })  
    return res.json({ message: 'Logged in successfully' ,user, token});  

  });

//CREAR SONG
  app.post("/api/v1/songs", async (req: Request, res: Response) => {
    const data = req.body;
    try{
      const song = await prisma.song.create({
        data
      });
      return res.json({ message: 'Song created successfully' ,song});  
    }catch (e) {
      return res.status(500).json({ message: 'Error creating song' });
    }
  });

//LISTAR CANCIONES LOGUEADO
app.post("/api/v1/songs/all",validateAuthorization, async (req: Request, res: Response) => {
  try{
    const songs = await prisma.song.findMany();
    return res.send({ message: 'Song listed successfully', songs});
  }catch (e){
    return res.status(500).json({ message: 'Intentar por el método get sino tiene autenticacion', e });
  }
});

//LISTAR CANCIONES SIN LOGUEARSE
app.get("/api/v1/songs/all", async (req: Request, res: Response) => {
  const songs = await prisma.song.findMany(
    {  where: {
      isPrivate: false
     }
    }
  );
    
    return res.send({ message: 'Song listed successfully', songs});
});

//LISTAR CANCIONES POR ID
  app.get("/api/v1/songs/:id",validateAuthorization, async (req: Request, res: Response) => {
    const {id} = req.body;
    const result = await prisma.song.findUnique({
        where: {
          id
        },
      })
    return res.json({ message: 'Song listed by id successfully', result});
  });

  //CREAR PLAYLIST
  app.post("/api/v1/createplaylist", async (req: Request, res: Response) => {
    const { name, user_id} = req.body;
    const playlist = await prisma.playlist.create({
      data: {
       name,
       user: { connect: { id: user_id } },
      },
    });
    return res.json({ message: 'Playlist created successfully' ,playlist});  
  });

  //AÑADIR UNA CANCION EN PLAYLIST 
  app.post("/api/v1/playlist", async (req: Request, res: Response) => {
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
  
    return res.json({ message: 'Song added to playlist successfully' ,playlist});  
  });

 