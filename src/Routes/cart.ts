import express from 'express';
import { CartModel } from '../models/cart';
import { auth, AuthRequest } from '../Middleware/auth';

export const cartRouter = express.Router();

cartRouter.use(auth);

cartRouter.get('/', async (req: AuthRequest, res) => {
  try {
    let cart = await CartModel.findOne({ userId: req.user?.id }).populate('items.itemId');
    if (!cart) {
      cart = await CartModel.create({ userId: req.user?.id, items: [] });
    }
    const cartItems = cart.items.map(item => ({
      id: item.itemId.toString(),
      quantity: item.quantity,
    }));

    
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

cartRouter.post('/add', async (req: AuthRequest, res) => {
  try {
    const { itemId, quantity } = req.body;
    let cart = await CartModel.findOne({ userId: req.user?.id });
    if (!cart) {
      cart = await CartModel.create({ userId: req.user?.id, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.itemId.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ itemId, quantity });
    }
    
    await cart.save();
    res.json(cart.items);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

cartRouter.post('/remove', async (req: AuthRequest, res) => {
  try {
    const { itemId } = req.body;
    let cart = await CartModel.findOne({ userId: req.user?.id });
    if (cart) {
      cart.items = cart.items.filter(item => item.itemId.toString() !== itemId) as any;
      await cart.save();
    }
    res.json(cart?.items || []);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

cartRouter.post('/update', async (req: AuthRequest, res) => {
  try {
    const { itemId, quantity } = req.body;
    let cart = await CartModel.findOne({ userId: req.user?.id });
    if (cart) {
      const item = cart.items.find(item => item.itemId.toString() === itemId);
      if (item) {
        item.quantity = quantity;
        await cart.save();
      }
    }
    res.json(cart?.items || []);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart' });
  }
});