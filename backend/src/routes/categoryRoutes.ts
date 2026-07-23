import { Router } from 'express';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';
import { Role } from '../models/User';

const router = Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN), updateCategory)
  .delete(protect, authorize(Role.ADMIN, Role.SUPER_ADMIN), deleteCategory);

export default router;
