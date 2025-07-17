import { Router } from 'express';
import { 
  login, register, logout, profile,
  createCareer, getCareers, getCareer, updateCareer, deleteCareer 
} from '../controllers/AuthController.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);

// Career routes
router.post('/careers', authRequired, createCareer);
router.get('/careers', getCareers);
router.get('/careers/:id', getCareer);
router.put('/careers/:id', authRequired, updateCareer);
router.delete('/careers/:id', authRequired, deleteCareer);

export default router;