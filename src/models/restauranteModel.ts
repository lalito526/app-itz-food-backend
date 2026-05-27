import mongoose, { mongo } from "mongoose";
import { InferSchemaType } from "mongoose";

const menuItemSchema = new mongoose.Schema({
  _id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

// El restaurante se asocia a un usuario que es el administrador
// Del restaurante mediante un ID
const restauranteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restauranteName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  deliverPrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  cuisines: [{ type: String, required: true }],
  menuItems: [menuItemSchema],
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
});

export default mongoose.model("Restaurante", restauranteSchema);
