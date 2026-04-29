import { Router } from "express";
import { createUser, updateUser, getUser } from "../controllers/useConstroller.js";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import { validateUserRequest } from "../middleware/validation.js";
const router = Router();
//ruta para crear el usuario
router.post("/", jwtCheck, createUser);
//ruta para actualizar el usuario
router.put("/", jwtCheck, jwtParse, validateUserRequest, updateUser);
// Ruta para obtener un usuario
router.get('/', jwtCheck, jwtParse, getUser);
export default router;
//# sourceMappingURL=userRouters.js.map