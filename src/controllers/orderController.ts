import Stripe from "stripe";
import type { Request, Response } from "express";
import Restaurante, { MenuItemType } from "../models/restauranteModel.js";
import Order from "../models/orderModels.js";
import _default from '../../dist/models/userModel.js';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckOutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    address: string;
    city: string;
  };
  restaurantId: string;
};

const createLineItems = (
  checkOutSessionRequest: CheckOutSessionRequest,
  menuItems: MenuItemType[],
) => {
  const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString(),
    );
    if (!menuItem) {
      throw new Error("Menu Item no encontrado " + cartItem.name);
    }

    const lineItem = {
      price_data: {
        currency: "mxn",
        unit_amount: Math.round(parseFloat(menuItem.price as string) * 100),
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return lineItem;
  });
  return lineItems;
};

const createStripeSession = async (
  lineItems: any,
  orderId: string,
  deliveryPrice: number,
  restaurantId: string,
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.round(deliveryPrice * 100),
            currency: "mxn",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId, 
      restaurantId,
    },
    success_url: FRONTEND_URL + "/order-status?success=true",
    cancel_url: FRONTEND_URL + "/detail/" + restaurantId + "?cancelled=true",
  });
  return sessionData;
};

export const createCheckOutSession = async (req: Request, res: Response) => {
  try {
    const checkOutSessionRequest: CheckOutSessionRequest = req.body;
    const restaurante = await Restaurante.findById(
      checkOutSessionRequest.restaurantId,
    );
    if (!restaurante) {
      throw new Error("Restaurante no encontrado");
    }
    const newOrder = new Order({
      restaurantId: checkOutSessionRequest.restaurantId,
      userId: req.userId,
      deliveryDetails: checkOutSessionRequest.deliveryDetails,
      cartItems: checkOutSessionRequest.cartItems,
      totalAmount: 0,
      status: "placed",
      createdAt: new Date(),
    });
    const lineItems = createLineItems(
      checkOutSessionRequest,
      restaurante.menuItems,
    );
    const session = await createStripeSession(
      lineItems,
      newOrder._id.toString(),
      restaurante.deliverPrice,
      restaurante._id.toString(),
    );
    if (!session.url) {
      return res
        .status(500)
        .json({ message: "Error al crear una sesion de Stripe" });
    }

    await newOrder.save();

    res.json({ url: session.url });
  } catch (error: any) {
    console.log("Error al crear la sesion de Stripe", error.message || error);
    res.status(500).json({
      message:
        error.raw?.message ||
        error.message ||
        "Error al crear la sesion de Stripe",
    });
  }
};

export const stripeWebHookHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Webhook errors: " + error.message });
  }
  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";
    await order.save();
  }
  return res.status(200).send();
};