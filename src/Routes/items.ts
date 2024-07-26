import express from 'express';
import { ItemModel } from '../models/item';

export const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res) => {
  try {
    const items = await ItemModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

itemsRouter.get('/:id', async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item' });
  }
});