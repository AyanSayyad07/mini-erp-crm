import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createProduct, getProducts, updateProduct } from '../controllers/productController';

const router = Router();

router.use(authenticateToken);

router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);

export default router;
