import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, deleteTicket, type Ticket, type GetTicketsParams } from '../api/tickets';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validateTicketForm } from '../utils/validation';
import type { ValidationErrors } from '../utils/validation';
import ErrorDisplay from '../components/ErrorDisplay';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  ticketCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  ticketTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  ticketDescription: {
    color: '#666',
    marginBottom: '12px',
    minHeight: '20px',
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
  ticketActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90vw',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  textarea: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    minHeight: '80px',
    resize: 'vertical' as const,
  },
  select: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  modalActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '18px',
    padding: '40px',
  },
  searchContainer: {
    marginBottom: '20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '200px',
    flex: '1',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  sortContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  sortButton: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  },
  sortButtonActive: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  priorityBadge: {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    marginLeft: '8px',
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
  ticketMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
  viewButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open' as 'Open' | 'In Progress' | 'Closed',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
  });
  
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [searchQuery, statusFilter, sortBy, sortOrder]);

  const loadTickets = async () => {
    try {
      const params: GetTicketsParams = {
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        sortOrder,
      };
      const ticketsData = await getTickets(params);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      alert('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddTicket = () => {
    setEditingTicket(null);
    setFormData({ title: '', description: '', status: 'Open', priority: 'Medium' });
    setFormErrors({});
    setShowModal(true);
  };

  const handleViewTicket = (ticket: Ticket) => {
    navigate(`/tickets/${ticket._id}`);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    
    try {
      await deleteTicket(id);
      setTickets(tickets.filter(ticket => ticket._id !== id));
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      alert('Failed to delete ticket');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormErrors({});
    
    const validationErrors = validateTicketForm(formData.title, formData.description);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    setIsSubmittingForm(true);
    try {
      if (editingTicket) {
        // Update existing ticket
        const updatedTicket = await updateTicket(editingTicket._id, formData);
        setTickets(tickets.map(ticket => 
          ticket._id === editingTicket._id ? updatedTicket : ticket
        ));
      } else {
        // Create new ticket
        const newTicket = await createTicket(formData);
        setTickets([...tickets, newTicket]);
      }
      
      setShowModal(false);
      setFormData({ title: '', description: '', status: 'Open', priority: 'Medium' });
      setFormErrors({});
    } catch (error: any) {
      console.error('Failed to save ticket:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save ticket';
      setFormErrors({ form: [errorMessage] });
    } finally {
      setIsSubmittingForm(false);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={styles.container}>Loading tickets...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Tickets</h1>
        <div style={styles.headerActions}>
          <button style={styles.addButton} onClick={handleAddTicket}>
            Add New Ticket
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.searchContainer}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search tickets by title or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select
          style={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        
        <div style={styles.sortContainer}>
          <span style={{ fontSize: '14px', color: '#666' }}>Sort by:</span>
          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'createdAt' ? styles.sortButtonActive : {}),
            }}
            onClick={() => setSortBy('createdAt')}
          >
            Date
          </button>
          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'title' ? styles.sortButtonActive : {}),
            }}
            onClick={() => setSortBy('title')}
          >
            Title
          </button>
          <button
            style={styles.sortButton}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div style={styles.emptyState}>
          No tickets found. Create your first ticket!
        </div>
      ) : (
        <div style={styles.ticketGrid}>
          {tickets.map(ticket => (
            <div key={ticket._id} style={styles.ticketCard}>
              <h3 style={styles.ticketTitle}>{ticket.title}</h3>
              <p style={styles.ticketDescription}>
                {ticket.description || 'No description'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={getStatusStyle(ticket.status)}>
                  {ticket.status}
                </span>
                <span style={getPriorityStyle(ticket.priority)}>
                  {ticket.priority}
                </span>
              </div>
              <div style={styles.ticketMeta}>
                <span>#{ticket._id.slice(-6)}</span>
                <span>
                  Created by: {typeof ticket.createdBy === 'object' ? ticket.createdBy.name : 'Unknown'}
                </span>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>
              <div style={styles.ticketActions}>
                <button 
                  style={styles.viewButton}
                  onClick={() => handleViewTicket(ticket)}
                >
                  View Details
                </button>
                <button 
                  style={styles.editButton}
                  onClick={() => handleEditTicket(ticket)}
                >
                  Edit
                </button>
                <button 
                  style={styles.deleteButton}
                  onClick={() => handleDeleteTicket(ticket._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>{editingTicket ? 'Edit Ticket' : 'Add New Ticket'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <ErrorDisplay errors={formErrors.form} />
              
              <div>
                <input
                  style={{
                    ...styles.input,
                    borderColor: formErrors.title ? '#dc3545' : '#ddd'
                  }}
                  type="text"
                  placeholder="Ticket title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={isSubmittingForm}
                />
                <ErrorDisplay errors={formErrors.title} />
              </div>
              
              <div>
                <textarea
                  style={{
                    ...styles.textarea,
                    borderColor: formErrors.description ? '#dc3545' : '#ddd'
                  }}
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmittingForm}
                />
                <ErrorDisplay errors={formErrors.description} />
              </div>
              <select
                style={styles.select}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                disabled={isSubmittingForm}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                style={styles.select}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                disabled={isSubmittingForm}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Priority</option>
              </select>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                  disabled={isSubmittingForm}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    ...styles.saveButton,
                    backgroundColor: isSubmittingForm ? '#ccc' : '#28a745'
                  }}
                  disabled={isSubmittingForm}
                >
                  {isSubmittingForm 
                    ? 'Saving...' 
                    : `${editingTicket ? 'Update' : 'Create'} Ticket`
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
