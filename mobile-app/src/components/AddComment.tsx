import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { commentSchema, CommentFormData } from '../utils/validationSchemas';
import FormInput from './FormInput';

interface AddCommentProps {
  onAddComment: (content: string) => Promise<void>;
  loading: boolean;
}

export default function AddComment({ onAddComment, loading }: AddCommentProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  const content = watch('content');

  const onSubmit = async (data: CommentFormData) => {
    if (loading) return;
    
    await onAddComment(data.content);
    reset();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FormInput
              name="content"
              control={control}
              error={errors.content}
              placeholder="Add a comment..."
              multiline
              numberOfLines={3}
              maxLength={500}
              editable={!loading && !isSubmitting}
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!content?.trim() || loading || isSubmitting) && styles.sendButtonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!content?.trim() || loading || isSubmitting}
          >
            {loading || isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.characterCount}>
          {content?.length || 0}/500
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 14,
    backgroundColor: '#f8f8f8',
    marginBottom: 0,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
});