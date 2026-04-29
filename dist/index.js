var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
//importamps el archivo de rutas para usuarios
import useRouters from './routers/userRouters.js';
const app = express();
app.use(express.json());
app.use(cors());
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { error } from 'node:console';
//instancia de coneccion
dotenv.config();
mongoose.connect(process.env.DB_CONECTION_STRING)
    .then(() => {
    console.log('Base de datos conectada correctamente');
    console.log(process.env.DB_CONECTION_STRING);
})
    .catch(() => {
    console.log("Error en conectarse a labase de datos");
    console.log(error);
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json("Hola desde express y TypeScript!!!");
}));
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: '!servidor OK' });
}));
app.use("/api/user", useRouters);
app.use(morgan('dev'));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect('/health');
}));
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("App corriendo en el puerto: " + port);
});
//# sourceMappingURL=index.js.map