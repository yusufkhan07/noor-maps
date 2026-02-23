import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  actionChipLast: {
    marginRight: 4,
  },
  actionChipIcon: {
    fontSize: 14,
    color: '#1a6b3c',
  },
  actionChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
