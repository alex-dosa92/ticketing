import React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Control, Controller, FieldError, FieldPath, FieldValues } from 'react-hook-form';

interface FormInputProps<TFieldValues extends FieldValues> extends TextInputProps {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  error?: FieldError;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function FormInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  error,
  multiline = false,
  numberOfLines = 1,
  ...textInputProps
}: FormInputProps<TFieldValues>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              multiline && styles.multilineInput,
              error && styles.inputError,
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...textInputProps}
          />
        )}
      />
      {error && <Text style={styles.errorText}>• {error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
});