import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { TicketStatus } from '../types';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TicketStatus | 'all';
  onStatusFilterChange: (status: TicketStatus | 'all') => void;
  sortBy: 'createdAt' | 'title';
  onSortByChange: (sortBy: 'createdAt' | 'title') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const statusOptions: (TicketStatus | 'all')[] = ['all', 'Open', 'In Progress', 'Closed'];

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: SearchFilterProps) {
  const getStatusColor = (status: TicketStatus | 'all') => {
    switch (status) {
      case 'Open': return '#FF9500';
      case 'In Progress': return '#007AFF';
      case 'Closed': return '#34C759';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search tickets by title or ID..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Status:</Text>
        <View style={styles.statusFilters}>
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusFilter,
                statusFilter === status && styles.activeStatusFilter,
                { borderColor: getStatusColor(status) }
              ]}
              onPress={() => onStatusFilterChange(status)}
            >
              <Text
                style={[
                  styles.statusText,
                  statusFilter === status && { color: getStatusColor(status) }
                ]}
              >
                {status === 'all' ? 'All' : status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sortRow}>
        <View style={styles.sortGroup}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'createdAt' && styles.activeSortButton
            ]}
            onPress={() => onSortByChange('createdAt')}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === 'createdAt' && styles.activeSortText
              ]}
            >
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'title' && styles.activeSortButton
            ]}
            onPress={() => onSortByChange('title')}
          >
            <Text
              style={[
                styles.sortText,
                sortBy === 'title' && styles.activeSortText
              ]}
            >
              Title
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Text style={styles.orderText}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statusFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeStatusFilter: {
    backgroundColor: '#f0f8ff',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeSortText: {
    color: '#fff',
  },
  orderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});