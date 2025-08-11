import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, getComments, createComment, deleteComment, type Ticket, type Comment } from '../api/tickets';
import { useAuth } from '../context/AuthContext';
import { validateComment } from '../utils/validation';
import ErrorDisplay from '../components/ErrorDisplay';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  ticketCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  badges: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
  },
  statusOpen: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusInProgress: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusClosed: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  priorityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
  },
  priorityLow: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  priorityMedium: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  priorityHigh: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  priorityCritical: {
    backgroundColor: '#721c24',
    color: 'white',
  },
  metadata: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
    borderTop: '1px solid #eee',
    paddingTop: '16px',
    gap: '16px',
  },
  commentsSection: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
  },
  commentsList: {
    marginBottom: '20px',
  },
  comment: {
    borderBottom: '1px solid #eee',
    paddingBottom: '16px',
    marginBottom: '16px',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: '12px',
    color: '#666',
  },
  commentContent: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.4',
  },
  deleteCommentButton: {
    padding: '4px 8px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  addCommentForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  commentInput: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical' as const,
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  emptyComments: {
    textAlign: 'center' as const,
    color: '#666',
    fontStyle: 'italic',
    padding: '20px',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#666',
  },
};

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentErrors, setCommentErrors] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadTicketAndComments();
    }
  }, [id]);

  const loadTicketAndComments = async () => {
    try {
      if (!id) return;
      
      const [ticketData, commentsData] = await Promise.all([
        getTicket(id),
        getComments(id),
      ]);
      
      setTicket(ticketData);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load ticket details:', error);
      alert('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setCommentErrors([]);
    
    const validation = validateComment(newComment);
    if (!validation.isValid) {
      setCommentErrors(validation.errors);
      return;
    }
    
    if (!id) return;
    
    setSubmitting(true);
    try {
      const comment = await createComment(id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment('');
      setCommentErrors([]);
    } catch (error: any) {
      console.error('Failed to add comment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add comment';
      setCommentErrors([errorMessage]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Open':
        return { ...styles.statusBadge, ...styles.statusOpen };
      case 'In Progress':
        return { ...styles.statusBadge, ...styles.statusInProgress };
      case 'Closed':
        return { ...styles.statusBadge, ...styles.statusClosed };
      default:
        return styles.statusBadge;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Low':
        return { ...styles.priorityBadge, ...styles.priorityLow };
      case 'Medium':
        return { ...styles.priorityBadge, ...styles.priorityMedium };
      case 'High':
        return { ...styles.priorityBadge, ...styles.priorityHigh };
      case 'Critical':
        return { ...styles.priorityBadge, ...styles.priorityCritical };
      default:
        return styles.priorityBadge;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading ticket details...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Ticket not found</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => navigate('/tickets')}
        >
          ← Back to Tickets
        </button>
      </div>

      <div style={styles.ticketCard}>
        <h1 style={styles.title}>{ticket.title}</h1>
        <p style={styles.description}>
          {ticket.description || 'No description provided'}
        </p>
        
        <div style={styles.badges}>
          <span style={getStatusStyle(ticket.status)}>
            {ticket.status}
          </span>
          <span style={getPriorityStyle(ticket.priority)}>
            {ticket.priority}
          </span>
        </div>
        
        <div style={styles.metadata}>
          <div>
            <div>ID: #{ticket._id}</div>
            <div>Created by: {typeof ticket.createdBy === 'object' ? ticket.createdBy.name : 'Unknown'}</div>
          </div>
          <div>
            <div>Created: {formatDate(ticket.createdAt)}</div>
            {ticket.assignedTo && (
              <div>Assigned to: {ticket.assignedTo.name}</div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.commentsSection}>
        <h2 style={styles.sectionTitle}>
          Comments ({comments.length})
        </h2>
        
        <div style={styles.commentsList}>
          {comments.length === 0 ? (
            <div style={styles.emptyComments}>
              No comments yet. Be the first to add a comment!
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment._id} style={styles.comment}>
                <div style={styles.commentHeader}>
                  <div>
                    <span style={styles.commentAuthor}>
                      {comment.userId.name}
                    </span>
                    <span style={styles.commentDate}>
                      {' • '}{formatCommentDate(comment.createdAt)}
                    </span>
                  </div>
                  {user && comment.userId._id === user.id && (
                    <button
                      style={styles.deleteCommentButton}
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={styles.commentContent}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleAddComment} style={styles.addCommentForm}>
          <div>
            <textarea
              style={{
                ...styles.commentInput,
                borderColor: commentErrors.length > 0 ? '#dc3545' : '#ddd'
              }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment here... (2-500 characters)"
              disabled={submitting}
              maxLength={500}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px'
            }}>
              <ErrorDisplay errors={commentErrors} />
              <span style={{
                fontSize: '12px',
                color: newComment.length > 450 ? '#dc3545' : '#666'
              }}>
                {newComment.length}/500
              </span>
            </div>
          </div>
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              backgroundColor: submitting || !newComment.trim() ? '#ccc' : '#007bff'
            }}
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Adding...' : 'Add Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}