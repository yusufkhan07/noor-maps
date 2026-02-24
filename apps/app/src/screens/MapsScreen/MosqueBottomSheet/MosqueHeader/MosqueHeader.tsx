import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

type Props = {
  title: string;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  onClose: () => void;
};

export const MosqueHeader = ({ title, isFavourite, onToggleFavourite, onClose }: Props) => (
  <View style={styles.nameRow}>
    <Text style={styles.mosqueName}>{title}</Text>
    <View style={styles.actions}>
      <TouchableOpacity onPress={onToggleFavourite} style={styles.favButton}>
        <Text style={[styles.favIcon, isFavourite && styles.favIconActive]}>
          {isFavourite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
);
