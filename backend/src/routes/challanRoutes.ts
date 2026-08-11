import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createChallan, getChallans, getChallanById } from '../controllers/challanController';

const router = Router();

router.use(authenticateToken);

router.post('/', createChallan);
router.get('/', getChallans);
router.get('/:id', getChallanById);

export default router;
