import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ticket, Comment } from '../types';
import { commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommentsList from '../components/CommentsList';
import AddComment from '../components/AddComment';

interface TicketDetailScreenProps {
  route: {
    params: {
      ticket: Ticket;
    };
  };
  navigation: any;
}

export default function TicketDetailScreen({ route, navigation }: TicketDetailScreenProps) {
  const { ticket } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(ticket._id);
      setComments(response);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch comments');
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: `Ticket #${ticket._id.slice(-6)}`,
    });
    fetchComments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComments();
  };

  const handleAddComment = async (content: string) => {
    if (!content.trim()) {
      Alert.alert('Error', 'Comment cannot be empty');
      return;
    }

    setAddingComment(true);
    try {
      const newComment = await commentAPI.createComment(ticket._id, content.trim());
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await commentAPI.deleteComment(commentId);
              setComments(prevComments => 
                prevComments.filter(comment => comment._id !== commentId)
              );
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete comment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#FF9500';
      case 'In Progress': return '#007AFF';
      case 'Closed': return '#34C759';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return '#34C759';
      case 'Medium': return '#FF9500';
      case 'High': return '#FF3B30';
      case 'Critical': return '#8B0000';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.ticketHeader}>
          <Text style={styles.title}>{ticket.title}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getStatusColor(ticket.status) }]}>
              <Text style={styles.badgeText}>{ticket.status}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getPriorityColor(ticket.priority) }]}>
              <Text style={styles.badgeText}>{ticket.priority}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ticketInfo}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{ticket.description}</Text>
        </View>

        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Created:</Text>
            <Text style={styles.metadataValue}>{formatDate(ticket.createdAt)}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>ID:</Text>
            <Text style={styles.metadataValue}>#{ticket._id}</Text>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>
            Comments ({comments.length})
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : (
            <CommentsList
              comments={comments}
              currentUserId={user?._id || ''}
              onDeleteComment={handleDeleteComment}
            />
          )}
        </View>
      </ScrollView>

      <AddComment
        onAddComment={handleAddComment}
        loading={addingComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  ticketHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  metadata: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  metadataValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  commentsSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});