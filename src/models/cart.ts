import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  itemId: { type: String, ref: 'Item', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema]
});

export const CartModel = mongoose.model('Cart', CartSchema);