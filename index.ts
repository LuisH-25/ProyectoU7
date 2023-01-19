import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


// Importando Prisma Client
import { PrismaClient } from '@prisma/client'

dotenv.config();

// Iniciando el cliente
const prisma = new PrismaClient()
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
const TOKEN_SECRET = process.env.TOKEN_SECRET || "claveSecreta";

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`El servidor se ejecuta en http://localhost:${port}`);
});

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

  

app.post("/api/v1/users/login", async (req: Request, res: Response) => { 
    const { email, password } = req.body; 
    const user = await prisma.user.findMany({ 
      where: { email }, 
      }); 
    if (!user) { 
        return res.status(401).json({ message: 'Invalid email or password' }); 
    } 
   
    const isMatch = await bcrypt.compare(password, user.password ); 
    if (!isMatch) { 
      return res.status(401).json({ message: 'Invalid email or password' }); 
    } 
 
    const token = jwt.sign(email,TOKEN_SECRET, { 
      expiresIn: "1h", 
    }) 
 
    res.cookie('token', token, { httpOnly: true }); 
 
    return res.json({ message: 'Logged in successfully' }); 
    //return res.status(201).json({user, token});      // 201: creado 
  });


  app.post(" /api/v1/songs", async (req, res) => {
    const { name, artist,album,year,genre,duration} = req.body;
    const song = await prisma.song.create({
      data: {
        name: name,
        artist : artist,
        album: album,
        year: year,
        genre: genre,
        duration:duration
      },
    });
    res.json(song);
  });


  app.get("/api/v1/songs", async (req, res) => {
    const result = await prisma.user.findMany();
    res.json(result);
  });

  app.get("/api/v1/songs/:id", async (req, res) => {
    const { id} = req.body;
    const result = await prisma.user.findUnique({
        where: {
          id

        },
      })
    res.json(result);
  });

