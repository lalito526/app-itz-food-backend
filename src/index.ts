import type {Request, Response} from 'express';
import express from 'express'
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';


//importamps el archivo de rutas para usuarios
import useRouters from './routers/userRouters.js'
const app = express();
app.use(express.json());
app.use(cors())
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { error } from 'node:console';

//instancia de coneccion
dotenv.config()

mongoose.connect(process.env.DB_CONECTION_STRING  as string)
        .then(()=>{
            console.log('Base de datos conectada correctamente');
            console.log(process.env.DB_CONECTION_STRING);
        })
        .catch(()=>{
            console.log("Error en conectarse a labase de datos");
            console.log(error);
        })

app.get('/',async (req: Request, res: Response)=>{
    res.json("Hola desde express y TypeScript!!!");
})

app.get( '/health', async ( req: Request, res:Response)=>{
    res.send({message: '!servidor OK'})
});
app.use("/api/user",useRouters);
app.use(morgan( 'dev' ));

app.get('/', async (req: Request, res: Response)=>{
    res.redirect('/health')
});

const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log("App corriendo en el puerto: "+port)
})