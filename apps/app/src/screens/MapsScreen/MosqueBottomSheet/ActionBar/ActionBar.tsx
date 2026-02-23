import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

type Props = {
  onGetDirections: () => void;
  onEditTimings: () => void;
};

export const ActionBar = ({ onGetDirections, onEditTimings }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.actionRow}
  >
    <TouchableOpacity style={styles.actionChip} onPress={onGetDirections}>
      <Text style={styles.actionChipIcon}>↗</Text>
      <Text style={styles.actionChipLabel}>Directions</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionChip} onPress={onEditTimings}>
      <Text style={styles.actionChipIcon}>✎</Text>
      <Text style={styles.actionChipLabel}>Edit Timings</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.actionChip, styles.actionChipLast]} onPress={() => {}}>
      <Text style={styles.actionChipIcon}>⚑</Text>
      <Text style={styles.actionChipLabel}>Report a Mistake</Text>
    </TouchableOpacity>
  </ScrollView>
);
