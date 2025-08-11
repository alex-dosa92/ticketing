import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Control, Controller, FieldError, FieldPath, FieldValues } from 'react-hook-form';

interface OptionType {
  label: string;
  value: string;
}

interface FormPickerProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  error?: FieldError;
  options: OptionType[];
  placeholder?: string;
}

export default function FormPicker<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  error,
  options,
  placeholder = 'Select an option',
}: FormPickerProps<TFieldValues>) {
  const showPicker = (onChange: (value: string) => void, currentValue: string) => {
    const buttons = [
      ...options.map((option) => ({
        text: option.label,
        onPress: () => onChange(option.value),
      })),
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ];

    Alert.alert(label || 'Select Option', '', buttons);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const selectedOption = options.find(option => option.value === value);
          
          return (
            <TouchableOpacity
              style={[
                styles.picker,
                error && styles.pickerError,
              ]}
              onPress={() => showPicker(onChange, value)}
            >
              <Text style={[
                styles.pickerText,
                !selectedOption && styles.placeholderText,
              ]}>
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          );
        }}
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
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  pickerError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
});