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
    <View style={styles.banner}>
      <Text style={styles.icon}>🕌</Text>
      <View style={styles.body}>
        <Text style={styles.title}>{T.title}</Text>
        <Text style={styles.description}>{T.description}</Text>
        <TouchableOpacity style={styles.cta} onPress={onAddTimings}>
          <Text style={styles.ctaText}>{T.cta}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.dismissBtn}
        onPress={() => setDismissed(true)}
      >
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};
