import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createChallan, getChallans, getChallanById, updateChallanStatus } from '../controllers/challanController';

const router = Router();

router.use(authenticateToken);

router.post('/', createChallan);
router.get('/', getChallans);
router.get('/:id', getChallanById);
router.put('/:id/status', updateChallanStatus);

export default router;
