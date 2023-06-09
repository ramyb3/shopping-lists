import { Schema, model, models } from "mongoose";

export type List = {
  date: string;
  products: Product[];
};

export type Product = {
  name: string;
  quantity: number;
  unit: string;
};

const userSchema = new Schema({
  email: String,
  authorized: Boolean,
  verification: Number,
  firstTimeUser: Boolean,
  lists: Array<List>,
  realTimeList: Array<Product>,
  collectedProducts: Array<Product>,
});

const User = models.User || model("users", userSchema);

export default User;
