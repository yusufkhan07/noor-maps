import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { t } from '../../app/translations';
import { styles } from './styles';

const T = t.missingTimingsBanner;

type Props = {
  onAddTimings: () => void;
};

export const MissingTimingsBanner = ({ onAddTimings }: Props) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>🕌</Text>
      <Text style={styles.title}>{T.title}</Text>
      <Text style={styles.description}>{T.description}</Text>
      <TouchableOpacity style={styles.cta} onPress={onAddTimings} activeOpacity={0.8}>
        <Text style={styles.ctaText}>{T.cta}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDismissed(true)} activeOpacity={0.6}>
        <Text style={styles.dismissText}>{T.dismiss}</Text>
      </TouchableOpacity>
    </View>
  );
};
