import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import {
  createCheckOutSession,
  stripeWebHookHandler,
  getOrders,
  getRestaurantOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  '/checkout/create-checkout-session',
  jwtCheck,
  jwtParse,
  createCheckOutSession,
);

//ruta para prosesar las peticiones del webHook
router.post('/checkout/webhook', stripeWebHookHandler);

//Ruta para obtener las odenes de un cliente 
router.get(
  '/',
  jwtCheck,
  jwtParse,
  getOrders,
);

//Ruta para obtener las ordenes de un restaurante
router.get(
  '/order',
  jwtCheck,
  jwtParse,
  getRestaurantOrders
);

//Ruta para actualizar el status de una orden
router.patch(
  '/:orderId/status',
  jwtCheck,
  jwtParse,
  updateOrderStatus
);

export default router;