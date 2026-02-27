import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAddMosque } from './mutations/useAddMosque';
import { styles } from './styles';

type Props = {
  visible: boolean;
  coordinate: { latitude: number; longitude: number };
  onClose: () => void;
  onSuccess: () => void;
};

export const AddMosqueModal = ({ visible, coordinate, onClose, onSuccess }: Props) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const { mutateAsync: addMosque, isPending } = useAddMosque(() => {
    resetForm();
    onSuccess();
  });

  const resetForm = () => {
    setName('');
    setAddress('');
    setPhone('');
    setEmail('');
    setWebsite('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await addMosque({
      title: name.trim(),
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      coordinate,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add a Mosque</Text>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. East London Mosque"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 82–92 Whitechapel Rd"
              placeholderTextColor="#aaa"
              value={address}
              onChangeText={setAddress}
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="+44 20 7247 1357"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="info@mosque.org"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 12 }]}>Website</Text>
            <TextInput
              style={styles.input}
              placeholder="https://mosque.org"
              placeholderTextColor="#aaa"
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.submitBtn, (!name.trim() || isPending) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!name.trim() || isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Add Mosque</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} disabled={isPending}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
