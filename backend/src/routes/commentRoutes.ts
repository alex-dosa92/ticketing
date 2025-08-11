import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getCommentsByTicket,
  createComment,
  deleteComment,
} from '../controllers/commentController';

const router = Router();

router.get('/tickets/:ticketId/comments', authenticate, getCommentsByTicket);
router.post('/tickets/:ticketId/comments', authenticate, createComment);
router.delete('/comments/:commentId', authenticate, deleteComment);

export default router;