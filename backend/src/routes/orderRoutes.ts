import { Router } from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';
import { Role } from '../models/User';

const router = Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF), getMyOrders); // Typically get all orders for admin

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.DELIVERY), updateOrderStatus);

export default router;
