import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TicketStatus, TicketPriority } from '../types';
import { ticketAPI } from '../services/api';
import { ticketSchema, TicketFormData } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import FormPicker from '../components/FormPicker';

interface CreateTicketScreenProps {
  navigation: any;
}

const statusOptions = [
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Closed', value: 'Closed' },
];

const priorityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Critical', value: 'Critical' },
];

export default function CreateTicketScreen({ navigation }: CreateTicketScreenProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TicketFormData>({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Open',
      priority: 'Medium',
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      await ticketAPI.createTicket({
        title: data.title.trim(),
        description: data.description?.trim() || '',
        status: data.status as TicketStatus,
        priority: data.priority as TicketPriority,
      });
      
      Alert.alert('Success', 'Ticket created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create ticket';
      
      // Set field-specific errors based on error message
      if (errorMessage.toLowerCase().includes('title')) {
        setError('title', { message: errorMessage });
      } else if (errorMessage.toLowerCase().includes('description')) {
        setError('description', { message: errorMessage });
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <FormInput
            name="title"
            control={control}
            error={errors.title}
            label="Title *"
            placeholder="Enter ticket title"
            maxLength={100}
            editable={!isSubmitting}
          />

          <FormInput
            name="description"
            control={control}
            error={errors.description}
            label="Description"
            placeholder="Describe the issue in detail"
            multiline
            numberOfLines={6}
            maxLength={1000}
            editable={!isSubmitting}
          />

          <FormPicker
            name="status"
            control={control}
            error={errors.status}
            label="Status"
            options={statusOptions}
            placeholder="Select status"
          />

          <FormPicker
            name="priority"
            control={control}
            error={errors.priority}
            label="Priority"
            options={priorityOptions}
            placeholder="Select priority"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={[
            styles.cancelButtonText,
            isSubmitting && styles.disabledText,
          ]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button, 
            styles.createButton,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Ticket</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#999',
  },
});