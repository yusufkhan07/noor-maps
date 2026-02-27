import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { t } from '../../../../app/translations';
import { useReportMistake } from '../mutations/useReportMistake';
import { Mosque } from '../types';
import { styles } from './styles';

const T = t.reportMistake;

type Props = {
  visible: boolean;
  mosque: Mosque;
  onClose: () => void;
};

type FormState = {
  address: string;
  email: string;
  website: string;
  phone: string;
};

export const ReportMistakeModal = ({ visible, mosque, onClose }: Props) => {
  const [form, setForm] = useState<FormState>({
    address: mosque.address ?? '',
    email: mosque.email ?? '',
    website: mosque.website ?? '',
    phone: mosque.phone ?? '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setForm({
        address: mosque.address ?? '',
        email: mosque.email ?? '',
        website: mosque.website ?? '',
        phone: mosque.phone ?? '',
      });
      setError(null);
    }
  }, [visible, mosque]);

  const { mutateAsync, isPending } = useReportMistake(onClose);

  const hasChanges =
    form.address !== (mosque.address ?? '') ||
    form.email !== (mosque.email ?? '') ||
    form.website !== (mosque.website ?? '') ||
    form.phone !== (mosque.phone ?? '');

  const handleSubmit = async () => {
    setError(null);
    const patch: { address?: string; email?: string; website?: string; phone?: string } = {};
    if (form.address !== (mosque.address ?? '')) patch.address = form.address;
    if (form.email !== (mosque.email ?? '')) patch.email = form.email;
    if (form.website !== (mosque.website ?? '')) patch.website = form.website;
    if (form.phone !== (mosque.phone ?? '')) patch.phone = form.phone;

    try {
      await mutateAsync({ mosqueId: mosque.id, patch });
    } catch {
      setError(T.submitError);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.navButton} disabled={isPending}>
            <Text style={styles.cancelText}>{T.cancel}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{T.title}</Text>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.navButton}
            disabled={!hasChanges || isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#1a6b3c" />
            ) : (
              <Text style={[styles.submitText, !hasChanges && styles.submitTextDisabled]}>
                {T.submit}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>{mosque.title}</Text>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <View style={styles.fieldList}>
          <Field
            label={T.addressLabel}
            value={form.address}
            onChangeText={(v) => setForm((f) => ({ ...f, address: v }))}
            placeholder={T.addressPlaceholder}
            multiline
          />
          <Field
            label={T.emailLabel}
            value={form.email}
            onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
            placeholder={T.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label={T.websiteLabel}
            value={form.website}
            onChangeText={(v) => setForm((f) => ({ ...f, website: v }))}
            placeholder={T.websitePlaceholder}
            keyboardType="url"
            autoCapitalize="none"
          />
          <Field
            label={T.phoneLabel}
            value={form.phone}
            onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
            placeholder={T.phonePlaceholder}
            keyboardType="phone-pad"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'email-address' | 'url' | 'phone-pad';
  autoCapitalize?: 'none';
}) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#bbb"
      multiline={multiline}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  </View>
);
