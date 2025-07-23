import { Router } from 'express';
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup
} from '../controllers/group.controller.js';

const router = Router();

router.post('/groups', createGroup);
router.get('/groups', getGroups);
router.get('/groups/:id', getGroup);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

export default router; 