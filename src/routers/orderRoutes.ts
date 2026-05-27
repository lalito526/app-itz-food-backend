import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import {
  createCheckOutSession,
  stripeWebHookHandler,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckOutSession,
);

router.post("/checkout/webhook", stripeWebHookHandler);

export default router;