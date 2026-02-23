import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { Mosque } from '../types';

type Props = {
  mosque: Mosque;
};

export const MosqueInfo = ({ mosque }: Props) => (
  <View style={styles.contactSection}>
    <ContactRow icon="📍" label={mosque.address} placeholder="Not available" />
    <ContactRow icon="✉" label={mosque.email} placeholder="Not available" />
    <ContactRow icon="🌐" label={mosque.website} placeholder="Not available" />
    <ContactRow icon="📞" label={mosque.phone} placeholder="Not available" />
  </View>
);

const ContactRow = ({
  icon,
  label,
  placeholder,
}: {
  icon: string;
  label?: string;
  placeholder: string;
}) => (
  <View style={styles.contactRow}>
    <Text style={styles.contactIcon}>{icon}</Text>
    <Text style={[styles.contactLabel, !label && styles.missingValue]}>
      {label || placeholder}
    </Text>
  </View>
);
