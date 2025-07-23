import { Router } from 'express';
import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacher.controller.js';

const router = Router();

router.post('/teachers', createTeacher);
router.get('/teachers', getTeachers);
router.get('/teachers/:id', getTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

export default router; 