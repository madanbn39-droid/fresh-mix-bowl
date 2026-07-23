import { Router } from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';
import { Role } from '../models/User';

const router = Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN), updateProduct)
  .delete(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN), deleteProduct);

export default router;
