import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

type Props = {
  visible: boolean;
  title: string;
  body: string;
  submitLabel: string;
  cancelLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  visible,
  title,
  body,
  submitLabel,
  cancelLabel,
  onSubmit,
  onCancel,
}: Props) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitText}>{submitLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
