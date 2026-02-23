import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contactSection: {
    gap: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  contactLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  missingValue: {
    color: '#bbb',
  },
});
