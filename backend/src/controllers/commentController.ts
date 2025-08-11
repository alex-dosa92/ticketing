import { Request, Response } from 'express';
import Comment from '../models/Comment';
import { Ticket } from '../models/Ticket';
import { AuthRequest } from '../types/auth';

export const getCommentsByTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const comments = await Comment.find({ ticketId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const comment = new Comment({
      content,
      ticketId,
      userId,
    });

    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};