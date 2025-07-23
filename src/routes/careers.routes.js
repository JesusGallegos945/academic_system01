import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { 
  createCareer,
  getCareers,
  getCareer,
  updateCareer,
  deleteCareer
} from '../controllers/career.controller.js';

const router = Router();

// Rutas para careers
router.post('/create-careers', createCareer);
router.get('/get-careers', getCareers);
router.get('/get-careers/:id', getCareer);
router.put('/update-careers/:id', authRequired, updateCareer);
router.delete('/delete-careers/:id', authRequired, deleteCareer);

export default router;