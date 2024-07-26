
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { itemsRouter } from './src/Routes/items';
import { cartRouter } from './src/Routes/cart';
import { authRouter } from './src/Routes/auth';
import { connectDB } from './src/db';
import path from 'path'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());

app.use('/api/items', itemsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});