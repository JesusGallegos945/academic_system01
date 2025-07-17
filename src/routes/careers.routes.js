import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router()

router.get('/careers', authRequired, (req, res) => res.send('careers'))

export default router;