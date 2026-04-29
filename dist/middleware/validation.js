var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { body, validationResult } from "express-validator";
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //si hay errores en los datos del request
        return res.status(400).json({ errors: errors.array() });
    }
    next();
});
export const validateUserRequest = [
    body("name")
        .isString()
        .notEmpty()
        .withMessage("El nombre debe ser un string"),
    body("address")
        .isString()
        .notEmpty()
        .withMessage("La direccion debe ser un string"),
    body("city")
        .isString()
        .notEmpty()
        .withMessage("La ciudad debe ser un string"),
    body("country")
        .isString()
        .notEmpty()
        .withMessage("El pais debe ser un string"),
    handleValidationErrors,
];
//# sourceMappingURL=validation.js.map