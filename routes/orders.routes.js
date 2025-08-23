import { Router } from 'express';
import { createNewPesanan } from '../controllers/transaction/pesanan.controller.js';

const orderRouter = Router();

orderRouter.post('/', createNewPesanan);

orderRouter.post('/', (req, res) => res.send('CREATE new order'));

orderRouter.get('/:id', (req, res) => res.send('GET order details'));

orderRouter.put('/:id', (req, res) => res.send('UPDATE order'));

orderRouter.delete('/:id', (req, res) => res.send('DELETE order'));

export default orderRouter;
