import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

type Props = {
  title: string;
  isFavourite: boolean;
  onToggleFavourite: () => void;
};

export const MosqueHeader = ({ title, isFavourite, onToggleFavourite }: Props) => (
  <View style={styles.nameRow}>
    <Text style={styles.mosqueName}>{title}</Text>
    <TouchableOpacity onPress={onToggleFavourite} style={styles.favButton}>
      <Text style={[styles.favIcon, isFavourite && styles.favIconActive]}>
        {isFavourite ? '♥' : '♡'}
      </Text>
    </TouchableOpacity>
  </View>
);
